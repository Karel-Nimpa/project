install.packages(c("sf", "dplyr", "ggplot2"))
install.packages("spatstat", dependencies = TRUE)

# Load necessary libraries
library(sf)                 # for spatial vector data (points, polygons)
library(spatstat)
#library(spatstat.geom)      # for creating point pattern objects (ppp)
#library(spatstat.explore)   # for spatial statistics like Kcross
#library(spatstat.core)      # for Monte Carlo envelopes
library(dplyr)              # for data wrangling
library(ggplot2)            # for custom plotting (optional)

# --- 1) WORKING DIRECTORY -----------------------------------------------------
# Use forward slashes in R on Windows
setwd("D:/Geoinformatic/Geostatistic/portofolio")
getwd()   # Check that it's correctly set


# --- 2) INPUT FILES -----------------------------------------------------------
# Your two RData files are in the project ROOT (not in a subfolder).
crime_file <- "Crime_06_2024.Rdata"   # exactly as in your screenshot
venue_file <- "Venue.Rdata"           # exactly as in your screenshot
wards_file <- file.path("data","wards_27700.gpkg")  # optional; use if you have it

stopifnot(file.exists(crime_file), file.exists(venue_file))

# Helper: load the FIRST object from an .Rdata file (names inside can vary)
load_first_object <- function(path){
  e <- new.env()
  load(path, envir = e)     # load everything into a temporary environment
  objs <- ls(e)
  if(length(objs) == 0) stop(paste("No objects found in", path))
  e[[objs[1]]]              # return the first object found
}

obj_crime <- load_first_object(crime_file)
obj_venue <- load_first_object(venue_file)

# --- 3) COERCE TO sf AND STANDARDIZE CRS -------------------------------------
# Convert to sf if needed. Try common coordinate column names.
to_sf <- function(x){
  if(inherits(x, "sf")) return(x)
  nm <- tolower(names(x))
  lon <- which(nm %in% c("lon","longitude","lng"))
  lat <- which(nm %in% c("lat","latitude"))
  xx  <- which(nm %in% c("x","easting"))
  yy  <- which(nm %in% c("y","northing"))
  
  if(length(lon)==1 && length(lat)==1){
    return(st_as_sf(x, coords = c(names(x)[lon], names(x)[lat]), crs = 4326))
  }
  if(length(xx)==1 && length(yy)==1){
    return(st_as_sf(x, coords = c(names(x)[xx], names(x)[yy]), crs = 27700))
  }
  stop("Couldn't auto-detect coordinate columns. Tell me the coord column names and CRS.")
}

crimes_sf <- to_sf(obj_crime)
venues_sf <- to_sf(obj_venue)

# Ensure both layers have a CRS; reproject to British National Grid (EPSG:27700)
if(is.na(st_crs(crimes_sf))) stop("crimes_sf has no CRS metadata.")
if(is.na(st_crs(venues_sf))) stop("venues_sf has no CRS metadata.")
crimes_sf <- st_transform(crimes_sf, 27700)
venues_sf <- st_transform(venues_sf, 27700)

cat("Crimes:", nrow(crimes_sf), "points\n")
cat("Venues:", nrow(venues_sf), "points\n")

# --- 4) STUDY WINDOW (LONDON) -------------------------------------------------
# Preferred: read your wards layer and use its union as the window.
# Fallback: buffered convex hull around all points (so the code still runs).
if(file.exists(wards_file)){
  wards <- st_read(wards_file, quiet = TRUE)
  wards <- st_transform(wards, 27700)
  london_boundary <- st_make_valid(st_union(wards))
  message("Window: wards union (preferred).")
} else {
  both <- rbind(
    crimes_sf %>% select(geometry),
    venues_sf %>% select(geometry)
  )
  london_boundary <- both |>
    st_union() |>
    st_convex_hull() |>
    st_buffer(1000)  # add 1 km buffer to avoid edge clipping
  message("Window: convex hull + buffer (fallback).")
}

# --- 5) KEEP ONLY POINTS INSIDE THE WINDOW -----------------------------------
crimes_sf <- st_intersection(crimes_sf, london_boundary)
venues_sf <- st_intersection(venues_sf, london_boundary)

# --- 6) CHECK / PREPARE CATEGORY FIELDS --------------------------------------
# We need a categorical field for type selection. Adjust names if yours differ.
# Try to guess a reasonable field name for crimes and venues:
guess_col <- function(x, candidates){
  nms <- names(x)
  idx <- which(nms %in% candidates)
  if(length(idx)) return(nms[idx[1]])
  # try case-insensitive
  idx <- which(tolower(nms) %in% tolower(candidates))
  if(length(idx)) return(nms[idx[1]])
  NA_character_
}

crime_cat_col <- guess_col(crimes_sf, c("category","crime_type","type","offence","offense"))
venue_cat_col <- guess_col(venues_sf, c("category","venue_type","type","fsq_category","Category"))

if(is.na(crime_cat_col)) stop("Couldn't find a crime category column. Rename one to 'category'.")
if(is.na(venue_cat_col)) stop("Couldn't find a venue category column. Rename one to 'category'.")

# For convenience, create a standard 'category' column on both
crimes_sf$category <- as.factor(crimes_sf[[crime_cat_col]])
venues_sf$category <- as.factor(venues_sf[[venue_cat_col]])

# --- 7) CHOOSE 3 CRIME TYPES & 3 VENUE TYPES ---------------------------------
# Pick frequent categories so each pair has enough points.
# You can edit these after checking table(crimes_sf$category) etc.
crime_types <- names(sort(table(crimes_sf$category), decreasing = TRUE))[1:3]
venue_types <- names(sort(table(venues_sf$category), decreasing = TRUE))[1:3]

message("Selected crime types: ", paste(crime_types, collapse=", "))
message("Selected venue types: ", paste(venue_types, collapse=", "))

# --- 8) CONVERT TO spatstat 'ppp' OBJECTS ------------------------------------
# 8.1 Create an observation window (owin) from the London boundary
W <- as.owin(st_as_sf(london_boundary))

# 8.2 Helper to convert sf points to ppp in that window
sf_to_ppp <- function(pts_sf, W){
  xy <- st_coordinates(pts_sf)
  ppp(x = xy[,1], y = xy[,2], window = W)
}

# --- 9) RUN 3×3 CROSS K WITH ENVELOPES ---------------------------------------
# We’ll test independence via random relabelling of the combined pattern.
# Interpretation:
#   observed above envelope → attraction
#   observed below envelope → repulsion
#   observed within envelope → independence
results <- list()

# Plot matrix layout
op <- par(no.readonly = TRUE)
par(mfrow = c(3,3), mar = c(3,3,3,1))

set.seed(123)  # reproducible envelopes
for(cr in crime_types){
  for(vn in venue_types){
    
    # Filter to current categories
    crime_now <- crimes_sf %>% filter(category == cr)
    venue_now <- venues_sf %>% filter(category == vn)
    
    # Convert to ppp
    p_crime <- sf_to_ppp(crime_now, W)
    p_venue <- sf_to_ppp(venue_now, W)
    
    # Combine into a multitype pattern with marks "crime"/"venue"
    combined <- superimpose(crime = p_crime, venue = p_venue, W = W)
    marks(combined) <- factor(marks(combined), levels = c("crime","venue"))
    
    # Cross K with Monte Carlo envelopes under independence (random relabelling)
    env <- envelope(combined,
                    fun = Kcross,
                    i = "crime", j = "venue",
                    nsim = 99,
                    simulate = expression(rlabel(combined)),
                    correction = "border",
                    verbose = FALSE)
    
    key <- paste(cr, "x", vn)
    results[[key]] <- env
    
    # Plot in the 3×3 panel
    plot(env,
         main = paste("Kcross:", cr, "vs", vn),
         legend = FALSE,
         xlab = "Distance r (metres)",
         ylab = "Kcross(r)")
    abline(h = 0, col = "grey80")  # visual baseline
  }
}
par(op)  # restore plotting settings

# --- 10) TEXT SUMMARY (quick, human-readable) ---------------------------------
# Simple rule: if any K(r) rises above/below the envelope at short distances.
summary_table <- do.call(rbind, lapply(names(results), function(k){
  env <- results[[k]]
  # where observed is above / below the envelope
  above <- which(env$obs > env$hi)
  below <- which(env$obs < env$lo)
  # summarize first distance ranges (very simple heuristic)
  first_above <- if(length(above)) min(env$r[above]) else NA
  first_below <- if(length(below)) min(env$r[below]) else NA
  data.frame(pair = k,
             attraction_from_m = round(first_above, 1),
             repulsion_from_m  = round(first_below, 1))
}))
print(summary_table)

# --- 11) OPTIONAL: SAVE CLEAN OBJECTS FOR LATER -------------------------------
dir.create("data", showWarnings = FALSE)
save(crimes_sf, venues_sf, file = file.path("data","standardized.RData"))
