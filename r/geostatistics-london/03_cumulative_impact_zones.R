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



Rscript for Portfolio II
# ========================================
# SPATIAL CLUSTERING ANALYSIS - STUDENT TEMPLATE
# ========================================

rm(list = ls())

# Load required libraries
library(sf)
library(spdep)
library(ggplot2)
library(dplyr)
library(tidyr)
library(ClustGeo)
library(cluster)
library(randomForest)
library(tmap)

#setwd("D:/Geostatistics/Geostatistic/data")

## ========================================
# STEP 1: Load and Prepare Data
# ========================================

# Load spatial data
wards <- st_read("D:/Geoinformatic/Geostatistic/Data/London_Ward/London_Ward.shp") %>%
  st_transform(27700)

# Load crime and venue data
load("Venue.Rdata")
venues_sf <- st_as_sf(df_bng, coords = c("longitude", "latitude"), crs = 4326) %>%
  st_transform(27700)

load("Crime_06_2024.Rdata")
crimes_sf <- st_as_sf(all_crimes, coords = c("longitude", "latitude"), crs = 4326) %>%
  st_transform(27700)

# Filter relevant types
selected_crimes <- c("violent-crime", "burglary", "anti-social-behaviour")
selected_venues <- c("Pub", "Restaurant", "Fast Food", "Café", "Bar")

crimes_subset <- crimes_sf[crimes_sf$category %in% selected_crimes, ]
venues_subset <- venues_sf[venues_sf$category %in% selected_venues, ]

# Aggregate to ward level
crimes_in_wards <- st_join(crimes_subset, wards, join = st_within)
venues_in_wards <- st_join(venues_subset, wards, join = st_within)

total_crimes <- crimes_in_wards %>%
  st_drop_geometry() %>%
  group_by(GSS_CODE) %>%
  summarise(total_crimes = n(), .groups = "drop")

total_venues <- venues_in_wards %>%
  st_drop_geometry() %>%
  group_by(GSS_CODE) %>%
  summarise(total_venues = n(), .groups = "drop")

# Merge and calculate densities
wards_data <- wards %>%
  left_join(total_crimes, by = "GSS_CODE") %>%
  left_join(total_venues, by = "GSS_CODE") %>%
  mutate(
    total_crimes = replace_na(total_crimes, 0),
    total_venues = replace_na(total_venues, 0),
    area_km2 = as.numeric(st_area(.)) / 1e6,
    crime_density = total_crimes / area_km2,
    venue_density = total_venues / area_km2
  )

# ========================================
# STEP 2: Load Socioeconomic Data
# ========================================

# Load ward profile data
ward_profiles <- read.csv("ward-profiles-excel-version.csv", stringsAsFactors = FALSE)

# Select relevant columns
ward_profiles_clean <- ward_profiles %>%
  dplyr::select(
    GSS_CODE = New.code,
    median_income = Median.Household.income.estimate..2012.13.,
    deprivation_rank = X.ID2010....Rank.of.average.score..within.London....2010,
    ptal_score = Average.Public.Transport.Accessibility.score...2014,
    pop_density = Population.density..persons.per.sq.km....2013,
    pct_flats = X..Flat..maisonette.or.apartment...2011,
    median_age = Median.Age...2013
  ) %>%
  mutate(
    across(c(median_income, deprivation_rank, ptal_score, pop_density, pct_flats, median_age),
           ~{
             x <- gsub("[, ]", "", as.character(.))
             x <- gsub("^(NA|N/A|n/a|-|\\*|\\.)$", NA, x)
             suppressWarnings(as.numeric(x))
           })
  )

# Join to wards data
wards_data <- wards_data %>%
  left_join(ward_profiles_clean, by = "GSS_CODE")

# ========================================
# STEP 3: Prepare Clustering Variables
# ========================================

# Select variables for clustering
clustering_vars <- c("crime_density", "venue_density",
                     "median_income", "ptal_score",
                     "pop_density", "median_age")

# Remove rows with missing values
cluster_data <- wards_data %>%
  st_drop_geometry() %>%
  dplyr::select(GSS_CODE, all_of(clustering_vars)) %>%
  filter(complete.cases(.))

cat(sprintf("\nClustering dataset: %d wards × %d variables\n",
            nrow(cluster_data), length(clustering_vars)))

# Standardize variables
cluster_matrix <- cluster_data %>%
  dplyr::select(-GSS_CODE) %>%
  scale()

rownames(cluster_matrix) <- cluster_data$GSS_CODE

# ========================================
# STEP 4: Calculate Distance Matrices
# ========================================

# D0: Attribute distance (how similar are the crime/socioeconomic characteristics?)
D0 <- dist(cluster_matrix)

# D1: Geographic distance (how close are wards spatially?)
centroids <- st_centroid(st_geometry(wards_data[wards_data$GSS_CODE %in% cluster_data$GSS_CODE, ]))
D1 <- dist(st_coordinates(centroids))

cat("\n✓ Distance matrices calculated\n")

# ========================================
# STEP 5: Determine Optimal Number of Clusters (k)
# ========================================

cat("\nSTEP 5: Finding optimal number of clusters...\n")

k_values <- 2:8
within_ss <- numeric(length(k_values))
avg_sil <- numeric(length(k_values))

for(i in seq_along(k_values)) {
  k <- k_values[i]
  tree <- hclustgeo(D0, D1, alpha = 0.3)
  clusters <- cutree(tree, k = k)

  # Within-cluster sum of squares
  within_ss[i] <- sum(tapply(1:nrow(cluster_matrix), clusters, function(idx) {
    if(length(idx) > 1) sum(dist(cluster_matrix[idx, ])^2) else 0
  }))

  # Silhouette width
  sil <- silhouette(clusters, D0)
  avg_sil[i] <- mean(sil[, 3])
}

# Visualize
par(mfrow = c(1, 2))
plot(k_values, within_ss, type = "b", pch = 19, col = "blue",
     xlab = "Number of Clusters (k)", ylab = "Within-SS", main = "Elbow Method")
abline(v = 4, col = "red", lty = 2)

plot(k_values, avg_sil, type = "b", pch = 19, col = "green",
     xlab = "Number of Clusters (k)", ylab = "Avg Silhouette", main = "Silhouette")
abline(v = 4, col = "red", lty = 2)
par(mfrow = c(1, 1))

k_optimal <- 4
cat(sprintf("\n✓ Optimal k = %d\n", k_optimal))

# ========================================
# STEP 6: Determine Optimal Spatial Constraint (alpha)
# ========================================

cat("\nSTEP 6: Finding optimal alpha...\n")
cat("  α = 0.0 → Pure attribute clustering\n")
cat("  α = 1.0 → Pure geographic clustering\n")

alphas <- seq(0, 1, by = 0.1)
quality_data <- numeric(length(alphas))
quality_space <- numeric(length(alphas))

for(i in seq_along(alphas)) {
  tree <- hclustgeo(D0, D1, alpha = alphas[i])
  clusters <- cutree(tree, k = k_optimal)

  sil_data <- silhouette(clusters, D0)
  quality_data[i] <- mean(sil_data[, 3])

  sil_space <- silhouette(clusters, D1)
  quality_space[i] <- mean(sil_space[, 3])
}

# Visualize trade-off
plot(alphas, quality_data, type = "l", col = "blue", lwd = 2,
     xlab = "Alpha", ylab = "Quality", main = "Data vs Spatial Quality",
     ylim = c(0, max(c(quality_data, quality_space))))
lines(alphas, quality_space, col = "green", lwd = 2)
abline(v = 0.3, lty = 2, col = "red")
legend("topright", legend = c("Data Quality", "Spatial Quality"),
       col = c("blue", "green"), lwd = 2)

alpha_optimal <- 0.3
cat(sprintf("\n✓ Optimal α = %.1f\n", alpha_optimal))

# ========================================
# STEP 7: Create Final Clusters
# ========================================

cat("\nSTEP 7: Creating final clusters...\n")

# Filter wards to only those with complete data
wards_final <- wards_data %>%
  filter(GSS_CODE %in% cluster_data$GSS_CODE)

# Standard clustering (no spatial constraint)
tree_standard <- hclust(D0, method = "ward.D2")
wards_final$Cluster_Standard <- as.factor(cutree(tree_standard, k = k_optimal))

# Spatially constrained clustering
tree_spatial <- hclustgeo(D0, D1, alpha = alpha_optimal)
wards_final$Cluster_Spatial <- as.factor(cutree(tree_spatial, k = k_optimal))

cat("✓ Clusters created\n")


# ========================================
# STEP 8: Visualize Comparison
# ========================================

cat("\nSTEP 8: Creating comparison maps...\n")

# Map 1: Standard clustering
m_standard <- tm_shape(wards_final) +
  tm_polygons("Cluster_Standard",
              palette = "Accent",
              title = "Cluster ID") +
  tm_layout(main.title = "Standard Clustering (α=0)",
            legend.position = c("left", "bottom"))

# Map 2: Spatially constrained
m_spatial <- tm_shape(wards_final) +
  tm_polygons("Cluster_Spatial",
              palette = "Accent",
              title = "Cluster ID") +
  tm_layout(main.title = "Spatially Constrained (α=0.3)",
            legend.position = c("left", "bottom"))

print(tmap_arrange(m_standard, m_spatial, ncol = 2))

# ========================================
# STEP 9A: Characterize Clusters
# ========================================

cat("\nSTEP 9: Characterizing clusters...\n")

cluster_profile <- wards_final %>%
  st_drop_geometry() %>%
  group_by(Cluster_Spatial) %>%
  summarise(
    N_Wards = n(),
    Avg_Crime_Density = round(mean(crime_density, na.rm = TRUE), 1),
    Avg_Venue_Density = round(mean(venue_density, na.rm = TRUE), 1),
    Avg_Median_Income = round(mean(median_income, na.rm = TRUE), 0),
    Avg_PTAL = round(mean(ptal_score, na.rm = TRUE), 1),
    .groups = "drop"
  ) %>%
  arrange(desc(Avg_Crime_Density))

cat("\nCLUSTER PROFILES:\n")
print(cluster_profile)


# ========================================
# STEP 9B: PCA Validation using Boxplots
# ========================================

cat("\nSTEP 7A: PCA validation using boxplots...\n")

# Run PCA on standardized variables
pca_res <- prcomp(cluster_matrix, center = TRUE, scale. = TRUE)

# Create PCA dataframe (first 3 PCs are enough)
pca_df <- data.frame(
  GSS_CODE = rownames(cluster_matrix),
  PC1 = pca_res$x[, 1],
  PC2 = pca_res$x[, 2],
  PC3 = pca_res$x[, 3]
)

# Join cluster labels
pca_df <- pca_df %>%
  left_join(
    wards_final %>%
      st_drop_geometry() %>%
      dplyr::select(GSS_CODE, Cluster_Spatial),
    by = "GSS_CODE"
  ) %>%
  mutate(Cluster_Spatial = factor(Cluster_Spatial))

# Variance explained
pc_var <- summary(pca_res)$importance[2, ] * 100

# Convert to long format for plotting
pca_long <- pca_df %>%
  pivot_longer(
    cols = starts_with("PC"),
    names_to = "Component",
    values_to = "Score"
  )

# PCA boxplot
p_pca_box <- ggplot(pca_long,
                    aes(x = Cluster_Spatial, y = Score, fill = Cluster_Spatial)) +
  geom_boxplot(alpha = 0.7, outlier.color = "black") +
  facet_wrap(~ Component, scales = "free_y",
             labeller = labeller(Component = c(
               PC1 = paste0("PC1 (", round(pc_var[1], 1), "%)"),
               PC2 = paste0("PC2 (", round(pc_var[2], 1), "%)"),
               PC3 = paste0("PC3 (", round(pc_var[3], 1), "%)")
             ))) +
  scale_fill_brewer(palette = "Set2") +
  labs(
    title = "Distribution of Principal Component Scores by Spatial Cluster",
    x = "Spatial Cluster",
    y = "PCA Score"
  ) +
  theme_minimal(base_size = 12)

print(p_pca_box)
ggsave("pca_boxplots_by_cluster.png", p_pca_box, width = 10, height = 6, dpi = 300)

cat("✓ PCA boxplots saved: 'pca_boxplots_by_cluster.png'\n")


# ========================================
# STEP 9C: Silhouette Analysis (Histogram)
# ========================================

cat("\nSTEP 7B: Silhouette analysis using histogram...\n")

# Compute silhouette for final spatial clustering
sil_final <- silhouette(as.numeric(wards_final$Cluster_Spatial), D0)

sil_df <- data.frame(
  Silhouette_Width = sil_final[, 3],
  Cluster = factor(
    sil_final[, 1],
    levels = sort(unique(sil_final[, 1])),
    #labels = paste("Cluster", sort(unique(sil_final[, 1])))
    labels = c(
      "Affluent Residential",
      "Quiet Residential (Deprived)",
      "Quiet Residential (Low Accessibility)",
      "Cumulative Impact Zone"
    )
  )
)

avg_silhouette <- mean(sil_df$Silhouette_Width)

cat(sprintf("  Overall average silhouette width: %.3f\n", avg_silhouette))

# Compute mean silhouette width per cluster
cluster_centers <- sil_df %>%
  group_by(Cluster) %>%
  summarise(
    Cluster_Mean_Silhouette = mean(Silhouette_Width, na.rm = TRUE)
  )

# Histogram
p_sil_hist_cluster <- ggplot(sil_df, aes(x = Silhouette_Width)) +
  
  # Histogram
  geom_histogram(
    binwidth = 0.05,
    fill = "grey",
    color = "white",
    alpha = 0.8
  ) +
  
  # Overall average silhouette (red dashed)
  geom_vline(
    aes(xintercept = avg_silhouette,
        color = "Overall average silhouette",
        linetype = "Overall average silhouette"),
    linewidth = 1
  ) +
  
  # Cluster-specific mean silhouette (yellow solid)
  geom_vline(
    data = cluster_centers,
    aes(xintercept = Cluster_Mean_Silhouette,
        color = "Cluster mean silhouette",
        linetype = "Cluster mean silhouette"),
    linewidth = 1.2
  ) +
  
  facet_wrap(~ Cluster, ncol = 2) +
  
  scale_color_manual(
    name = "Reference lines",
    values = c(
      "Overall average silhouette" = "red",
      "Cluster mean silhouette" = "yellow"
    )
  ) +
  
  scale_linetype_manual(
    name = "Reference lines",
    values = c(
      "Overall average silhouette" = "dashed",
      "Cluster mean silhouette" = "solid"
    )
  ) +
  
  labs(
    title = "Silhouette Width Distribution by Spatial Cluster",
    subtitle = paste(
      "Red dashed line = overall average silhouette (",
      round(avg_silhouette, 2),
      "); Yellow line = cluster-specific mean",
      sep = ""
    ),
    x = "Silhouette Width",
    y = "Number of Wards"
  ) +
  
  theme_minimal(base_size = 12) +
  theme(
    strip.text = element_text(face = "bold"),
    legend.position = "bottom",
    legend.title = element_text(face = "bold")
  )

print(p_sil_hist_cluster)



ggsave("silhouette_histogram_by_cluster.png",
       p_sil_hist_cluster,
       width = 10, height = 7, dpi = 300)

cat("✓ Silhouette histogram by cluster saved: 'silhouette_histogram_by_cluster.png'\n")
cat("✓ Each panel shows the silhouette values of wards belonging to one cluster, 
    while the red dashed vertical line indicates the overall average silhouette width (≈ 0.02) across all wards.
    Silhouette width distributions reveal that the Cumulative Impact Zone is a highly distinct cluster, 
    while residential clusters display more gradual transitions and boundary cases, 
    reflecting the continuous nature of urban socio-spatial variation rather than poor clustering performance'\n")


# ========================================
# STEP 9D: Boxplots of Crime and Venue Density
# ========================================

library(patchwork)

cat("\nSTEP 9A: Boxplots of key variables by cluster...\n")

boxplot_data <- wards_final %>%
  st_drop_geometry() %>%
  filter(!is.na(Cluster_Spatial)) %>%
  mutate(Cluster_Spatial = factor(Cluster_Spatial))

# Crime density boxplot
p_crime_box <- ggplot(boxplot_data,
                      aes(x = Cluster_Spatial, y = crime_density, fill = Cluster_Spatial)) +
  geom_boxplot(alpha = 0.7, outlier.color = "black") +
  scale_fill_brewer(palette = "Set2") +
  labs(
    title = "Crime Density",
    x = "Cluster",
    y = "Crimes per km²"
  ) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "none")

# Venue density boxplot
p_venue_box <- ggplot(boxplot_data,
                      aes(x = Cluster_Spatial, y = venue_density, fill = Cluster_Spatial)) +
  geom_boxplot(alpha = 0.7, outlier.color = "black") +
  scale_fill_brewer(palette = "Set2") +
  labs(
    title = "Venue Density",
    x = "Cluster",
    y = "Venues per km²"
  ) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "none")

# Combine plots side by side
p_combined_box <- p_crime_box + p_venue_box +
  plot_layout(ncol = 2) +
  plot_annotation(
    title = "Crime and Venue Density by Spatial Cluster",
    subtitle = "Distributions highlight differences in intensity and variability across clusters"
  )

print(p_combined_box)
ggsave("crime_venue_density_boxplots.png",
       p_combined_box, width = 12, height = 6, dpi = 300)

cat("✓ Combined boxplot saved: 'crime_venue_density_boxplots.png'\n")





# =============================================
# Part 3: Socio-Economic Context & Policy Maps
# =============================================

# ========================================
# STEP 10: Assign Interpretive Labels
# ========================================
cat("\nSTEP 10: Assigning interpretive labels to clusters...\n")

# Calculate standardized profiles
profile_standardized <- cluster_profile %>%
  mutate(
    Z_Crime = (Avg_Crime_Density - mean(Avg_Crime_Density)) / sd(Avg_Crime_Density),
    Z_Venue = (Avg_Venue_Density - mean(Avg_Venue_Density)) / sd(Avg_Venue_Density),
    Z_Income = (Avg_Median_Income - mean(Avg_Median_Income)) / sd(Avg_Median_Income),
    Z_PTAL = (Avg_PTAL - mean(Avg_PTAL)) / sd(Avg_PTAL)
  )

# Assign labels based on crime/venue patterns
# Create unique label for each of the k=4 clusters
cluster_labels <- profile_standardized %>%
  mutate(Cluster_ID = Cluster_Spatial) %>%
  arrange(desc(Z_Crime), desc(Z_Venue)) %>%
  mutate(
    Crime_Rank = row_number(),
    # Temporary quadrant classification
    Temp_Quadrant = case_when(
      Z_Crime > 0 & Z_Venue > 0 ~ "HighCrime_HighVenue",
      Z_Crime > 0 & Z_Venue <= 0 ~ "HighCrime_LowVenue",
      Z_Crime <= 0 & Z_Venue > 0 ~ "LowCrime_HighVenue",
      Z_Crime <= 0 & Z_Venue <= 0 ~ "LowCrime_LowVenue",
      TRUE ~ "Other"
    )
  ) %>%
  # Assign base label by quadrant, then ensure uniqueness by adding suffix
  mutate(
    # Base label from quadrant
    Base_Label = case_when(
      Temp_Quadrant == "HighCrime_HighVenue" ~ "Cumulative Impact Zone",
      Temp_Quadrant == "HighCrime_LowVenue" ~ "Crime Hotspot",
      Temp_Quadrant == "LowCrime_HighVenue" ~ "Safe Nightlife Hub",
      Temp_Quadrant == "LowCrime_LowVenue" & Z_Income > 0 ~ "Affluent Residential",
      Temp_Quadrant == "LowCrime_LowVenue" ~ "Quiet Residential",
      TRUE ~ "Mixed Zone"
    )
  ) %>%
  # Add suffix to ensure each cluster gets unique label
  group_by(Base_Label) %>%
  mutate(
    Label_Suffix = if(n() > 1) {
      # Multiple clusters with same base label - add differentiator
      case_when(
        row_number(desc(Z_Crime)) == 1 ~ " (High Priority)",
        row_number(desc(Z_Crime)) == 2 ~ " (Moderate Priority)",
        row_number(desc(Z_Crime)) == 3 ~ " (Low Priority)",
        TRUE ~ paste0(" (", row_number(desc(Z_Crime)), ")")
      )
    } else {
      ""  # Only one cluster with this label - no suffix needed
    },
    Label = paste0(Base_Label, Label_Suffix)
  ) %>%
  ungroup() %>%
  dplyr::select(-Base_Label, -Label_Suffix) %>%
  mutate(
    # Priority level based on Z-Crime thresholds
    Priority = case_when(
      Z_Crime > 1.5 ~ "CRITICAL",
      Z_Crime > 0.8 ~ "HIGH",
      Z_Crime > 0 ~ "MEDIUM",
      Z_Crime > -0.85 ~ "LOW",
      TRUE ~ "VERY LOW"
    ),
    # Dominant characteristic
    Dominant_Feature = case_when(
      abs(Z_Crime) >= abs(Z_Venue) & abs(Z_Crime) >= abs(Z_Income) & Z_Crime > 0 ~ "High Crime",
      abs(Z_Crime) >= abs(Z_Venue) & abs(Z_Crime) >= abs(Z_Income) & Z_Crime <= 0 ~ "Low Crime",
      abs(Z_Venue) >= abs(Z_Crime) & abs(Z_Venue) >= abs(Z_Income) & Z_Venue > 0 ~ "High Nightlife",
      abs(Z_Venue) >= abs(Z_Crime) & abs(Z_Venue) >= abs(Z_Income) & Z_Venue <= 0 ~ "Low Nightlife",
      abs(Z_Income) >= abs(Z_Crime) & abs(Z_Income) >= abs(Z_Venue) & Z_Income > 0 ~ "Affluent",
      abs(Z_Income) >= abs(Z_Crime) & abs(Z_Income) >= abs(Z_Venue) & Z_Income <= 0 ~ "Deprived",
      TRUE ~ "Mixed"
    )
  )

# Verify we have exactly k unique labels
n_unique_labels <- length(unique(cluster_labels$Label))
cat(sprintf("\n✓ Created %d distinct policy zones from %d clusters\n",
            n_unique_labels, k_optimal))

if(n_unique_labels != k_optimal) {
  cat(sprintf("  ⚠ Warning: Expected %d labels but got %d\n", k_optimal, n_unique_labels))
  cat("  Labels: ", paste(unique(cluster_labels$Label), collapse = ", "), "\n")
}

# Arrange by cluster ID for consistent ordering
cluster_labels <- cluster_labels %>% arrange(Cluster_ID)

# Print cluster characterization
cat("\nCLUSTER CHARACTERIZATION:\n")
for(i in 1:nrow(cluster_labels)) {
  row <- cluster_labels[i, ]
  cat(sprintf("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"))
  cat(sprintf("CLUSTER %s: %s\n", row$Cluster_ID, row$Label))
  cat(sprintf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"))
  cat(sprintf("Wards: %d | Priority: %s | Dominant: %s\n\n",
              row$N_Wards, row$Priority, row$Dominant_Feature))
  cat(sprintf("  Crime Density:    %6.1f/km² (Z = %+.2f)\n", row$Avg_Crime_Density, row$Z_Crime))
  cat(sprintf("  Venue Density:    %6.1f/km² (Z = %+.2f)\n", row$Avg_Venue_Density, row$Z_Venue))
  cat(sprintf("  Median Income:    £%6d (Z = %+.2f)\n", row$Avg_Median_Income, row$Z_Income))
  cat(sprintf("  PTAL Score:       %6.1f/6 (Z = %+.2f)\n", row$Avg_PTAL, row$Z_PTAL))
}

# ========================================
# STEP 11: Create Heatmap Visualization
# ========================================

cat("\n\nSTEP 11: Creating cluster profile heatmap...\n")

# Prepare data for heatmap
profile_for_viz <- cluster_labels %>%
  dplyr::select(Cluster_ID, Label, Z_Crime, Z_Venue, Z_Income, Z_PTAL) %>%
  pivot_longer(cols = starts_with("Z_"),
               names_to = "Variable",
               values_to = "Z_Score") %>%
  mutate(
    Variable = case_when(
      Variable == "Z_Crime" ~ "Crime Density",
      Variable == "Z_Venue" ~ "Venue Density",
      Variable == "Z_Income" ~ "Median Income",
      Variable == "Z_PTAL" ~ "Transport Access"
    )
  )

# Create heatmap
p_heatmap <- ggplot(profile_for_viz, aes(x = Variable, y = Label, fill = Z_Score)) +
  geom_tile(color = "white", linewidth = 1) +
  geom_text(aes(label = sprintf("%.1f", Z_Score)),
            color = ifelse(abs(profile_for_viz$Z_Score) > 1, "white", "black"),
            size = 4, fontface = "bold") +
  scale_fill_gradient2(
    low = "green", mid = "orange", high = "red",
    midpoint = 0,
    name = "Z-Score"
  ) +
  theme_minimal(base_size = 12) +
  labs(
    title = "Cluster Profiles: Standardized Characteristics",
    subtitle = "Z-scores show how many standard deviations each cluster is from the mean",
    x = "", y = ""
  ) +
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),
    axis.text.y = element_text(face = "bold"),
    plot.title = element_text(hjust = 0.5, face = "bold"),
    plot.subtitle = element_text(hjust = 0.5),
    panel.grid = element_blank()
  )

print(p_heatmap)
ggsave("cluster_profiles_heatmap.png", p_heatmap, width = 10, height = 6, dpi = 300)
cat("✓ Heatmap saved: 'cluster_profiles_heatmap.png'\n")

# ========================================
# STEP 12: Join Labels to Spatial Data
# ========================================

cat("\nSTEP 12: Joining labels to spatial data...\n")

# Remove any existing label columns to avoid conflicts
wards_final <- wards_final %>%
  dplyr::select(-any_of(c("Label", "Priority", "Dominant_Feature", "Temp_Quadrant")))

# Create lookup table - ensure Cluster_ID matches the original cluster numbers
label_lookup <- cluster_labels %>%
  dplyr::select(Cluster_ID, Label, Priority, Dominant_Feature, Temp_Quadrant)

# Check the data types for debugging
cat(sprintf("  Cluster_Spatial type in wards_final: %s\n", class(wards_final$Cluster_Spatial)[1]))
cat(sprintf("  Cluster_ID type in label_lookup: %s\n", class(label_lookup$Cluster_ID)[1]))
cat(sprintf("  Unique Cluster_Spatial values: %s\n", paste(unique(wards_final$Cluster_Spatial), collapse=", ")))
cat(sprintf("  Unique Cluster_ID values: %s\n", paste(unique(label_lookup$Cluster_ID), collapse=", ")))

# Join to spatial data (convert both to character for safe joining)
wards_final <- wards_final %>%
  mutate(join_key = as.character(Cluster_Spatial)) %>%
  left_join(
    label_lookup %>% mutate(join_key = as.character(Cluster_ID)) %>% dplyr::select(-Cluster_ID),
    by = "join_key"
  ) %>%
  dplyr::select(-join_key)

# Verify join worked
cat(sprintf("  Wards with labels: %d / %d\n", sum(!is.na(wards_final$Label)), nrow(wards_final)))
if(sum(!is.na(wards_final$Label)) == 0) {
  cat("  ⚠ WARNING: No labels were joined! Check cluster ID matching.\n")
} else {
  cat("✓ Labels joined successfully\n")
}

# ========================================
# STEP 13: Ward-Level Distribution Plot
# ========================================

cat("\nSTEP 13: Creating ward-level distribution plot...\n")

ward_data <- wards_final %>%
  st_drop_geometry() %>%
  filter(!is.na(Label) & !is.na(crime_density) & !is.na(venue_density)) %>%
  mutate(
    Z_Crime_ward = (crime_density - mean(crime_density, na.rm = TRUE)) / sd(crime_density, na.rm = TRUE),
    Z_Venue_ward = (venue_density - mean(venue_density, na.rm = TRUE)) / sd(venue_density, na.rm = TRUE)
  )

p_wards <- ggplot(ward_data, aes(x = Z_Venue_ward, y = Z_Crime_ward, color = Label)) +
  geom_hline(yintercept = 0, linetype = "dashed", linewidth = 1, color = "gray30") +
  geom_vline(xintercept = 0, linetype = "dashed", linewidth = 1, color = "gray30") +
  geom_point(alpha = 0.6, size = 2.5) +
  scale_color_brewer(palette = "Set1", name = "Policy Zone") +
  labs(
    title = "Crime vs Venue Density: All London Wards by Policy Zone",
    subtitle = paste(nrow(ward_data), "wards colored by policy classification"),
    x = "Venue Density (Z-score)",
    y = "Crime Density (Z-score)"
  ) +
  theme_minimal(base_size = 12)

print(p_wards)
ggsave("ward_level_distribution.png", p_wards, width = 10, height = 8, dpi = 300)
cat("✓ Ward distribution plot saved: 'ward_level_distribution.png'\n")

# ========================================
# STEP 14: Spatial Maps
# ========================================

cat("\nSTEP 14: Creating spatial maps...\n")

# Map 1: Crime/Venue Quadrants
wards_quadrant <- wards_final %>%
  filter(!is.na(crime_density) & !is.na(venue_density)) %>%
  mutate(
    Z_Crime_ward = (crime_density - mean(crime_density, na.rm = TRUE)) / sd(crime_density, na.rm = TRUE),
    Z_Venue_ward = (venue_density - mean(venue_density, na.rm = TRUE)) / sd(venue_density, na.rm = TRUE),
    Quadrant_Label = case_when(
      Z_Crime_ward > 0 & Z_Venue_ward > 0 ~ "High Crime, High Venues",
      Z_Crime_ward > 0 & Z_Venue_ward <= 0 ~ "High Crime, Low Venues",
      Z_Crime_ward <= 0 & Z_Venue_ward > 0 ~ "Low Crime, High Venues",
      Z_Crime_ward <= 0 & Z_Venue_ward <= 0 ~ "Low Crime, Low Venues"
    ),
    Quadrant_Label = factor(Quadrant_Label,
                            levels = c("High Crime, High Venues",
                                       "High Crime, Low Venues",
                                       "Low Crime, High Venues",
                                       "Low Crime, Low Venues"))
  )

m_quadrants <- tm_shape(wards_quadrant) +
  tm_polygons(
    "Quadrant_Label",
    palette = c("#d73027", "#F5B427", "#CFF527", "#45BA32"),
    title = "Crime/Venue\nQuadrant",
    border.col = "white",
    border.lwd = 0.5
  ) +
  tm_layout(
    main.title = "London Wards: Crime/Venue Quadrant Classification",
    legend.outside = TRUE,
    legend.outside.position = "right"
  )

print(m_quadrants)
tmap_save(m_quadrants, "map_crime_venue_quadrants.png", width = 10, height = 8, dpi = 300)
cat("✓ Quadrant map saved: 'map_crime_venue_quadrants.png'\n")

# Map 2: Policy Labels
if("Label" %in% names(wards_final)) {
  unique_labels <- unique(wards_final$Label[!is.na(wards_final$Label)])

  # Use distinct colors for each of the 4 policy zones (not just shades)
  # Print labels for debugging
  cat(sprintf("  Unique policy labels (%d): %s\n",
              length(unique_labels),
              paste(unique_labels, collapse=", ")))

  label_colors <- setNames(
    sapply(unique_labels, function(lbl) {
      # Cumulative Impact zones
      if(grepl("Cumulative Impact", lbl)) {
        if(grepl("High Priority", lbl)) return("#d73027")      # Red
        else if(grepl("Moderate Priority", lbl)) return("#fc8d59")  # Orange
        else return("#d73027")
      }
      # Crime Hotspot zones
      else if(grepl("Crime Hotspot", lbl)) {
        if(grepl("High Priority", lbl)) return("#fee08b")      # Yellow
        else if(grepl("Moderate Priority", lbl)) return("#ffffbf")  # Light yellow
        else return("#fc8d59")
      }
      # Safe Nightlife zones
      else if(grepl("Safe Nightlife", lbl)) {
        if(grepl("High Priority", lbl)) return("#91bfdb")      # Light blue
        else if(grepl("Moderate Priority", lbl)) return("#c7e9b4")  # Light green
        else return("#b9e857")
      }
      # Affluent zones - VERY DIFFERENT COLORS
      else if(grepl("Affluent", lbl)) {
        if(grepl("High Priority", lbl)) return("#2166ac")      # Dark blue
        else if(grepl("Moderate Priority", lbl)) return("#1b7837")  # Dark green (DISTINCT!)
        else return("#3bb21e")
      }
      # Quiet/Residential zones
      else if(grepl("Quiet|Residential", lbl)) {
        if(grepl("High Priority", lbl)) return("#e0f3f8")      # Very light blue
        else if(grepl("Moderate Priority", lbl)) return("#f7f7f7")  # Almost white
        else return("#e2e857")
      }
      else return("#969696")  # Gray fallback
    }),
    unique_labels
  )

  cat("  Assigned colors:\n")
  for(i in seq_along(unique_labels)) {
    cat(sprintf("    %s → %s\n", unique_labels[i], label_colors[i]))
  }

  m_policy_labels <- tm_shape(wards_final %>% filter(!is.na(Label))) +
    tm_polygons(
      "Label",
      palette = label_colors,
      title = "Policy\nClassification",
      border.col = "white",
      border.lwd = 0.5
    ) +
    tm_layout(
      main.title = "London Wards: Policy Label Classification",
      legend.outside = TRUE,
      legend.outside.position = "right"
    )

  print(m_policy_labels)
  tmap_save(m_policy_labels, "map_policy_labels.png", width = 10, height = 8, dpi = 300)
  cat("✓ Policy label map saved: 'map_policy_labels.png'\n")
}

# ========================================
# STEP 15: Policy Implications
# ========================================

cat("\n\nSTEP 15: Generating policy recommendations...\n")

policy_recommendations <- cluster_labels %>%
  mutate(
    Policy_Focus = case_when(
      # High crime + high venues
      grepl("Cumulative Impact|High Crime Nightlife", Label, ignore.case = TRUE) ~
        "License restrictions for new alcohol venues, late-night police patrols, CCTV expansion",
      # High crime + low venues
      grepl("Crime Hotspot|Moderate Crime", Label, ignore.case = TRUE) ~
        "Enhanced policing NOT focused on alcohol licensing, investigate non-alcohol crime drivers",
      # Low crime + high venues
      grepl("Safe Nightlife", Label, ignore.case = TRUE) ~
        "Economic development support, maintain current safety standards, promote as cultural asset",
      # Low crime + low venues (affluent)
      grepl("Affluent", Label, ignore.case = TRUE) ~
        "Protect residential quality of life, monitor spillover from neighboring zones",
      # Low crime + low venues (other)
      grepl("Quiet|Mixed Residential", Label, ignore.case = TRUE) ~
        "Standard community policing, minimal intervention required",
      TRUE ~ "Mixed strategy based on local assessment and crime rank"
    ),
    Recommended_Actions = case_when(
      Priority == "CRITICAL" ~
        "1) Immediate patrol increase 2) Emergency license review 3) Multi-agency task force",
      Priority == "HIGH" ~
        "1) Enhanced CCTV coverage 2) Improved lighting 3) Business engagement",
      Priority == "MEDIUM" ~
        "1) Community policing 2) Monitor trends monthly 3) Preventive programs",
      Priority == "LOW" ~
        "1) Standard patrols 2) Quarterly monitoring",
      TRUE ~
        "1) Standard patrols 2) Annual review"
    )
  )

# Print policy implications
cat("\nPOLICY RECOMMENDATIONS BY CLUSTER:\n")
for(i in 1:nrow(policy_recommendations)) {
  cat(sprintf("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"))
  cat(sprintf("CLUSTER %s: %s\n",
              policy_recommendations$Cluster_ID[i],
              policy_recommendations$Label[i]))
  cat(sprintf("Priority: %s (%d wards)\n",
              policy_recommendations$Priority[i],
              policy_recommendations$N_Wards[i]))
  cat(sprintf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"))
  cat(sprintf("\nPOLICY FOCUS:\n%s\n", policy_recommendations$Policy_Focus[i]))
  cat(sprintf("\nRECOMMENDED ACTIONS:\n%s\n", policy_recommendations$Recommended_Actions[i]))
}

# Create priority map based on Z-score thresholds
m_priority <- tm_shape(wards_final) +
  tm_polygons("Priority",
              palette = c("VERY LOW" = "darkgreen",   
                          "LOW" = "#aae97d",         # Light green
                          "MEDIUM" = "yellow",      
                          "HIGH" = "orange",        
                          "CRITICAL" = "red"),   
              title = "Action Priority\n(Z-score based)",
              border.col = "white",
              lwd = 0.5) +
  tm_layout(
    main.title = "Policy Priority Zones (Crime Z-Score Thresholds)",
    legend.position = c("right", "bottom")
  )

print(m_priority)
tmap_save(m_priority, "policy_priority_map.png", width = 10, height = 8, dpi = 300)
cat("\n✓ Priority map saved: 'policy_priority_map.png'\n")

# ========================================
# STEP 16: Export Results
# ========================================

cat("\n\nSTEP 16: Exporting results...\n")

# Export cluster profiles
cluster_export <- cluster_labels %>%
  dplyr::select(
    Cluster_ID, Label, Priority, N_Wards, Dominant_Feature,
    Avg_Crime_Density, Avg_Venue_Density, Avg_Median_Income,
    Avg_PTAL, Z_Crime, Z_Venue, Z_Income
  )

write.csv(cluster_export, "cluster_profiles_detailed.csv", row.names = FALSE)
cat("  ✓ Detailed profiles: 'cluster_profiles_detailed.csv'\n")

# Export policy recommendations
write.csv(policy_recommendations, "cluster_policy_recommendations.csv", row.names = FALSE)
cat("  ✓ Policy recommendations: 'cluster_policy_recommendations.csv'\n")

# Export spatial data
st_write(wards_final, "policy_zones.shp", delete_dsn = TRUE, quiet = TRUE)
cat("  ✓ Spatial data: 'policy_zones.shp'\n")

cat("\n✓ Analysis complete!\n")

# ========================================
# SUMMARY
# ========================================

cat("\n===============================================\n")
cat("CLUSTERING WORKFLOW SUMMARY\n")
cat("===============================================\n")
cat("\nWhat we accomplished:\n")
cat("\n1. DATA PREPARATION")
cat("\n   - Aggregated crime & venue data to ward level")
cat("\n   - Joined socioeconomic variables")
cat("\n   - Standardized all variables for clustering\n")
cat("\n2. DISTANCE MATRICES")
cat("\n   - D0: Attribute distance (similarity)")
cat("\n   - D1: Geographic distance (proximity)\n")
cat("\n3. OPTIMAL k SELECTION")
cat("\n   - Used Elbow method & Silhouette analysis")
cat("\n   - Chose k=4 clusters for balance\n")
cat("\n4. OPTIMAL α SELECTION")
cat("\n   - Tested α from 0 to 1")
cat("\n   - Chose α=0.3 (70% data, 30% geography)\n")
cat("\n5. CLUSTER CREATION")
cat("\n   - Standard clustering (α=0)")
cat("\n   - Spatially constrained (α=0.3)")
cat("\n   - Spatially constrained = more contiguous!\n")
cat("\n6. INTERPRETIVE LABELS")
cat("\n   - Assigned policy-relevant names")
cat("\n   - Set priority levels (CRITICAL to VERY LOW)")
cat("\n   - Identified dominant features\n")
cat("\n7. VISUALIZATION")
cat("\n   - Heatmap of cluster characteristics")
cat("\n   - Ward-level scatter plot")
cat("\n   - Quadrant maps")
cat("\n   - Policy label maps")
cat("\n   - Priority maps\n")
cat("\n8. POLICY RECOMMENDATIONS")
cat("\n   - Custom strategies for each cluster type")
cat("\n   - Action priorities")
cat("\n   - Resource allocation guidance\n")
cat("\n===============================================\n")
cat("KEY TAKEAWAY: ClustGeo creates ACTIONABLE zones\n")
cat("by balancing statistical similarity with\n")
cat("administrative feasibility.\n")
cat("===============================================\n\n")
