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





Rscript for Portfolio I - Part 2
# ============================================================
# PART 2 — Nearest Neighbour + Relative Risk + KDE Overlap
# Crime subset: VIOLENT-CRIME
# Outputs: PNGs + CSVs -> D:/Geoinformatic/Geostatistic/S03
# ============================================================

# ---- 0) Packages (auto-install if missing) ----
req <- c(
  "sf","dplyr","ggplot2","viridis","tidyr","readr","stringr",
  "spatstat.geom","spatstat.explore","gridExtra","grid"
)
inst <- req[!req %in% rownames(installed.packages())]
if (length(inst)) install.packages(inst, quiet = TRUE)

suppressPackageStartupMessages({
  library(sf); library(dplyr); library(ggplot2)
  library(viridis); library(tidyr); library(readr); library(stringr)
  library(spatstat.geom); library(spatstat.explore)
  library(gridExtra); library(grid)
})

# ---- 1) Paths ----
crime_rdata   <- "D:/Geoinformatic/Geostatistic/Data/Crime_06_2024.Rdata"
venue_rdata   <- "D:/Geoinformatic/Geostatistic/Data/Venue.Rdata"
wards_geojson <- "D:/Geoinformatic/Geostatistic/Data/London-wards-2018/London-wards-2018_ESRI/London_Ward.geojson"
out_dir       <- "D:/Geoinformatic/Geostatistic/S03"
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

target_epsg <- 27700
set.seed(42)

# ---- 2) Helpers ----
inspect_rdata <- function(path){
  if (!file.exists(path)) stop("Missing file: ", path)
  e <- new.env(); load(path, envir = e); e
}
pick_first_sf_or_df <- function(env){
  objs <- eapply(env, identity)
  for (x in objs) if (inherits(x, "sf")) return(x)
  for (x in objs) if (is.data.frame(x)) return(x)
  stop("No sf or data.frame found.")
}
coerce_to_sf <- function(obj, prefer_crs = 27700){
  prefer <- st_crs(prefer_crs)
  if (inherits(obj, "sf")) {
    if (is.na(st_crs(obj))) st_crs(obj) <- prefer
    if (is.na(st_crs(obj)$epsg) || st_crs(obj)$epsg != prefer$epsg) obj <- st_transform(obj, prefer)
    return(obj)
  }
  nm <- names(obj)
  cand <- list(c("longitude","latitude"), c("lon","lat"), c("x","y"),
               c("Easting","Northing"), c("easting","northing"))
  coord <- NULL; for (cc in cand) if (all(cc %in% nm)) { coord <- cc; break }
  if (is.null(coord)) stop("No coordinate columns found in data.frame.")
  x <- obj[[coord[1]]]; y <- obj[[coord[2]]]
  looks_wgs <- all(abs(x) <= 180, na.rm = TRUE) && all(abs(y) <= 90, na.rm = TRUE)
  crs0 <- if (looks_wgs) st_crs(4326) else prefer
  sfobj <- st_as_sf(obj, coords = coord, crs = crs0, remove = FALSE)
  if (!identical(st_crs(sfobj), prefer)) sfobj <- st_transform(sfobj, prefer)
  sfobj
}

# small plotting helpers (used later)
im_to_df <- function(im_obj) {
  df <- as.data.frame(im_obj); names(df) <- c("x","y","value"); df
}
mat_to_df <- function(mat, im_template) {
  df <- expand.grid(x = im_template$xcol, y = im_template$yrow)
  df$value <- as.vector(t(mat)); df
}

# ---- 3) Load & prep ----
crime_env  <- inspect_rdata(crime_rdata)
venue_env  <- inspect_rdata(venue_rdata)
crimes_raw <- pick_first_sf_or_df(crime_env)
venues_raw <- pick_first_sf_or_df(venue_env)

crimes_sf     <- coerce_to_sf(crimes_raw, target_epsg)
venues_sf     <- coerce_to_sf(venues_raw, target_epsg)
wards         <- st_read(wards_geojson, quiet = TRUE) |> st_transform(target_epsg)
GreaterLondonwards <- wards
boundary      <- st_union(wards)

# keep only inside boundary (safety)
crimes_sf <- crimes_sf[st_intersects(crimes_sf, boundary, sparse = FALSE), ]
venues_sf <- venues_sf[st_intersects(venues_sf, boundary, sparse = FALSE), ]

# ---- 4) Filter to one crime type (violent-crime) ----
selected_crime <- "violent-crime"
crime_subset   <- crimes_sf |> filter(tolower(category) == selected_crime)
cat("Crime type:", selected_crime, "\n")
cat("Number of crimes:", nrow(crime_subset), "\n\n")
if (nrow(crime_subset) == 0) stop("No crimes found; check category label.")

# ---- 5) Venue types list ----
venue_types_unique <- unique(venues_sf$category)
venue_types_unique <- venue_types_unique[!is.na(venue_types_unique)]
print(venue_types_unique)

# Edit this vector to pick your 5–6 venue types. If empty, we auto-pick the top 6 by frequency.
selected_venue_types <- c("Pub","Café","Restaurant","Bakery", "Fast Food Restaurant", "Bar", "Pizzeria", "Indian Restaurant", "Burger Joint", "Coffee Shop")
print(selected_venue_types)
# ================================================================
# A) NAIVE NEAREST-NEIGHBOUR (WRONG BUT ILLUSTRATIVE)
# ================================================================
nn_results_naive <- data.frame()
cat("Computing nearest neighbor distances for each venue type...\n\n")

old_s2 <- sf_use_s2(); sf_use_s2(FALSE); on.exit(sf_use_s2(old_s2), add = TRUE)
for (venue_type in venue_types_unique) {
  venue_subset <- venues_sf[venues_sf$category == venue_type, ]
  if (nrow(venue_subset) < 5) next
  cat("Processing:", venue_type, "(n =", nrow(venue_subset), "venues)", "...\n")
  
  distance_matrix <- st_distance(crime_subset, venue_subset)
  min_distances   <- apply(distance_matrix, 1, min)
  
  nn_results_naive <- rbind(nn_results_naive, data.frame(
    venue_type     = venue_type,
    n_venues       = nrow(venue_subset),
    min_nn_dist    = min(as.numeric(min_distances)),
    max_nn_dist    = max(as.numeric(min_distances)),
    mean_nn_dist   = mean(as.numeric(min_distances)),
    median_nn_dist = median(as.numeric(min_distances)),
    sd_nn_dist     = sd(as.numeric(min_distances))
  ))
}
nn_results_naive <- nn_results_naive[order(nn_results_naive$mean_nn_dist), ]
cat("NAIVE NN ANALYSIS COMPLETE (this method is WRONG!)\n\n")

# rank + print top 10
# sorted already:
nn_results_naive <- nn_results_naive[order(nn_results_naive$mean_nn_dist), ]

# save top 10 to a new variable
top10_naive <- nn_results_naive[1:10, ]

# (optional) keep only a few columns
top10_naive_min <- top10_naive[, c("venue_type","n_venues","mean_nn_dist","median_nn_dist")]

print(top10_naive_min, row.names = FALSE, digits = 1)


# ---- Bar chart (Observed; top 10) ----
# make a wrapped label so long names fit
top10_naive$vt_wrap <- stringr::str_wrap(top10_naive$venue_type, width = 26)

p_naive_bar <- ggplot(
  top10_naive,
  aes(x = reorder(vt_wrap, mean_nn_dist),    # order by mean distance
      y = mean_nn_dist,
      fill = n_venues)
) +
  geom_col(width = 0.8) +                    # <- bars (not points)
  coord_flip() +                             # horizontal bars
  scale_fill_viridis_c(name = "Number\nof Venues") +
  labs(
    title    = "NAIVE Nearest Neighbor Analysis (BIASED)",
    subtitle = "\u26A0\ufe0f  WARNING: This ranking is misleading!",
    x        = "Venue Type",
    y        = "Mean Nearest Neighbor Distance (meters)"
  ) +
  theme_minimal(base_size = 14) +
  theme(
    plot.title    = element_text(face = "bold", size = 18),
    plot.subtitle = element_text(color = "red", face = "bold"),
    legend.position = "right"
  )

print(p_naive_bar)
ggsave(file.path(out_dir, "A1_naive_bar.png"),
       p_naive_bar, width = 11, height = 8, dpi = 300)




# ---- Scatter: mean NN distance vs log venue count (bias demo) ----
p_bias <- ggplot(nn_results_naive, aes(x = n_venues, y = mean_nn_dist)) +
  geom_point(alpha = 0.4) +
  geom_smooth(method = "lm", se = TRUE) +
  scale_x_log10() +
  labs(
    title    = "Nearest-neighbour distance vs. venue count",
    subtitle = "Real crimes shrink with higher venue density — bias",
    x        = "Number of venues (log scale)",
    y        = "Mean NN distance (m)"
  ) +
  theme_minimal()
print(p_bias)
ggsave(file.path(out_dir, "Fig_Bias_real.png"), p_bias, width = 9, height = 6, dpi = 300)

# Correlation (observed)
cor_real <- cor.test(log10(nn_results_naive$n_venues), nn_results_naive$mean_nn_dist)
print(cor_real)

# ================================================================
# B) RANDOM NULL (NO RELATIONSHIP WITH VENUES)
# ================================================================
set.seed(458)
random_boundary <- st_union(GreaterLondonwards)
random_crimes   <- st_sample(random_boundary, size = nrow(crime_subset))
random_crimes_sf <- st_sf(geometry = random_crimes) |> st_set_crs(target_epsg)
cat("Generated", nrow(random_crimes_sf), "RANDOM crime locations\n",
    "(These have NO relationship with venues by design)\n\n")

nn_results_random <- data.frame()
cat("Computing NN distances for random crimes...\n\n")
for (venue_type in venue_types_unique) {
  venue_subset <- venues_sf[venues_sf$category == venue_type, ]
  if (nrow(venue_subset) < 5) next
  distance_matrix <- st_distance(random_crimes_sf, venue_subset)
  min_distances   <- apply(distance_matrix, 1, min)
  nn_results_random <- rbind(nn_results_random, data.frame(
    venue_type          = venue_type,
    n_venues            = nrow(venue_subset),
    mean_nn_dist_random = mean(as.numeric(min_distances))
  ))
}

# Comparison + correlation on random baseline
comparison <- merge(nn_results_naive, nn_results_random, by = c("venue_type","n_venues"))
cor_random <- cor.test(log10(comparison$n_venues), comparison$mean_nn_dist_random)

# Plot: Real vs Random lines (as in lecture)
comparison_long <- comparison |>
  dplyr::select(venue_type, n_venues, mean_nn_dist, mean_nn_dist_random) |>
  tidyr::pivot_longer(
    cols      = c(mean_nn_dist, mean_nn_dist_random),
    names_to  = "crime_source",
    values_to = "distance_m"
  )

p_lines <- ggplot(comparison_long,
                  aes(x = n_venues, y = distance_m, linetype = crime_source)) +
  geom_point(alpha = 0.4) +
  geom_smooth(method = "lm", se = TRUE) +
  scale_x_log10() +
  labs(
    title    = "Nearest-neighbour distance vs. venue count",
    subtitle = "Real crimes and RANDOM crimes both shrink with higher venue density — bias",
    x        = "Number of venues (log scale)",
    y        = "Mean NN distance (m)",
    linetype = ""
  ) +
  theme_minimal()
print(p_lines)
ggsave(file.path(out_dir, "Fig_Bias_real_vs_random.png"), p_lines, width = 9, height = 6, dpi = 300)

# ================================================================
# C) RELATIVE RISK ANALYSIS (buffers at multiple distances)
# ================================================================
library(spatstat)  # metapackage keeps bw.diggle docs; not strictly needed but harmless

distance_thresholds <- c(50, 100, 200, 500, 1000)  # meters
relative_risk_results <- data.frame()

cat("\n===============================\n")
cat("  RELATIVE RISK ANALYSIS\n")
cat("\n  Crime type:", selected_crime, "\n")
cat("===============================\n\n")

for (venue_type in venue_types_unique) {
  venue_subset <- venues_sf[venues_sf$category == venue_type, ]
  if (nrow(venue_subset) < 5) next
  cat("\nAnalyzing:", venue_type, "(n =", nrow(venue_subset), ")\n")
  
  for (dist_threshold in distance_thresholds) {
    venue_buffer <- st_buffer(venue_subset, dist = dist_threshold)
    venue_union  <- st_union(venue_buffer)
    
    crimes_in_buffer  <- st_intersects(crime_subset,       venue_union, sparse = FALSE)
    n_crimes_near     <- sum(crimes_in_buffer)
    prop_crimes_near  <- n_crimes_near / nrow(crime_subset)
    
    random_in_buffer  <- st_intersects(random_crimes_sf,   venue_union, sparse = FALSE)
    n_random_near     <- sum(random_in_buffer)
    prop_random_near  <- n_random_near / nrow(random_crimes_sf)
    
    relative_risk <- prop_crimes_near / (prop_random_near + 0.0001)
    odds_crimes   <- n_crimes_near   / (nrow(crime_subset)     - n_crimes_near)
    odds_random   <- n_random_near   / (nrow(random_crimes_sf) - n_random_near)
    odds_ratio    <- odds_crimes / (odds_random + 0.0001)
    
    relative_risk_results <- rbind(relative_risk_results, data.frame(
      venue_type        = venue_type,
      n_venues          = nrow(venue_subset),
      distance_m        = dist_threshold,
      n_crimes_near     = n_crimes_near,
      n_random_near     = n_random_near,
      prop_crimes_near  = prop_crimes_near,
      prop_random_near  = prop_random_near,
      relative_risk     = relative_risk,
      odds_ratio        = odds_ratio
    ))
  }
}

# RR @ 200 m + line plot + heatmap (as in screenshots)
rr_at_200 <- relative_risk_results[relative_risk_results$distance_m == 200, ]
rr_at_200 <- rr_at_200[order(-rr_at_200$relative_risk), ]
top_venues <- head(rr_at_200$venue_type, 10)
print(top_venues)

# lines across distances
plot_data <- relative_risk_results[relative_risk_results$venue_type %in% selected_venue_types, ]
p_rr_lines <- ggplot(plot_data,
                     aes(x = distance_m, y = relative_risk,
                         color = venue_type, group = venue_type)) +
  geom_line(linewidth = 1) + geom_point() +
  geom_hline(yintercept = 1, linetype = "dashed", color = "red") +
  scale_x_continuous(breaks = distance_thresholds) +
  labs(
    title    = paste("Relative Risk:", selected_crime, "Near Venue Types"),
    subtitle = "RR > 1 indicates attraction, RR < 1 indicates avoidance",
    x        = "Distance Threshold (meters)",
    y        = "Relative Risk",
    color    = "Venue Type"
  ) + theme_minimal() + theme(legend.position = "bottom")
print(p_rr_lines)
ggsave(file.path(out_dir, "Fig_RR_Lines_top10.png"), p_rr_lines, width = 10, height = 6, dpi = 500)

# heatmap
p_rr_heat <- ggplot(plot_data, aes(x = factor(distance_m), y = venue_type, fill = relative_risk)) +
  geom_tile() +
  scale_fill_gradient2(low = "blue", mid = "white", high = "red",
                       midpoint = 1, limits = c(0, max(plot_data$relative_risk))) +
  labs(
    title = paste("Relative Risk Heatmap:", selected_crime),
    x     = "Distance Threshold (m)",
    y     = "Venue Type",
    fill  = "Relative Risk"
  ) + theme_minimal() + theme(legend.position = "bottom", axis.text.x = element_text(angle = 0))
print(p_rr_heat)
ggsave(file.path(out_dir, "Fig_RR_Heatmap_top10.png"), p_rr_heat, width = 8, height = 8, dpi = 600)

write_csv(relative_risk_results, file.path(out_dir, "relative_risk_results.csv"))

# ================================================================
# D) KDE + Z-SCORE + OVERLAP (teacher-style)
# ================================================================
# Observation window
london_boundary <- st_union(GreaterLondonwards)
london_owin     <- spatstat.geom::as.owin(london_boundary)

# Crimes as ppp (+ duplicates handling)
crime_coords <- st_coordinates(crime_subset)
crimes_ppp <- spatstat.geom::ppp(x = crime_coords[,1], y = crime_coords[,2], window = london_owin)
if (any(duplicated(crime_coords))) {
  crimes_ppp <- unique(crimes_ppp, rule = "deldir")
  cat("Removed", sum(duplicated(crime_coords)), "duplicate crime locations\n")
}

  #============================================================
  # A) KDE SETUP AND CRIME BANDWIDTH
  # ============================================================

# 1) Build ppp for crimes, optionally remove duplicate locations
crime_coords <- st_coordinates(crime_subset)

# removing duplicate Crime location before KDE
dup_crime <- duplicated(crime_coords[, 1:2])
if (any(dup_crime)) {
  cat("Removing", sum(dup_crime), "duplicated CRIME locations before KDE\n")
  crime_coords <- crime_coords[!dup_crime, , drop = FALSE]
}

crimes_ppp <- spatstat.geom::ppp(
  x = crime_coords[,1],
  y = crime_coords[,2],
  window = london_owin,
  check = FALSE
)

cat("\n-- Selecting bandwidth for CRIME KDE --\n")

bw_diggle_crime <- spatstat.explore::bw.diggle(crimes_ppp)
bw_ppl_crime    <- spatstat.explore::bw.ppl(crimes_ppp)

# Use PPL for smoother, more interpretable hotspots
sigma_crime <- as.numeric(bw_ppl_crime)

cat("  bw.diggle (crime):", round(as.numeric(bw_diggle_crime), 2), "meters\n")
cat("  bw.ppl    (crime):", round(as.numeric(bw_ppl_crime), 2), "meters\n")
cat("  --> Using sigma_crime =", round(sigma_crime, 2), "meters for KDE\n")


cat("\n==================== KDE PER VENUE TYPE ====================\n")

# Common grid
npixel <- 512
cat("\nCreating common grid:", npixel, "x", npixel, "pixels\n")
grid_mask <- spatstat.geom::as.mask(london_owin, dimyx = c(npixel, npixel))

# Crime density (edge corrected)
crime_density <- spatstat.explore::density.ppp(
  crimes_ppp, sigma = sigma_crime, dimyx = c(npixel, npixel), edge = TRUE
)

# Per-venue analysis
venue_types_to_analyze <- selected_venue_types
kde_results_tbl <- data.frame(
  venue_type  = character(), n_venues = integer(),
  bw_crime_m  = numeric(),   bw_venue_m = numeric(),
  r_pearson   = numeric(),   n_crime_hot = integer(),
  n_overlap   = integer(),   overlap_pct = numeric(),
  stringsAsFactors = FALSE
)
kde_results <- list()
bandwidth_tbl <- NULL
z_threshold <- 1.0

for (venue_type in venue_types_to_analyze) {
  
  cat("\n----------------------------------------\n")
  cat("Processing venue type:", venue_type, "\n")
  
  venue_subset <- venues_sf[venues_sf$category == venue_type, ]
  if (nrow(venue_subset) < 5) { cat("Skipping  - insufficient venues (n < 5)\n"); next }
  venue_coords <- st_coordinates(venue_subset)
  
  venue_ppp <- spatstat.geom::ppp(x = venue_coords[,1], y = venue_coords[,2], window = london_owin)
  if (any(duplicated(venue_coords))) {
    venue_ppp <- unique(venue_ppp, rule = "deldir")
    cat("Removed", sum(duplicated(venue_coords)), "duplicate venue locations\n")
  }
  
  # Robust bandwidth (diggle -> fallback ppl)
  cat("Selecting bandwidth...\n")
  sigma_diggle_venue <- tryCatch(spatstat.explore::bw.diggle(venue_ppp),
                                 error = function(e) { cat("bw.diggle failed; using bw.ppl\n"); NA })
  sigma_ppl_venue    <- tryCatch(spatstat.explore::bw.ppl(venue_ppp),
                                 error = function(e) NA)
  if (!is.na(sigma_diggle_venue)) {
    sigma_venue <- sigma_diggle_venue; method_used <- "bw.diggle"
  } else if (!is.na(sigma_ppl_venue)) {
    sigma_venue <- sigma_ppl_venue;    method_used <- "bw.ppl"
  } else {
    cat("Both bandwidth methods failed; skipping.\n"); next
  }
  bandwidth_tbl <- rbind(bandwidth_tbl, data.frame(
    venue_type, n_venues = nrow(venue_subset),
    bw_diggle_m = ifelse(is.na(sigma_diggle_venue), NA, round(sigma_diggle_venue, 2)),
    bw_ppl_m    = ifelse(is.na(sigma_ppl_venue),    NA, round(sigma_ppl_venue, 2)),
    method_used
  ))
  
  # Densities on same grid
  venue_density <- spatstat.explore::density.ppp(
    venue_ppp, sigma = sigma_venue, dimyx = c(npixel, npixel), edge = TRUE
  )
  
  # Z-scores
  crime_mat <- as.matrix(crime_density)
  venue_mat <- as.matrix(venue_density)
  crime_mean <- mean(crime_mat[!is.na(crime_mat)]); crime_sd <- sd(crime_mat[!is.na(crime_mat)])
  venue_mean <- mean(venue_mat[!is.na(venue_mat)]); venue_sd <- sd(venue_mat[!is.na(venue_mat)])
  crime_z <- (crime_mat - crime_mean) / crime_sd
  venue_z <- (venue_mat - venue_mean) / venue_sd
  
  # Overlap (both z >= threshold)
  crime_hotspot <- crime_z >= z_threshold
  venue_hotspot <- venue_z >= z_threshold
  overlap <- crime_hotspot & venue_hotspot
  
  n_overlap       <- sum(overlap,       na.rm = TRUE)
  n_crime_hotspot <- sum(crime_hotspot, na.rm = TRUE)
  pct_overlap     <- 100 * n_overlap / n_crime_hotspot
  
  r_val <- suppressWarnings(cor(as.numeric(crime_z),
                                as.numeric(venue_z),
                                use = "complete.obs"))
  
  kde_results[[venue_type]] <- list(
    crime_density = crime_density, venue_density = venue_density,
    crime_z = crime_z, venue_z = venue_z, overlap = overlap,
    n_overlap = n_overlap, n_crime_hotspot = n_crime_hotspot,
    pct_overlap = pct_overlap, sigma_crime = sigma_crime, sigma_venue = sigma_venue
  )
  
  kde_results_tbl <- rbind(kde_results_tbl, data.frame(
    venue_type, n_venues = nrow(venue_subset),
    bw_crime_m = as.numeric(round(sigma_crime, 2)),
    bw_venue_m = as.numeric(round(sigma_venue, 2)),
    r_pearson = r_val,
    n_crime_hot = n_crime_hotspot, n_overlap = n_overlap,
    overlap_pct = pct_overlap
  ))
}
print(kde_results)
print(kde_results_tbl)
write_csv(kde_results_tbl, file.path(out_dir, "kde_results_tbl.csv"))

# ---- Summary tables (bandwidth + overlap) ----
if (!is.null(bandwidth_tbl)) {
  write_csv(bandwidth_tbl, file.path(out_dir, "bandwidth_summary.csv"))
}
overlap_summary <- data.frame(
  venue_type   = names(kde_results),
  overlap_pct  = sapply(kde_results, function(x) x$pct_overlap),
  n_overlap_px = sapply(kde_results, function(x) x$n_overlap),
  stringsAsFactors = FALSE
) |>
  arrange(desc(overlap_pct))
print (overlap_summary)
write_csv(overlap_summary, file.path(out_dir, "overlap_summary.csv"))

# ---- FIGURE 1: Crime density & z-score (side by side) ----
crime_den_df <- im_to_df(crime_density)
crime_z_df   <- mat_to_df(crime_z, crime_density)

p_crime_density <- ggplot(crime_den_df, aes(x = x, y = y, fill = value)) +
  geom_raster() +
  scale_fill_gradient(name = "Density", low = "grey", high = "red") +
  coord_equal() +
  labs(title = paste(selected_crime, "- Raw Density"),
       subtitle = paste("Bandwidth:", round(sigma_crime, 0), "meters")) +
  theme_minimal() + theme(legend.position = "right")
print(p_crime_density)

p_crime_z <- ggplot(crime_z_df, aes(x = x, y = y, fill = value)) +
  geom_raster() +
  scale_fill_gradient2(name = "Z-score", low = "blue", mid = "white", high = "red",
                       midpoint = 0, limits = c(-2, 4)) +
  coord_equal() +
  labs(title = paste(selected_crime, "- Standardized (Z-Score)"),
       subtitle = "Hotspots defined as z ≥ 1.0") +
  theme_minimal() + theme(legend.position = "right")
print(p_crime_z)

g1 <- grid.arrange(p_crime_density, p_crime_z, ncol = 2,
                   top = textGrob(paste("Figure 1: Crime Density -", selected_crime),
                                  gp = gpar(fontsize = 16, fontface = "bold")))

ggsave(file.path(out_dir, "Fig1_Crime_Density_and_Z.png"), g1, width = 13, height = 6.5, dpi = 700)

# ---- FIGURE 2: Venue Densities (panels) ----
venue_plots <- lapply(names(kde_results), function(vn){
  v_den_df <- im_to_df(kde_results[[vn]]$venue_density)
  ggplot(v_den_df, aes(x = x, y = y, fill = value)) +
    geom_raster() +
    scale_fill_gradient(name = "Density", low = "white", high = "red") +
    coord_equal() +
    labs(title = vn, subtitle = paste("σ =", round(kde_results[[vn]]$sigma_venue, 0), "m")) +
    theme_minimal() + theme(legend.position = "bottom",
                            plot.title = element_text(size = 11, face = "bold"),
                            plot.subtitle = element_text(size = 9))
})
ncol_venues <- min(3, length(venue_plots))
print(venue_plots)

# ---- EXPORT EACH VENUE PLOT SEPARATELY ----
i <- 1
for (vn in names(kde_results)) {
  
  p <- venue_plots[[i]]
  
  outfile <- file.path(
    out_dir,
    paste0("Fig2_Venue_Density_", sprintf("%02d_", i),
           gsub("[^A-Za-z0-9]+", "_", vn), ".png")
  )
  
  ggsave(outfile, p, width = 6, height = 6, dpi = 700)
  cat("Saved:", outfile, "\n")
  
  i <- i + 1
}

#g2 <- do.call(grid.arrange, c(venue_plots, ncol = ncol_venues,
                              #top = list(textGrob("Figure 2: Venue Densities",
                                                  #gp = gpar(fontsize = 12, fontface = "bold")))))

#ggsave(file.path(out_dir, "Fig2_Venue_Densities.png"), g2, width = 15, height = 12, dpi = 600)

# ---- FIGURE 3: Venue Z-scores (panels) ----
venue_z_plots <- lapply(names(kde_results), function(vn){
  vz_df <- mat_to_df(kde_results[[vn]]$venue_z, kde_results[[vn]]$venue_density)
  ggplot(vz_df, aes(x = x, y = y, fill = value)) +
    geom_raster() +
    scale_fill_gradient2(name = "Z-score", low = "blue", mid = "white", high = "red",
                         midpoint = 0, limits = c(-2, 4)) +
    coord_equal() +
    labs(title = vn, subtitle = "Standardized density") +
    theme_minimal() + theme(legend.position = "bottom",
                            plot.title = element_text(size = 11, face = "bold"),
                            plot.subtitle = element_text(size = 9))
})
print(venue_z_plots)

# ---- EXPORT EACH PLOT SEPARATELY ----

i <- 1
for (vn in names(kde_results)) {
  
  p <- venue_z_plots[[i]]
  
  outfile <- file.path(
    out_dir,
    paste0("Fig2_Venue_Z-Scores", sprintf("%02d_", i),
           gsub("[^A-Za-z0-9]+", "_", vn), ".png")
  )
  
  ggsave(outfile, p, width = 6, height = 6, dpi = 700)
  cat("Saved:", outfile, "\n")
  
  i <- i + 1
}

# ---- FIGURE 4: Hotspot Overlap (panels) ----
overlap_plots <- lapply(names(kde_results), function(vn){
  res <- kde_results[[vn]]
  ov_df <- mat_to_df(res$overlap, res$venue_density)
  ov_df$lab <- factor(ifelse(is.na(ov_df$value), "NA",
                             ifelse(ov_df$value, "Overlap", "No overlap")),
                      levels = c("No overlap","Overlap","NA"))
  pct_txt <- paste0(round(res$pct_overlap, 1), "% overlap")
  ggplot(ov_df, aes(x = x, y = y, fill = lab)) +
    geom_raster() + coord_equal() +
    scale_fill_manual(values = c("No overlap" = "grey80", "Overlap" = "red", "NA" = "grey60")) +
    labs(title = vn, subtitle = pct_txt, x = NULL, y = NULL, fill = NULL) +
    theme_minimal() + theme(legend.position = "bottom",
                            plot.title = element_text(size = 11, face = "bold"),
                            plot.subtitle = element_text(size = 9, color = "red"))
})
print(overlap_plots)

# ---- EXPORT EACH PLOT SEPARATELY ----

i <- 1
for (vn in names(kde_results)) {
  
  p <- overlap_plots[[i]]
  
  outfile <- file.path(
    out_dir,
    paste0("Fig2_hotspot_Overlap", sprintf("%02d_", i),
           gsub("[^A-Za-z0-9]+", "_", vn), ".png")
  )
  
  ggsave(outfile, p, width = 6, height = 6, dpi = 700)
  cat("Saved:", outfile, "\n")
  
  i <- i + 1
}

# ================================================================
# E) Exports (CSV)
# ================================================================
write_csv(nn_results_naive,  file.path(out_dir, "nn_summary_observed.csv"))
write_csv(nn_results_random, file.path(out_dir, "nn_summary_random.csv"))
write_csv(comparison,        file.path(out_dir, "nn_observed_vs_random_comparison.csv"))
write_csv(kde_results_tbl,   file.path(out_dir, "kde_overlap_metrics.csv"))

cat("\nAll figures and tables saved to: ", out_dir, "\n")
Raw Z-Score densities for different venue types











Normalised Z-Score densities for different venue types
