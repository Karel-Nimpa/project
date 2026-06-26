library(spdep)
library(spatialreg)

# ============================================================
# 1) LOAD SPATIAL DATA
# ============================================================

GreaterLondonWards <- st_read(
  "H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/London-wards-2018/London_Ward/London_Ward.shp"
)

PollutionGrid <- st_read(
  "H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/LAEI2019-pm2-5-grid-emissions-all-sources/LAEI2019-pm2-5-grid-emissions-all-sources.shp"
)

# Quick plot
spplot(as(PollutionGrid, "Spatial"), zcol = "all_2025", main = "PM2.5 Grid")

# Check CRS
st_crs(GreaterLondonWards)
st_crs(PollutionGrid)

# Transform pollution grid if needed
if (st_crs(GreaterLondonWards) != st_crs(PollutionGrid)) {
  PollutionGrid <- st_transform(PollutionGrid, st_crs(GreaterLondonWards))
}

# ============================================================
# 2) AREA-WEIGHTED PM2.5 BY WARD
# ============================================================

Intersected <- st_intersection(GreaterLondonWards, PollutionGrid)

Intersected <- Intersected %>%
  mutate(intersect_area = st_area(.))

WeightedPollution <- Intersected %>%
  group_by(GSS_CODE) %>%
  summarize(
    mean_pollution = sum(all_2025 * as.numeric(intersect_area), na.rm = TRUE) /
      sum(as.numeric(intersect_area), na.rm = TRUE)
  )

WeightedPollution$mean_pollution <- as.numeric(WeightedPollution$mean_pollution)

WeightedPollution_df <- as.data.frame(WeightedPollution) %>%
  dplyr::select(GSS_CODE, mean_pollution)

GreaterLondonWards <- GreaterLondonWards %>%
  left_join(WeightedPollution_df, by = "GSS_CODE")

# ============================================================
# 3) VISUALIZE RAW PM2.5
# ============================================================

tm_shape(GreaterLondonWards) +
  tm_polygons("mean_pollution", palette = "YlOrRd", title = "Mean PM2.5") +
  tm_layout(title = "Average PM2.5 Concentration by Ward")

# Optional exploratory binned version
GreaterLondonWards$log_pollution_bins <- cut(
  log1p(GreaterLondonWards$mean_pollution),
  breaks = quantile(log1p(GreaterLondonWards$mean_pollution),
                    probs = seq(0, 1, 0.2),
                    na.rm = TRUE),
  include.lowest = TRUE
)

tm_shape(GreaterLondonWards) +
  tm_polygons("log_pollution_bins", palette = "YlOrRd", title = "Log-binned PM2.5") +
  tm_layout(title = "Log-Transformed & Binned PM2.5")

GreaterLondonWards$log_pollution_bins <- NULL

# ============================================================
# 4) LOAD SOCIOECONOMIC DATA
# ============================================================

temp_file <- "H:/Uni/Uni_WS2025_26/geostatistics_2025_26/data/portfolio_2/ward-profiles-excel-version.csv"
ward_data <- read.csv(temp_file, sep = ",")

# Convert columns from 5th onward to numeric
ward_data[, 5:ncol(ward_data)] <- lapply(
  ward_data[, 5:ncol(ward_data)],
  function(x) as.numeric(gsub(",", "", as.character(x)))
)

str(ward_data)

# ============================================================
# 5) MERGE SPATIAL + SOCIOECONOMIC DATA
# ============================================================

merged_data <- merge(
  GreaterLondonWards,
  ward_data,
  by.x = "GSS_CODE",
  by.y = "New.code",
  all.x = TRUE
)

# Keep complete cases for modelling
merged_data_clean <- na.omit(merged_data)

# Store raw PM2.5, then log-transform for modelling
merged_data_clean$pm25_raw <- merged_data_clean$mean_pollution
merged_data_clean$mean_pollution <- log1p(merged_data_clean$mean_pollution)

# Use ward IDs as row names (helpful for spatialreg prediction)
rownames(merged_data_clean) <- merged_data_clean$GSS_CODE

cat("\n========================================\n")
cat("DATA CLEANING SUMMARY\n")
cat("========================================\n")
cat(sprintf("Original wards: %d\n", nrow(GreaterLondonWards)))
cat(sprintf("After merge + NA removal: %d\n", nrow(merged_data_clean)))
cat(sprintf("Dropped wards: %d\n", nrow(GreaterLondonWards) - nrow(merged_data_clean)))

if (nrow(GreaterLondonWards) != nrow(merged_data_clean)) {
  dropped_wards <- setdiff(GreaterLondonWards$GSS_CODE, merged_data_clean$GSS_CODE)
  cat("Dropped ward IDs:\n")
  print(dropped_wards)
}

# ============================================================
# 6) QUEEN CONTIGUITY NEIGHBOURS ON FINAL CLEAN DATASET
# ============================================================

nb_queen <- poly2nb(merged_data_clean, queen = TRUE)
lw_queen <- nb2listw(nb_queen, style = "W", zero.policy = TRUE)

# ============================================================
# 7) NEIGHBOURHOOD STRUCTURE DIAGNOSTICS
# ============================================================

cat("\n========================================\n")
cat("NEIGHBOURHOOD STRUCTURE DIAGNOSTICS\n")
cat("========================================\n")

n_neigh <- card(nb_queen)

cat(sprintf("Number of wards: %d\n", length(nb_queen)))
cat(sprintf("Minimum neighbours: %d\n", min(n_neigh)))
cat(sprintf("Maximum neighbours: %d\n", max(n_neigh)))
cat(sprintf("Mean neighbours: %.2f\n", mean(n_neigh)))
cat(sprintf("Median neighbours: %.2f\n", median(n_neigh)))

isolates <- which(n_neigh == 0)
cat(sprintf("Number of isolates: %d\n", length(isolates)))
if (length(isolates) > 0) {
  cat("Isolated wards:\n")
  print(merged_data_clean$GSS_CODE[isolates])
}

comp <- n.comp.nb(nb_queen)
cat(sprintf("Number of connected components: %d\n", comp$nc))
if (comp$nc > 1) {
  cat("Component sizes:\n")
  print(table(comp$comp.id))
}

hist(
  n_neigh,
  main = "Neighbour Count per Ward (Queen Contiguity)",
  xlab = "Number of neighbours",
  col = "lightblue",
  border = "black"
)

# ============================================================
# 8) GLOBAL MORAN'S I FOR LOG(PM2.5 + 1)
# ============================================================

global_moran <- moran.test(
  merged_data_clean$mean_pollution,
  lw_queen,
  zero.policy = TRUE
)

cat("\n========================================\n")
cat("GLOBAL MORAN'S I FOR LOG(PM2.5 + 1)\n")
cat("========================================\n")
print(global_moran)

# ============================================================
# 9) CORRELATION-BASED PREDICTOR SCREENING
# ============================================================

# Drop geometry first
model_df <- st_drop_geometry(merged_data_clean)

# Keep only numeric columns
numeric_cols <- sapply(model_df, is.numeric)
numeric_data <- model_df[, numeric_cols]

# Exclude response and obvious non-predictors
exclude_vars <- c("mean_pollution", "pm25_raw", "intersect_area")
candidate_vars <- setdiff(names(numeric_data), exclude_vars)

# Correlations with response
correlations <- sapply(candidate_vars, function(v) {
  cor(model_df[[v]], model_df$mean_pollution, use = "complete.obs")
})

sorted_correlations <- sort(abs(correlations), decreasing = TRUE)

top_n <- 10
top_variables <- names(sorted_correlations)[1:top_n]

cor_table <- data.frame(
  Variable = top_variables,
  Correlation = correlations[top_variables],
  AbsCorrelation = abs(correlations[top_variables]),
  row.names = NULL
)

cat("\n========================================\n")
cat("TOP CORRELATED PREDICTORS\n")
cat("========================================\n")
print(cor_table)

# Optional correlation bar plot
ggplot(cor_table, aes(x = reorder(Variable, AbsCorrelation), y = Correlation)) +
  geom_col(fill = "steelblue") +
  coord_flip() +
  labs(
    title = "Top Predictors of log(PM2.5 + 1)",
    x = "Predictor",
    y = "Correlation"
  ) +
  theme_minimal()

# ============================================================
# 10) FIT REGRESSION MODELS
# ============================================================

formula_str <- as.formula(
  paste("mean_pollution ~", paste(top_variables, collapse = " + "))
)

# LM
lm_model <- lm(formula_str, data = st_drop_geometry(merged_data_clean))
summary(lm_model)

# Spatial Lag Model
lag_model <- lagsarlm(
  formula_str,
  data = st_drop_geometry(merged_data_clean),
  listw = lw_queen,
  zero.policy = TRUE
)
summary(lag_model)

# Spatial Error Model
error_model <- errorsarlm(
  formula_str,
  data = st_drop_geometry(merged_data_clean),
  listw = lw_queen,
  zero.policy = TRUE
)
summary(error_model)

# ============================================================
# 11) MODEL COMPARISON TABLE
# ============================================================

resid_lm    <- residuals(lm_model)
resid_lag   <- residuals(lag_model)
resid_error <- residuals(error_model)

moran_lm    <- moran.test(resid_lm, lw_queen, zero.policy = TRUE)
moran_lag   <- moran.test(resid_lag, lw_queen, zero.policy = TRUE)
moran_error <- moran.test(resid_error, lw_queen, zero.policy = TRUE)

model_comparison <- data.frame(
  Model = c("Linear Model", "Spatial Lag Model", "Spatial Error Model"),
  AIC = c(AIC(lm_model), AIC(lag_model), AIC(error_model)),
  LogLik = c(
    as.numeric(logLik(lm_model)),
    as.numeric(logLik(lag_model)),
    as.numeric(logLik(error_model))
  ),
  Residual_Moran_I = c(
    unname(moran_lm$estimate[1]),
    unname(moran_lag$estimate[1]),
    unname(moran_error$estimate[1])
  ),
  Residual_Moran_p = c(
    moran_lm$p.value,
    moran_lag$p.value,
    moran_error$p.value
  )
)

cat("\n========================================\n")
cat("MODEL COMPARISON TABLE\n")
cat("========================================\n")
print(model_comparison)

# Optional export
# write.csv(model_comparison, "model_comparison_pm25.csv", row.names = FALSE)

# ============================================================
# 12) COEFFICIENT COMPARISON TABLE
# ============================================================

# LM coefficients
lm_coef <- summary(lm_model)$coefficients
lm_df <- data.frame(
  Variable = rownames(lm_coef),
  LM_Estimate = lm_coef[, "Estimate"],
  LM_p = lm_coef[, "Pr(>|t|)"],
  row.names = NULL
)

# Lag coefficients
lag_coef <- summary(lag_model)$Coef
lag_df <- data.frame(
  Variable = rownames(lag_coef),
  Lag_Estimate = lag_coef[, "Estimate"],
  Lag_p = lag_coef[, "Pr(>|z|)"],
  row.names = NULL
)

# Error coefficients
err_coef <- summary(error_model)$Coef
err_df <- data.frame(
  Variable = rownames(err_coef),
  Error_Estimate = err_coef[, "Estimate"],
  Error_p = err_coef[, "Pr(>|z|)"],
  row.names = NULL
)

coef_comparison <- lm_df %>%
  full_join(lag_df, by = "Variable") %>%
  full_join(err_df, by = "Variable")

cat("\n========================================\n")
cat("COEFFICIENT COMPARISON TABLE\n")
cat("========================================\n")
print(coef_comparison)

spatial_params <- data.frame(
  Model = c("Spatial Lag Model", "Spatial Error Model"),
  Spatial_Parameter = c("rho", "lambda"),
  Estimate = c(lag_model$rho, error_model$lambda)
)

cat("\n========================================\n")
cat("SPATIAL PARAMETERS\n")
cat("========================================\n")
print(spatial_params)

# ============================================================
# 13) RESIDUAL DIAGNOSTICS
# ============================================================

# -------------------------
# LM
# -------------------------
par(mfrow = c(2, 2))

hist(resid_lm, main = "Histogram of Residuals (LM)",
     xlab = "Residuals", col = "lightgray", border = "black")

fitted_lm <- fitted(lm_model)
plot(fitted_lm, resid_lm,
     main = "Residuals vs Fitted (LM)",
     xlab = "Fitted Values", ylab = "Residuals",
     col = "gray", pch = 20)
abline(h = 0, col = "red")

plot(fitted_lm, merged_data_clean$mean_pollution,
     main = "Observed vs Fitted (LM)",
     xlab = "Fitted Values", ylab = "Observed",
     col = "gray", pch = 20)
abline(a = 0, b = 1, col = "red")

cat("Correlation (Observed vs Fitted, LM):",
    cor(fitted_lm, merged_data_clean$mean_pollution), "\n")

# -------------------------
# Lag
# -------------------------
par(mfrow = c(2, 2))

hist(resid_lag, main = "Histogram of Residuals (Lag Model)",
     xlab = "Residuals", col = "lightblue", border = "black")

fitted_lag <- fitted(lag_model)
plot(fitted_lag, resid_lag,
     main = "Residuals vs Fitted (Lag Model)",
     xlab = "Fitted Values", ylab = "Residuals",
     col = "blue", pch = 20)
abline(h = 0, col = "red")

plot(fitted_lag, merged_data_clean$mean_pollution,
     main = "Observed vs Fitted (Lag Model)",
     xlab = "Fitted Values", ylab = "Observed",
     col = "blue", pch = 20)
abline(a = 0, b = 1, col = "red")

cat("Correlation (Observed vs Fitted, Lag Model):",
    cor(fitted_lag, merged_data_clean$mean_pollution), "\n")

# -------------------------
# Error
# -------------------------
par(mfrow = c(2, 2))

hist(resid_error, main = "Histogram of Residuals (Error Model)",
     xlab = "Residuals", col = "lightgreen", border = "black")

fitted_error <- fitted(error_model)
plot(fitted_error, resid_error,
     main = "Residuals vs Fitted (Error Model)",
     xlab = "Fitted Values", ylab = "Residuals",
     col = "green3", pch = 20)
abline(h = 0, col = "red")

plot(fitted_error, merged_data_clean$mean_pollution,
     main = "Observed vs Fitted (Error Model)",
     xlab = "Fitted Values", ylab = "Observed",
     col = "green3", pch = 20)
abline(a = 0, b = 1, col = "red")

cat("Correlation (Observed vs Fitted, Error Model):",
    cor(fitted_error, merged_data_clean$mean_pollution), "\n")

# ============================================================
# 14) MAP OBSERVED, PREDICTED, AND RESIDUALS
# ============================================================

merged_data_clean$lm_fitted <- fitted_lm
merged_data_clean$lag_fitted <- fitted_lag
merged_data_clean$error_fitted <- fitted_error

merged_data_clean$lm_residuals <- resid_lm
merged_data_clean$lag_residuals <- resid_lag
merged_data_clean$error_residuals <- resid_error

# Observed
tm_observed <- tm_shape(merged_data_clean) +
  tm_polygons("mean_pollution", title = "Observed log(PM2.5 + 1)",
              palette = "Blues", style = "quantile") +
  tm_layout(title = "Observed PM2.5")

# Predicted
tm_lm <- tm_shape(merged_data_clean) +
  tm_polygons("lm_fitted", title = "Predicted (LM)",
              palette = "Purples", style = "quantile") +
  tm_layout(title = "Predicted by LM")

tm_lag <- tm_shape(merged_data_clean) +
  tm_polygons("lag_fitted", title = "Predicted (Lag)",
              palette = "Greens", style = "quantile") +
  tm_layout(title = "Predicted by Spatial Lag Model")

tm_error <- tm_shape(merged_data_clean) +
  tm_polygons("error_fitted", title = "Predicted (Error)",
              palette = "Oranges", style = "quantile") +
  tm_layout(title = "Predicted by Spatial Error Model")

tmap_arrange(tm_observed, tm_lm, tm_lag, tm_error, ncol = 4)

# Residual maps
tm_lm_residuals <- tm_shape(merged_data_clean) +
  tm_polygons("lm_residuals", title = "Residuals (LM)",
              palette = "-RdBu", style = "quantile") +
  tm_layout(title = "Residuals of LM")

tm_lag_residuals <- tm_shape(merged_data_clean) +
  tm_polygons("lag_residuals", title = "Residuals (Lag)",
              palette = "-RdBu", style = "quantile") +
  tm_layout(title = "Residuals of Spatial Lag Model")

tm_error_residuals <- tm_shape(merged_data_clean) +
  tm_polygons("error_residuals", title = "Residuals (Error)",
              palette = "-RdBu", style = "quantile") +
  tm_layout(title = "Residuals of Spatial Error Model")

tmap_arrange(tm_lm_residuals, tm_lag_residuals, tm_error_residuals, ncol = 3)

# ============================================================
# 15) SPATIAL BLOCK CROSS-VALIDATION
# ============================================================

cat("\n========================================\n")
cat("SPATIAL BLOCK CROSS-VALIDATION\n")
cat("========================================\n")

# ------------------------------------------------------------
# 15.1 Create spatial blocks using k-means on centroids
# ------------------------------------------------------------

n_folds <- 5

coords <- st_centroid(merged_data_clean)
coords <- st_coordinates(coords)

set.seed(42)
spatial_clusters <- kmeans(coords, centers = n_folds, nstart = 25)
merged_data_clean$spatial_block <- spatial_clusters$cluster

tm_blocks <- tm_shape(merged_data_clean) +
  tm_polygons("spatial_block",
              palette = "Set3",
              title = "CV Fold",
              style = "cat") +
  tm_layout(title = "Spatial Cross-Validation Blocks",
            legend.outside = TRUE)
print(tm_blocks)

cat(sprintf("Created %d spatial blocks\n", n_folds))
print(table(merged_data_clean$spatial_block))

# ------------------------------------------------------------
# 15.2 Run CV
# ------------------------------------------------------------

cv_results <- data.frame(
  fold = integer(),
  model = character(),
  observed = numeric(),
  predicted = numeric(),
  test_size = integer()
)

buffer_distance <- 0

for (fold in 1:n_folds) {
  
  cat(sprintf("\nProcessing fold %d/%d...\n", fold, n_folds))
  
  test_idx <- which(merged_data_clean$spatial_block == fold)
  
  if (buffer_distance > 0) {
    suppressWarnings({
      test_centroids <- st_centroid(merged_data_clean[test_idx, ])
      train_candidates <- merged_data_clean[-test_idx, ]
      train_centroids <- st_centroid(train_candidates)
    })
    
    dist_matrix <- st_distance(train_centroids, test_centroids)
    min_dist <- apply(dist_matrix, 1, min)
    
    buffer_idx <- which(min_dist > buffer_distance)
    train_idx <- which(merged_data_clean$GSS_CODE %in% train_candidates$GSS_CODE[buffer_idx])
    
    cat(sprintf("With %dm buffer: %d train, %d test\n",
                buffer_distance, length(train_idx), length(test_idx)))
  } else {
    train_idx <- which(merged_data_clean$spatial_block != fold)
    cat(sprintf("Train: %d wards, Test: %d wards\n",
                length(train_idx), length(test_idx)))
  }
  
  if (length(train_idx) < 50) {
    cat("Skipping fold (insufficient training data)\n")
    next
  }
  
  train_data <- merged_data_clean[train_idx, ]
  test_data  <- merged_data_clean[test_idx, ]
  
  rownames(train_data) <- train_data$GSS_CODE
  rownames(test_data)  <- test_data$GSS_CODE
  
  train_df <- st_drop_geometry(train_data)
  test_df  <- st_drop_geometry(test_data)
  
  # Queen neighbours on training data
  train_nb <- poly2nb(train_data, queen = TRUE)
  train_lw <- nb2listw(train_nb, style = "W", zero.policy = TRUE)
  
  # Formula
  formula_cv <- as.formula(
    paste("mean_pollution ~", paste(top_variables, collapse = " + "))
  )
  
  # -------------------------
  # OLS
  # -------------------------
  model_ols <- lm(formula_cv, data = train_df)
  pred_ols <- predict(model_ols, newdata = test_df)
  
  # -------------------------
  # Spatial Lag Model
  # -------------------------
  model_lag_cv <- tryCatch({
    lagsarlm(formula_cv, data = train_df, listw = train_lw, zero.policy = TRUE)
  }, error = function(e) {
    cat("  Lag model failed:", conditionMessage(e), "\n")
    return(NULL)
  })
  
  pred_lag <- rep(NA_real_, nrow(test_df))
  
  if (!is.null(model_lag_cv)) {
    tryCatch({
      all_data <- rbind(train_data, test_data)
      rownames(all_data) <- all_data$GSS_CODE
      
      all_nb <- poly2nb(all_data, queen = TRUE)
      all_lw <- nb2listw(all_nb, style = "W", zero.policy = TRUE)
      
      lag_pred_all <- predict(
        model_lag_cv,
        newdata = st_drop_geometry(all_data),
        listw = all_lw,
        pred.type = "TS",
        zero.policy = TRUE
      )
      
      lag_pred_all <- as.numeric(lag_pred_all)
      pred_lag <- tail(lag_pred_all, nrow(test_df))
      
    }, error = function(e) {
      cat("  Lag prediction failed:", conditionMessage(e), "\n")
      pred_lag <<- pred_ols
    })
  } else {
    pred_lag <- pred_ols
  }
  
  # -------------------------
  # Spatial Error Model
  # -------------------------
  model_sem_cv <- tryCatch({
    errorsarlm(formula_cv, data = train_df, listw = train_lw, zero.policy = TRUE)
  }, error = function(e) {
    cat("  SEM model failed:", conditionMessage(e), "\n")
    return(NULL)
  })
  
  pred_sem <- rep(NA_real_, nrow(test_df))
  
  if (!is.null(model_sem_cv)) {
    tryCatch({
      all_coefs <- coef(model_sem_cv)
      
      if (names(all_coefs)[1] == "lambda") {
        beta <- all_coefs[-1]
      } else if (tail(names(all_coefs), 1) == "lambda") {
        beta <- all_coefs[-length(all_coefs)]
      } else {
        beta <- all_coefs
      }
      
      X_test <- model.matrix(formula_cv, data = test_df)
      beta_matched <- beta[colnames(X_test)]
      pred_sem <- as.numeric(X_test %*% beta_matched)
      
    }, error = function(e) {
      cat("  SEM prediction failed:", conditionMessage(e), "\n")
      pred_sem <<- pred_ols
    })
  } else {
    pred_sem <- pred_ols
  }
  
  # Store results
  observed <- test_df$mean_pollution
  
  cv_results <- rbind(
    cv_results,
    data.frame(
      fold = fold,
      model = "OLS",
      observed = observed,
      predicted = pred_ols,
      test_size = length(test_idx)
    ),
    data.frame(
      fold = fold,
      model = "Spatial_Lag",
      observed = observed,
      predicted = pred_lag,
      test_size = length(test_idx)
    ),
    data.frame(
      fold = fold,
      model = "Spatial_Error",
      observed = observed,
      predicted = pred_sem,
      test_size = length(test_idx)
    )
  )
}

cat("\nSpatial CV completed.\n")

# ------------------------------------------------------------
# 15.3 CV summary metrics
# ------------------------------------------------------------

metrics_summary <- cv_results %>%
  group_by(model) %>%
  summarise(
    RMSE = sqrt(mean((observed - predicted)^2, na.rm = TRUE)),
    MAE = mean(abs(observed - predicted), na.rm = TRUE),
    R2 = {
      valid <- !is.na(predicted) & !is.na(observed)
      obs <- observed[valid]
      pred <- predicted[valid]
      if (length(obs) < 10) NA else 1 - sum((obs - pred)^2) / sum((obs - mean(obs))^2)
    },
    n_predictions = sum(!is.na(predicted)),
    .groups = "drop"
  ) %>%
  arrange(RMSE)

cat("\n========================================\n")
cat("SPATIAL CV PERFORMANCE METRICS\n")
cat("========================================\n")
print(as.data.frame(metrics_summary), row.names = FALSE)

# Optional export
# write.csv(metrics_summary, "cv_metrics_pm25.csv", row.names = FALSE)

# ============================================================
# 16) CV DIAGNOSTIC PLOTS
# ============================================================

cv_results$residual <- cv_results$observed - cv_results$predicted

p_cv <- ggplot(
  cv_results %>% filter(!is.na(predicted)),
  aes(x = observed, y = predicted, color = model)
) +
  geom_point(alpha = 0.5, size = 1.5) +
  geom_abline(slope = 1, intercept = 0, linetype = "dashed", color = "black") +
  facet_wrap(~model, ncol = 3) +
  labs(
    title = "Spatial Cross-Validation: Observed vs Predicted",
    subtitle = sprintf("%d-Fold Spatial Block CV", n_folds),
    x = "Observed log(PM2.5 + 1)",
    y = "Predicted log(PM2.5 + 1)"
  ) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "none")

print(p_cv)

p_resid <- ggplot(
  cv_results %>% filter(!is.na(residual)),
  aes(x = residual, fill = model)
) +
  geom_histogram(bins = 30, alpha = 0.7, position = "identity") +
  facet_wrap(~model, ncol = 3, scales = "free_y") +
  geom_vline(xintercept = 0, linetype = "dashed", color = "red") +
  labs(
    title = "Residual Distributions (Spatial CV)",
    x = "Residual (Observed - Predicted)",
    y = "Frequency"
  ) +
  theme_minimal(base_size = 12) +
  theme(legend.position = "none")

print(p_resid)

p_metrics <- metrics_summary %>%
  select(model, RMSE, MAE) %>%
  pivot_longer(cols = c(RMSE, MAE), names_to = "Metric", values_to = "Value") %>%
  ggplot(aes(x = model, y = Value, fill = model)) +
  geom_bar(stat = "identity", position = "dodge") +
  facet_wrap(~Metric, scales = "free_y") +
  labs(
    title = "Model Performance Comparison (Spatial CV)",
    x = "Model",
    y = "Error (log-scale units)"
  ) +
  theme_minimal(base_size = 12) +
  theme(
    axis.text.x = element_text(angle = 45, hjust = 1),
    legend.position = "none"
  )

print(p_metrics)
