# ==============================================================================
# PORTFOLIO 4: SPATIAL INTERPOLATION AND MAPPING OF AIR POLLUTION
# ==============================================================================
# Objective: Interpolate and map PM2.5 concentrations across Greater London
#            using different geostatistical techniques
#
# Methods: Regression Kriging, Ordinary Kriging, Cokriging, IDW
# Author: WS 2025/26
# ==============================================================================

rm(list = ls())

# ==============================================================================
# LOAD REQUIRED LIBRARIES
# ==============================================================================

cat("\n========================================\n")
cat("LOADING LIBRARIES\n")
cat("========================================\n\n")

required_packages <- c("sf", "sp", "terra", "gstat", "tmap", "dplyr",
                      "ggplot2", "patchwork", "nlme", "caret", "tidyr", "gridExtra")

for(pkg in required_packages) {
  if(!require(pkg, character.only = TRUE, quietly = TRUE)) {
    install.packages(pkg)
    library(pkg, character.only = TRUE)
  }
}

cat("✓ All libraries loaded successfully\n\n")

# ==============================================================================
# TASK 1: DATA PREPARATION
# ==============================================================================

cat("\n========================================\n")
cat("TASK 1: DATA PREPARATION\n")
cat("========================================\n\n")

cat("Step 1.1: Loading spatial data...\n")

# Import Greater London ward boundaries
GreaterLondonWards <- st_read("H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/London-wards-2018/London_Ward/London_Ward.shp", quiet = TRUE)
GreaterLondonBorough <- st_read("H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/LondonBorough/London_Borough_Excluding_MHW.shp", quiet = TRUE)

# Import pollution grids
PollutionGrid <- st_read("H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/LAEI2019-pm2-5-grid-emissions-all-sources/LAEI2019-pm2-5-grid-emissions-all-sources.shp", quiet = TRUE)
NOxGrid <- st_read("H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/LAEI2019-nox-grid-emissions-all-sources/LAEI2019-nox-grid-emissions-all-sources.shp", quiet = TRUE)

cat(sprintf("  ✓ Loaded %d wards\n", nrow(GreaterLondonWards)))
cat(sprintf("  ✓ Loaded %d boroughs\n", nrow(GreaterLondonBorough)))
cat(sprintf("  ✓ Loaded pollution grids\n\n"))

# Step 1.2: Assign borough IDs to wards
cat("Step 1.2: Assigning wards to boroughs...\n")

Intersected <- st_join(GreaterLondonWards, GreaterLondonBorough)
GreaterLondonWards <- Intersected %>%
  group_by(GSS_CODE.x) %>%
  filter(row_number() == 1) %>%
  ungroup() %>%
  st_as_sf()

colnames(GreaterLondonWards)[colnames(GreaterLondonWards) == "GSS_CODE.x"] <- "GSS_CODE"
colnames(GreaterLondonWards)[colnames(GreaterLondonWards) == "GSS_CODE.y"] <- "GSS_CODE.borough"

cat("  ✓ Ward-borough assignment complete\n\n")

# Step 1.3: Check and harmonize CRS
cat("Step 1.3: Checking Coordinate Reference Systems...\n")
cat(sprintf("  Ward CRS: %s\n", st_crs(GreaterLondonWards)$input))
cat(sprintf("  Pollution CRS: %s\n", st_crs(PollutionGrid)$input))

if (st_crs(GreaterLondonWards) != st_crs(PollutionGrid)) {
  cat("  → Transforming pollution grids to match ward CRS...\n")
  PollutionGrid <- st_transform(PollutionGrid, st_crs(GreaterLondonWards))
  NOxGrid <- st_transform(NOxGrid, st_crs(GreaterLondonWards))
}

cat("  ✓ CRS harmonization complete\n\n")

# Step 1.4: Calculate area-weighted mean pollution by ward
cat("Step 1.4: Calculating area-weighted pollution concentrations...\n")

# Spatial intersection PM2.5
Intersected_PM25 <- st_intersection(GreaterLondonWards, PollutionGrid) %>%
  mutate(intersect_area = st_area(.))

WeightedPollution <- Intersected_PM25 %>%
  group_by(GSS_CODE) %>%
  summarize(mean_pollution = sum(all_2025 * as.numeric(intersect_area)) / sum(as.numeric(intersect_area))) %>%
  st_drop_geometry()

# Spatial intersection NOx
Intersected_NOx <- st_intersection(GreaterLondonWards, NOxGrid) %>%
  mutate(intersect_area = st_area(.))

WeightedNOx <- Intersected_NOx %>%
  group_by(GSS_CODE) %>%
  summarize(mean_NOx = sum(all_2025 * as.numeric(intersect_area)) / sum(as.numeric(intersect_area))) %>%
  st_drop_geometry()

# Merge pollution data with wards
GreaterLondonWards <- GreaterLondonWards %>%
  left_join(WeightedPollution, by = "GSS_CODE") %>%
  left_join(WeightedNOx, by = "GSS_CODE")

cat(sprintf("  ✓ PM2.5 range: %.2f - %.2f\n",
            min(GreaterLondonWards$mean_pollution, na.rm = TRUE),
            max(GreaterLondonWards$mean_pollution, na.rm = TRUE)))
cat(sprintf("  ✓ NOx range: %.2f - %.2f\n\n",
            min(GreaterLondonWards$mean_NOx, na.rm = TRUE),
            max(GreaterLondonWards$mean_NOx, na.rm = TRUE)))

# Step 1.5: Visualize raw pollution data
cat("Step 1.5: Creating initial pollution map...\n")

tm_raw <- tm_shape(GreaterLondonWards) +
  tm_polygons("mean_pollution",
              palette = "YlOrRd",
              title = "PM2.5 (μg/m³)",
              border.col = "white",
              border.lwd = 0.5) +
  tm_layout(title = "PM2.5 Concentrations by Ward (Raw Data)",
            legend.outside = TRUE)

print(tm_raw)
cat("  ✓ Initial map created\n\n")

# Step 1.6: Apply log transformation
cat("Step 1.6: Applying log transformation...\n")

GreaterLondonWards$mean_pollution <- log1p(GreaterLondonWards$mean_pollution)
GreaterLondonWards$mean_NOx <- log1p(GreaterLondonWards$mean_NOx)

cat("  ✓ Log transformation applied (log1p)\n\n")

# Step 1.7: Load socioeconomic data
cat("Step 1.7: Loading socioeconomic data...\n")

ward_data <- read.csv("H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/portfolio_2/ward-profiles-excel-version.csv",
                     stringsAsFactors = FALSE)

# Convert numeric columns
ward_data[, 5:ncol(ward_data)] <- lapply(ward_data[, 5:ncol(ward_data)], function(x) {
  as.numeric(gsub(",", "", as.character(x)))
})

# Filter for ward codes only (exclude borough codes)
ward_data <- ward_data %>%
  filter(grepl("^E050", New.code)) %>%
  distinct(New.code, .keep_all = TRUE)

cat(sprintf("  ✓ Loaded socioeconomic data: %d wards, %d variables\n\n",
            nrow(ward_data), ncol(ward_data)))

# Step 1.8: Merge all data
cat("Step 1.8: Merging spatial and socioeconomic data...\n")

merged_data <- GreaterLondonWards %>%
  left_join(ward_data, by = c("GSS_CODE" = "New.code")) %>%
  select(where(~ !all(is.na(.)))) %>%
  na.omit()

cat(sprintf("  ✓ Final dataset: %d wards with complete data\n", nrow(merged_data)))
cat(sprintf("  ✓ Wards dropped due to missing data: %d\n\n",
            nrow(GreaterLondonWards) - nrow(merged_data)))

cat("✓ DATA PREPARATION COMPLETE\n\n")

# ==============================================================================
# TASK 2: GEOSTATISTICAL INTERPOLATION
# ==============================================================================

cat("\n========================================\n")
cat("TASK 2: GEOSTATISTICAL INTERPOLATION\n")
cat("========================================\n\n")

# ------------------------------------------------------------------------------
# Step 2.1: Identify Top Predictors
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# Step 2.1: Identify Top Predictors
# ------------------------------------------------------------------------------

cat("Step 2.1: Identifying top predictors for PM2.5...\n")

# Drop geometry first
model_df <- st_drop_geometry(merged_data)

# Keep only numeric columns
numeric_cols <- sapply(model_df, is.numeric)
numeric_data <- model_df[, numeric_cols]

# Exclude response and obvious non-predictors
exclude_vars <- c(
  "mean_pollution",   # response (log-transformed PM2.5)
  "mean_NOx",         # used later for cokriging
  "mean_pollution_original"
)

candidate_vars <- setdiff(names(numeric_data), exclude_vars)

# Compute correlations with response
correlations <- sapply(candidate_vars, function(v) {
  suppressWarnings(cor(model_df[[v]], model_df$mean_pollution, use = "complete.obs"))
})

# Remove NAs if any
correlations <- correlations[!is.na(correlations)]

# Rank by absolute correlation
sorted_correlations <- sort(abs(correlations), decreasing = TRUE)

# Select top predictors
top_n <- 8
top_variables <- names(sorted_correlations)[1:top_n]

predictor_table <- data.frame(
  Rank = 1:length(top_variables),
  Variable = top_variables,
  Correlation = round(correlations[top_variables], 3),
  AbsCorrelation = round(abs(correlations[top_variables]), 3),
  row.names = NULL
)

cat("\nTop Predictors:\n")
print(predictor_table, row.names = FALSE)
cat("\n")

# ------------------------------------------------------------------------------
# Step 2.2: Create 50m Resolution Grid
# ------------------------------------------------------------------------------

cat("Step 2.2: Creating interpolation grid (50m resolution)...\n")
# takes a long time, so use gridded version instead
#grid_50m <- st_make_grid(merged_data,
#                        cellsize = 50,
#                        what = "centers") %>%
#  st_as_sf(crs = st_crs(merged_data))

# Clip to ward boundaries
#grid_50m <- st_intersection(grid_50m, st_union(merged_data))
load("grid_50m.Rdata")

cat(sprintf("  ✓ Created grid with %d points\n\n", nrow(grid_50m)))

# ------------------------------------------------------------------------------
# Step 2.3: Linear Regression Model
# ------------------------------------------------------------------------------

cat("Step 2.3: Fitting linear regression model...\n")

##why not lag or error model -> issue with following kriging: residual structure only keeps white noise -> need residuals that are still autocorrelated, which is why we use a simple linear model
formula_lm <- as.formula(paste("mean_pollution ~", paste(top_variables, collapse = " + ")))
model_lm <- lm(formula_lm, data = merged_data) # basic model

cat("\nModel Summary:\n")
cat("─────────────────────────────────────────\n")
cat(sprintf("R² = %.4f\n", summary(model_lm)$r.squared))
cat(sprintf("Adjusted R² = %.4f\n", summary(model_lm)$adj.r.squared))
cat(sprintf("RMSE = %.4f\n", sqrt(mean(residuals(model_lm)^2))))
cat("\n")
summary(model_lm) # could think about excluding average public transport to make pop. density significant
# for each borough we get an additional partial offset
# ------------------------------------------------------------------------------
# Step 2.4: Linear Mixed Effects Model (LME)
# ------------------------------------------------------------------------------

cat("Step 2.4: Fitting Linear Mixed Effects model...\n")

# Back-transform for LME (works better on original scale)
merged_data$mean_pollution_original <- exp(merged_data$mean_pollution) - 1

formula_lme <- as.formula(paste("mean_pollution_original ~", paste(top_variables, collapse = " + ")))

lme_model <- lme(
  fixed = formula_lme,
  random = ~ 1 | GSS_CODE.borough, # boroughs as random effect
  data = merged_data,
  weights = varPower(form = ~ mean_pollution)
)

cat("\nLME Model Summary:\n")
cat("─────────────────────────────────────────\n")
cat(sprintf("AIC = %.2f\n", AIC(lme_model)))
cat(sprintf("BIC = %.2f\n", BIC(lme_model)))
cat("\n")
summary(lme_model)
# StdDev:   0.3183106 0.4440142 that accounts for random effect
#  power 1.647906 
# ------------------------------------------------------------------------------
# Step 2.5: Compare LM vs LME
# ------------------------------------------------------------------------------

cat("Step 2.5: Comparing LM vs LME models...\n\n")

# Predictions
merged_data$pred_lm <- predict(model_lm)
merged_data$pred_lme_log <- log1p(predict(lme_model))

# R² comparison
r2_lm <- cor(merged_data$mean_pollution, merged_data$pred_lm)^2
r2_lme <- cor(merged_data$mean_pollution, merged_data$pred_lme_log)^2

cat("MODEL COMPARISON:\n")
cat("═══════════════════════════════════════\n")
cat(sprintf("Linear Model R²:       %.4f\n", r2_lm))
cat(sprintf("Mixed Effects Model R²: %.4f\n", r2_lme))
cat(sprintf("\nDifference:            %.4f\n", r2_lme - r2_lm))

if(r2_lme > r2_lm) {
  cat("\n→ LME model shows improvement (accounts for borough-level variation)\n")
} else {
  cat("\n→ LM model sufficient (borough effects minimal)\n")
}
cat("\n")

# Use LME for further analysis (better performance with borough-level variation)
final_regression_model <- lme_model
cat("✓ Using Linear Mixed Effects Model for regression kriging\n\n")

# ------------------------------------------------------------------------------
# Step 2.5b: LM vs LME Residual Diagnostics
# ------------------------------------------------------------------------------

cat("Step 2.5b: Creating LM vs LME residual diagnostics...\n")

# LM predictions/residuals on log scale
merged_data$pred_lm <- predict(model_lm)
merged_data$resid_lm <- merged_data$mean_pollution - merged_data$pred_lm

# LME predictions/residuals on log scale
# LME predicts on original scale, so transform back to log scale
merged_data$pred_lme_log <- log1p(predict(lme_model))
merged_data$resid_lme <- merged_data$mean_pollution - merged_data$pred_lme_log

# Diagnostic data frame
diag_df <- st_drop_geometry(merged_data) %>%
  dplyr::select(mean_pollution, pred_lm, pred_lme_log, resid_lm, resid_lme) %>%
  tidyr::pivot_longer(
    cols = c(pred_lm, pred_lme_log),
    names_to = "Model_pred",
    values_to = "Predicted"
  ) %>%
  mutate(
    Model = ifelse(Model_pred == "pred_lm", "LM", "LME")
  )

resid_df <- st_drop_geometry(merged_data) %>%
  dplyr::select(pred_lm, pred_lme_log, resid_lm, resid_lme) %>%
  mutate(row_id = row_number()) %>%
  tidyr::pivot_longer(
    cols = c(pred_lm, pred_lme_log, resid_lm, resid_lme),
    names_to = "Variable",
    values_to = "Value"
  )

# Histogram of residuals
p_hist_lm_lme <- ggplot(
  st_drop_geometry(merged_data) %>%
    dplyr::select(resid_lm, resid_lme) %>%
    tidyr::pivot_longer(cols = everything(), names_to = "Model", values_to = "Residual"),
  aes(x = Residual, fill = Model)
) +
  geom_histogram(bins = 30, alpha = 0.7, position = "identity") +
  facet_wrap(~Model, scales = "free_y") +
  geom_vline(xintercept = 0, linetype = "dashed", color = "red") +
  labs(
    title = "Residual Distributions: LM vs LME",
    x = "Residual",
    y = "Frequency"
  ) +
  theme_minimal()

print(p_hist_lm_lme)

# Residuals vs fitted
p_resid_fit_lm_lme <- ggplot(
  data.frame(
    Model = rep(c("LM", "LME"), each = nrow(merged_data)),
    Fitted = c(merged_data$pred_lm, merged_data$pred_lme_log),
    Residual = c(merged_data$resid_lm, merged_data$resid_lme)
  ),
  aes(x = Fitted, y = Residual)
) +
  geom_point(alpha = 0.6, size = 1.5) +
  geom_hline(yintercept = 0, linetype = "dashed", color = "red") +
  facet_wrap(~Model) +
  labs(
    title = "Residuals vs Fitted: LM vs LME",
    x = "Fitted values",
    y = "Residuals"
  ) +
  theme_minimal()

print(p_resid_fit_lm_lme)

# Observed vs fitted
p_obs_fit_lm_lme <- ggplot(
  data.frame(
    Model = rep(c("LM", "LME"), each = nrow(merged_data)),
    Observed = rep(merged_data$mean_pollution, 2),
    Fitted = c(merged_data$pred_lm, merged_data$pred_lme_log)
  ),
  aes(x = Observed, y = Fitted)
) +
  geom_point(alpha = 0.6, size = 1.5) +
  geom_abline(slope = 1, intercept = 0, linetype = "dashed", color = "red") +
  facet_wrap(~Model) +
  labs(
    title = "Observed vs Fitted: LM vs LME",
    x = "Observed log(PM2.5 + 1)",
    y = "Fitted log(PM2.5 + 1)"
  ) +
  theme_minimal()

print(p_obs_fit_lm_lme)

grid.arrange(p_hist_lm_lme, p_resid_fit_lm_lme, p_obs_fit_lm_lme, ncol=2)

cat("  ✓ LM vs LME diagnostic plots created\n\n")

# ------------------------------------------------------------------------------
# Step 2.5c: LM vs LME comparison table
# ------------------------------------------------------------------------------

lm_lme_comparison <- data.frame(
  Model = c("Linear Model", "Linear Mixed Effects Model"),
  R2 = c(
    cor(merged_data$mean_pollution, merged_data$pred_lm)^2,
    cor(merged_data$mean_pollution, merged_data$pred_lme_log)^2
  ),
  RMSE = c(
    sqrt(mean((merged_data$mean_pollution - merged_data$pred_lm)^2)),
    sqrt(mean((merged_data$mean_pollution - merged_data$pred_lme_log)^2))
  ),
  MAE = c(
    mean(abs(merged_data$mean_pollution - merged_data$pred_lm)),
    mean(abs(merged_data$mean_pollution - merged_data$pred_lme_log))
  )
)

cat("LM vs LME COMPARISON:\n")
print(lm_lme_comparison, row.names = FALSE)
cat("\n")

# ------------------------------------------------------------------------------
# Step 2.6: Regression Kriging
# ------------------------------------------------------------------------------

cat("Step 2.6: Performing Regression Kriging...\n")

# Compute residuals (LME predicts on original scale, so log-transform first)
merged_data$trend_lme <- log1p(predict(final_regression_model))
merged_data$residuals <- merged_data$mean_pollution - merged_data$trend_lme

# Convert to point data (centroids)
merged_data_centroids <- merged_data %>%
  st_centroid()

# Fit variogram to residuals
cat("  → Fitting variogram to residuals...\n")

bbox <- st_bbox(merged_data)
max_distance <- sqrt((bbox["xmax"] - bbox["xmin"])^2 + (bbox["ymax"] - bbox["ymin"])^2)
cutoff <- max_distance / 3

residual_variogram <- variogram(residuals ~ 1,
                                locations = merged_data_centroids,
                                cutoff = cutoff)
residual_variogram_fit <- fit.variogram(residual_variogram, model = vgm("Sph"))

cat(sprintf("  ✓ Variogram fitted (nugget=%.4f, sill=%.4f, range=%.0fm)\n",
            residual_variogram_fit$psill[1],
            residual_variogram_fit$psill[2],
            residual_variogram_fit$range[2]))

# Plot variogram
plot(residual_variogram, residual_variogram_fit,
     main = "Residual Variogram for Regression Kriging",
     xlab = "Distance (m)", ylab = "Semivariance")
# up to 5000m we see autocorr. of residuals (is needed), eventually similarity increases again (possibly isotropic effect?)
# amount of spat. corr. is relatively small but there

# Predict trend at observation locations (ward centroids)
cat("  → Predicting trend component at ward centroids...\n")
# LME predicts on original scale, log-transform to match data scale
merged_data_centroids$trend_pred <- log1p(predict(final_regression_model))

# Fit variogram to trend predictions
# predictions for each grid-cell
cat("  → Fitting variogram to trend predictions...\n")
trend_variogram <- variogram(trend_pred ~ 1,
                            locations = merged_data_centroids,
                            cutoff = cutoff)
trend_variogram_fit <- fit.variogram(trend_variogram, model = vgm("Sph"))

cat(sprintf("  ✓ Trend variogram fitted (nugget=%.4f, sill=%.4f, range=%.0fm)\n",
            trend_variogram_fit$psill[1],
            trend_variogram_fit$psill[2],
            trend_variogram_fit$range[2]))

# Krige trend surface to grid
cat("  → Kriging trend surface to grid...\n")
trend_kriging <- krige(trend_pred ~ 1,
                      merged_data_centroids,
                      grid_50m,
                      trend_variogram_fit,
                      nmax = 50)
grid_50m$trend_pred <- trend_kriging$var1.pred

# kriging for model residuals
# Krige residuals to grid
cat("  → Kriging residuals to grid...\n")
residual_kriging <- krige(residuals ~ 1,
                          merged_data_centroids,
                          grid_50m,
                          residual_variogram_fit,
                          nmax = 50)

# Combine kriged trend + kriged residuals
grid_50m$regression_kriging <- grid_50m$trend_pred + residual_kriging$var1.pred

cat("  ✓ Regression Kriging complete\n\n")

# ------------------------------------------------------------------------------
# Step 2.7: Ordinary Kriging
# ------------------------------------------------------------------------------

cat("Step 2.7: Performing Ordinary Kriging...\n")

#for centroids of wards, treat it all as stochastic
# Fit variogram to PM2.5 directly
variogram_ok <- variogram(mean_pollution ~ 1,
                         locations = merged_data_centroids,
                         cutoff = cutoff)
variogram_ok_fit <- fit.variogram(variogram_ok, model = vgm("Sph"))

cat(sprintf("  ✓ Variogram fitted (nugget=%.4f, sill=%.4f, range=%.0fm)\n",
            variogram_ok_fit$psill[1],
            variogram_ok_fit$psill[2],
            variogram_ok_fit$range[2]))

# Plot variogram
plot(variogram_ok, variogram_ok_fit,
     main = "Variogram for Ordinary Kriging",
     xlab = "Distance (m)", ylab = "Semivariance")

# Perform kriging
ok_result <- krige(mean_pollution ~ 1,
                   merged_data_centroids,
                   grid_50m,
                   variogram_ok_fit,
                   nmax = 50)
str(ok_result) # use var1.var for visualisation!!!

grid_50m$ordinary_kriging <- ok_result$var1.pred

cat("  ✓ Ordinary Kriging complete\n\n")

# ------------------------------------------------------------------------------
# Step 2.8: Cokriging (with NOx as covariate)
# ------------------------------------------------------------------------------

cat("Step 2.8: Performing Cokriging (PM2.5 with NOx)...\n")

# sample variogram pollution
# Create gstat object
g <- gstat(id = "mean_pollution",
           formula = mean_pollution ~ 1,
           data = merged_data_centroids)

# sample variogram pollution
# 2nd one just added
g <- gstat(g,
           id = "mean_NOx",
           formula = mean_NOx ~ 1,
           data = merged_data_centroids)

# sample cross variogram
# Fit variograms
cat("  → Computing cross-variograms...\n")
variogram_cok <- variogram(g, cutoff = cutoff)

# Define initial models
initial_model <- vgm(psill = 0.05, model = "Sph", range = 15000, nugget = 0.01) # params are modified later, but we need starting params

g <- gstat(g, id = "mean_pollution", model = initial_model)
g <- gstat(g, id = "mean_NOx", model = initial_model)

# Cross-variogram
cross_model <- vgm(psill = 0.04, model = "Sph", range = 15000, nugget = 0.01)
g <- gstat(g, id = c("mean_pollution", "mean_NOx"), model = cross_model)

# Fit Linear Model of Coregionalization
cat("  → Fitting Linear Model of Coregionalization...\n")
lmc_model <- fit.lmc(variogram_cok, g)

# Perform cokriging
cat("  → Predicting to grid...\n")
cokriging_result <- predict(lmc_model, newdata = grid_50m) #automatically uses cokriging

grid_50m$cokriging <- cokriging_result$mean_pollution.pred

cat("  ✓ Cokriging complete\n\n")

# ------------------------------------------------------------------------------
# Step 2.9: Inverse Distance Weighting (IDW)
# ------------------------------------------------------------------------------

cat("Step 2.9: Performing Inverse Distance Weighting...\n")

idw_result <- idw(mean_pollution ~ 1,
                  merged_data_centroids,
                  grid_50m,
                  idp = 2,
                  nmax = 50) # max. neigboring values

grid_50m$idw <- idw_result$var1.pred

cat("  ✓ IDW complete\n\n")

cat("✓ GEOSTATISTICAL INTERPOLATION COMPLETE\n\n")

# ==============================================================================
# TASK 3: MAPPING AND VISUALIZATION
# ==============================================================================

cat("\n========================================\n")
cat("TASK 3: MAPPING AND VISUALIZATION\n")
cat("========================================\n\n")

cat("Creating thematic maps for all interpolation methods...\n\n")

# Convert grid to raster for better visualization
grid_vect <- vect(grid_50m)
r_template <- rast(ext(grid_vect), resolution = 50, crs = crs(grid_vect))

r_rk <- rasterize(grid_vect, r_template, field = "regression_kriging")
r_ok <- rasterize(grid_vect, r_template, field = "ordinary_kriging")
r_cok <- rasterize(grid_vect, r_template, field = "cokriging")
r_idw <- rasterize(grid_vect, r_template, field = "idw")

# Create maps
map_rk <- tm_shape(r_rk) +
  tm_raster(title = "log(PM2.5)", palette = "YlOrRd", style = "cont") +
  tm_layout(title = "Regression Kriging", legend.outside = TRUE)

map_ok <- tm_shape(r_ok) +
  tm_raster(title = "log(PM2.5)", palette = "YlOrRd", style = "cont") +
  tm_layout(title = "Ordinary Kriging", legend.outside = TRUE)

map_cok <- tm_shape(r_cok) +
  tm_raster(title = "log(PM2.5)", palette = "YlOrRd", style = "cont") +
  tm_layout(title = "Cokriging (with NOx)", legend.outside = TRUE)

map_idw <- tm_shape(r_idw) +
  tm_raster(title = "log(PM2.5)", palette = "YlOrRd", style = "cont") +
  tm_layout(title = "Inverse Distance Weighting", legend.outside = TRUE)

# Display all maps
print(tmap_arrange(map_rk, map_ok, map_cok, map_idw, ncol = 2))

cat("✓ Maps created and displayed\n\n")

### regress. , ord. and cokriging similar, IDW worse with bullseye effect
# -> now check performance with crossvalidation

# ==============================================================================
# TASK 4: CROSS-VALIDATION
# ==============================================================================

cat("\n========================================\n")
cat("TASK 4: CROSS-VALIDATION (10-FOLD)\n")
cat("========================================\n\n")

cat("Performing 10-fold cross-validation for all methods...\n\n")

# Convert to centroids for point-based methods
merged_data_cv <- merged_data %>%
  st_centroid()

# Create 10 folds
set.seed(42)
folds <- createFolds(merged_data_cv$mean_pollution, k = 10, list = TRUE)

# Initialize storage
cv_results <- data.frame(
  Method = character(),
  Observed = numeric(),
  Predicted = numeric(),
  Fold = integer()
)

# ------------------------------------------------------------------------------
# CV Loop
# ------------------------------------------------------------------------------

for(fold_i in seq_along(folds)) {
  cat(sprintf("  Processing fold %d/%d...\n", fold_i, length(folds)))

  test_idx <- folds[[fold_i]]
  train_idx <- setdiff(1:nrow(merged_data_cv), test_idx)

  training <- merged_data_cv[train_idx, ]
  testing <- merged_data_cv[test_idx, ]

  training_df <- st_drop_geometry(training)
  testing_df <- st_drop_geometry(testing)

  # 1) Regression Kriging (using LME)
  # Back-transform for LME
  training_df$mean_pollution_original <- exp(training_df$mean_pollution) - 1

  # Fit LME model
  model_fold <- lme(
    fixed = formula_lme,
    random = ~ 1 | GSS_CODE.borough,
    data = training_df,
    weights = varPower(form = ~ mean_pollution)
  )

  # Predict trend and compute residuals (log-transform LME predictions)
  training$trend_pred_fold <- log1p(predict(model_fold, training_df))
  training$residuals_fold <- training$mean_pollution - training$trend_pred_fold

  # Krige trend predictions to test locations
  vgm_trend_fold <- variogram(trend_pred_fold ~ 1, locations = training, cutoff = cutoff)
  vgm_trend_fold_fit <- fit.variogram(vgm_trend_fold, model = vgm("Sph"))
  kriged_trend <- krige(trend_pred_fold ~ 1, training, testing, vgm_trend_fold_fit, nmax = 50)

  # Krige residuals to test locations
  vgm_resid_fold <- variogram(residuals_fold ~ 1, locations = training, cutoff = cutoff)
  vgm_resid_fold_fit <- fit.variogram(vgm_resid_fold, model = vgm("Sph"))
  kriged_resid <- krige(residuals_fold ~ 1, training, testing, vgm_resid_fold_fit, nmax = 50)

  # Combine kriged trend + kriged residuals
  pred_rk <- kriged_trend$var1.pred + kriged_resid$var1.pred

  # 2) Ordinary Kriging
  vgm_ok_fold <- variogram(mean_pollution ~ 1, locations = training, cutoff = cutoff)
  vgm_ok_fold_fit <- fit.variogram(vgm_ok_fold, model = vgm("Sph"))

  kriged_ok <- krige(mean_pollution ~ 1, training, testing, vgm_ok_fold_fit, nmax = 50)
  pred_ok <- kriged_ok$var1.pred

  # 3) Cokriging (with NOx)
  g_fold <- gstat(id = "mean_pollution",
                  formula = mean_pollution ~ 1,
                  data = training)
  g_fold <- gstat(g_fold,
                  id = "mean_NOx",
                  formula = mean_NOx ~ 1,
                  data = training)

  vgm_cok_fold <- variogram(g_fold, cutoff = cutoff)

  initial_model_fold <- vgm(psill = 0.05, model = "Sph", range = 15000, nugget = 0.01)
  g_fold <- gstat(g_fold, id = "mean_pollution", model = initial_model_fold)
  g_fold <- gstat(g_fold, id = "mean_NOx", model = initial_model_fold)

  cross_model_fold <- vgm(psill = 0.04, model = "Sph", range = 15000, nugget = 0.01)
  g_fold <- gstat(g_fold, id = c("mean_pollution", "mean_NOx"), model = cross_model_fold)

  lmc_fold <- fit.lmc(vgm_cok_fold, g_fold)
  cokriging_fold <- predict(lmc_fold, newdata = testing)
  pred_cok <- cokriging_fold$mean_pollution.pred

  # 4) IDW
  idw_fold <- idw(mean_pollution ~ 1, training, testing, idp = 2, nmax = 50)
  pred_idw <- idw_fold$var1.pred

  # Store results
  cv_results <- rbind(cv_results,
    data.frame(Method = "Regression_Kriging",
               Observed = testing$mean_pollution,
               Predicted = pred_rk,
               Fold = fold_i),
    data.frame(Method = "Ordinary_Kriging",
               Observed = testing$mean_pollution,
               Predicted = pred_ok,
               Fold = fold_i),
    data.frame(Method = "Cokriging",
               Observed = testing$mean_pollution,
               Predicted = pred_cok,
               Fold = fold_i),
    data.frame(Method = "IDW",
               Observed = testing$mean_pollution,
               Predicted = pred_idw,
               Fold = fold_i)
  )
}

cat("\n✓ Cross-validation complete\n\n")

# ------------------------------------------------------------------------------
# Calculate CV Metrics
# ------------------------------------------------------------------------------

# we expect IDW to be less powerful than the other ones, otherwise quite similar results could be expected for the performance

cat("CROSS-VALIDATION RESULTS:\n")
cat("═══════════════════════════════════════\n\n")

cv_metrics <- cv_results %>%
  group_by(Method) %>%
  summarise(
    RMSE = sqrt(mean((Observed - Predicted)^2)),
    MAE = mean(abs(Observed - Predicted)),
    R2 = cor(Observed, Predicted)^2,
    Bias = mean(Predicted - Observed),
    .groups = "drop"
  ) %>%
  arrange(RMSE)

print(as.data.frame(cv_metrics), row.names = FALSE, digits = 4)

# ordinary kriging seems to be the best; loewst RMSE, MAE, r2

cat("\n")

# ------------------------------------------------------------------------------
# Visualization of CV Results
# ------------------------------------------------------------------------------

cat("\nCreating cross-validation diagnostic plots...\n\n")

# Observed vs Predicted
p_cv <- ggplot(cv_results, aes(x = Observed, y = Predicted, color = Method)) +
  geom_point(alpha = 0.5) +
  geom_abline(slope = 1, intercept = 0, linetype = "dashed") +
  facet_wrap(~Method, ncol = 3) +
  labs(title = "10-Fold Cross-Validation: Observed vs Predicted",
       x = "Observed log(PM2.5 + 1)",
       y = "Predicted log(PM2.5 + 1)") +
  theme_minimal() +
  theme(legend.position = "none")

print(p_cv)

# res. for ordinary kriging good enough, stronger bias can be seen in IDW

# Residual distributions
cv_results$Residual <- cv_results$Observed - cv_results$Predicted

p_resid <- ggplot(cv_results, aes(x = Residual, fill = Method)) +
  geom_histogram(bins = 30, alpha = 0.7) +
  geom_vline(xintercept = 0, linetype = "dashed", color = "red") +
  facet_wrap(~Method, ncol = 3, scales = "free_y") +
  labs(title = "Cross-Validation Residual Distributions",
       x = "Residual (Observed - Predicted)",
       y = "Frequency") +
  theme_minimal() +
  theme(legend.position = "none")

print(p_resid)

# ==============================================================================
# FINAL SUMMARY AND RECOMMENDATIONS
# ==============================================================================

cat("\n╔════════════════════════════════════════╗\n")
cat("║         FINAL SUMMARY                ║\n")
cat("╚════════════════════════════════════════╝\n\n")

best_method <- cv_metrics$Method[1]

cat("✓ BEST PERFORMING METHOD:\n")
cat("─────────────────────────────────────────\n")
cat(sprintf("Method: %s\n", best_method))
cat(sprintf("CV RMSE: %.4f\n", cv_metrics$RMSE[1]))
cat(sprintf("CV R²:   %.4f\n", cv_metrics$R2[1]))
cat(sprintf("CV MAE:  %.4f\n\n", cv_metrics$MAE[1]))

cat("✓ METHOD COMPARISON:\n")
cat("─────────────────────────────────────────\n")
for(i in 1:nrow(cv_metrics)) {
  cat(sprintf("%d. %-20s RMSE=%.4f  R²=%.4f\n",
              i, cv_metrics$Method[i], cv_metrics$RMSE[i], cv_metrics$R2[i]))
}

cat("\n✓ KEY FINDINGS:\n")
cat("─────────────────────────────────────────\n")
cat("• Regression Kriging incorporates socioeconomic predictors\n")
cat("• Ordinary Kriging relies solely on spatial structure\n")
cat("• Cokriging leverages correlation with NOx concentrations\n")
cat("• IDW is simplest but may miss local variations\n")
cat("• Cross-validation provides realistic performance estimates\n")

cat("\n✓ RECOMMENDATIONS:\n")
cat("─────────────────────────────────────────\n")
cat(sprintf("• Use %s for final predictions\n", best_method))
cat("• Consider ensemble approach combining top methods\n")
cat("• Account for uncertainty in policy decisions\n")
cat("• Validate with held-out monitoring stations if available\n")

cat("\n╔════════════════════════════════════════╗\n")
cat("║      ANALYSIS COMPLETE! ✓            ║\n")
cat("╚════════════════════════════════════════╝\n\n")
