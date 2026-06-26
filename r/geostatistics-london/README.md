# Geostatistics London — R scripts

R code for the portfolio project **Spatial Analysis of Crimes vs. Urban Venues in London** (University of Trier, Geospatial Statistics).

## Structure

| Script | Part | Methods |
|--------|------|---------|
| `01_point_pattern_cross_k_and_setup.R` | I | Data loading, cross-G-function (Kcross), Monte Carlo envelopes |
| `02_point_pattern_nn_risk_kde.R` | I | Nearest neighbour, relative risk, KDE hotspot overlap |
| `03_cumulative_impact_zones.R` | II | Moran's I, LISA, Getis–Ord Gi*, spatially constrained clustering |
| `04_spatial_regression_pm25.R` | III | Spatial lag / error models, ward-level PM2.5 regression |
| `05_geostatistical_interpolation_pm25.R` | III–IV | Regression kriging, OK, cokriging, IDW |

## Requirements

- R ≥ 4.x
- Key packages: `sf`, `spatstat`, `spdep`, `gstat`, `dplyr`, `ggplot2`

## Bandwidth selection (Part I KDE)

Violent-crime KDE compares `bw.diggle` and `bw.ppl`; the script uses **PPL** (`sigma_crime <- bw_ppl_crime`) for smoother hotspot surfaces. Venue-type KDE prefers Diggle with PPL fallback when Diggle fails.

## Data

Scripts expect local `.Rdata` / `.gpkg` inputs (crime points, Foursquare venues, London wards, PM2.5 grid). Paths are set relative to the original analysis workspace — adjust `setwd()` and file paths before running.

## Author

Karel Loic Nimpa Fokoua (1734880) — with Patrick Christen (1506810) and Amina Bibi (1777683).
