import { Project } from '../types';
import { publicAsset } from '../utils/publicAsset';

export const projects: Project[] = [
  // Trend analysis of NDVI data and syndrom approach of NDVI data for Europe (1982-2022)
  {
    id: 1,
    title: "Trend analysis of NDVI data and syndrom approach of NDVI data for Europe (1982-2022)",
    category: "GIS",
    description: "Seasonal Mann–Kendall NDVI trends, syndrome mapping, and lagged rainfall–biomass analysis for Europe (1982-2022).",
    tools: ["RStudio", "QGIS"],
    image: publicAsset('image/Europe.jpeg'), 
    location: "Europe",
    coordinates: [51.1657, 10.4515],
    detailPage: "/data/ndvi-europe-1982-2022",
    downloadEnabled: false,
    download: publicAsset('files/Portfolio_V3.pdf'),
    github: "https://github.com/karel94/GIS-with-R./blob/ac7f7cc1101113cb2ffefa56e8b713b265045f4f/Trend%20analysis%20of%20NDVI%20in%20Europe",
    contextAndIntroduction: `<p>Vegetation dynamics are a key indicator of ecosystem functioning and land-use change. In Europe,
     long-term trends in vegetation productivity reflect the combined influence of climate variability, land-use change, agricultural intensification, and environmental management policies.
     Understanding these dynamics is essential for assessing ecosystem resilience, food security, and sustainable land management. </p>
     <p>This study analyzes multi-decadal vegetation trends across Europe (1982–2022) using long-term NDVI time series derived from satellite observations.
     By applying a syndrome-based approach, the analysis goes beyond simple trend detection to characterize distinct spatial patterns of vegetation change, including greening,
     browning, productivity shifts, and changes in seasonal dynamics.</p>
     <p>The study aims to provide a spatially explicit understanding of vegetation change processes, supporting land-use planning, environmental monitoring, and policy-relevant assessments at continental scale.</p>`,
    
     
     methodology: `<p>The analysis is based on long-term satellite-derived NDVI (Normalized Difference Vegetation Index) time series covering Europe from 1982 to 2022. 
     NDVI is used as a proxy for vegetation productivity and ecosystem functioning, enabling the assessment of long-term vegetation dynamics at continental scale.
     To support the interpretation of vegetation trends, NDVI data were combined with land-cover information (e.g. CORINE Land Cover) to relate observed changes to 
     land-use types and land-use transitions. All datasets were harmonized in space and time to ensure consistency across the study period.  A multi-step analytical framework was applied to characterize vegetation dynamics:</p>

     <p><b>1. Time-series preprocessing </b></p>
     <p> NDVI time series were cleaned and aggregated to derive consistent annual and seasonal indicators of vegetation productivity.</p>
     <p><b>2. Trend analysis </b></p>
     <p>Long-term trends in NDVI were quantified using the Seasonal Mann–Kendall test, a non-parametric method suitable for detecting 
     monotonic trends in environmental time series while accounting for seasonal variability.</p>
     <p><b>3. Syndrome-based classification</b></p>
     <p>A syndrome approach was used to group areas with similar combinations of NDVI trends and seasonal behavior. This allowed the identification of distinct 
     vegetation change patterns such as greening, browning, increasing or decreasing productivity, and changes in seasonality.</p>
    
     <img src="${publicAsset('image/correlationLC.jpg')}" alt="correlation between NDVI and land-cover" /> 
     <p><b>4. Spatial analysis and mapping</b></p>
     <p>The resulting trend and syndrome classes were mapped and analyzed spatially to reveal regional patterns of vegetation change across Europe and their relationship with land-use characteristics.</p>
     <p>All analyses were conducted using R for time-series processing and statistical analysis, combined with GIS tools (QGIS) for spatial analysis and visualization.</p>`,
    
     keyFindings: `<p>
    The analysis of NDVI time series from 1982 to 2022 shows an overall greening trend across large parts of Europe, indicating 
    increasing vegetation productivity over time. However, this general pattern masks strong regional contrasts, with localized browning 
    or stagnation observed in specific areas, particularly in regions under intense land-use pressure or environmental stress.
    </p>
    <p>
    The predominant green colour across the map indicates positive tau values for most regions, suggesting an overall improvement in 
    vegetation health over the study period. This is consistent with the "greening trend" hypothesis, which states that areas experience an increase in
     vegetation cover and density. When considering specific regions, Southern, Central and Western Europe 
     show stronger positive tau values (darker green), indicating more significant improvements in vegetation health. Conversely, some regions, especially 
     in Norway, Ireland, Switzerland, and Eastern Europe, show areas with tau values close to zero or slightly negative (yellow to red), suggesting weaker 
     trends or potential deterioration of vegetation health.
    </p>
     <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
       <img src="${publicAsset('image/TAU_europe.jpg')}" alt="NDVI Mann-Kendall tau trends across Europe" style="flex: 1; max-width: 50%;" /> 
       <img src="${publicAsset('image/Pvalue_europe.jpg')}" alt="Statistical significance (p-values) of NDVI trends across Europe" style="flex: 1; max-width: 50%;" /> 
     </div>

     <p>
    Overall, we can confirm the "greening trend" in vegetation health across Europe over the last four decades, with some regional exceptions.
    The p-value map shows the statistical significance of the trends identified by the tau map. Areas with low p-values (shades of red/pink) 
    indicate statistically significant trends, whereas areas with high p-values (shades of green) indicate non-significant trends.
    The dark blue areas on the p-value map, corresponding to significant p-values, enhance the confidence of the positive trends observed on the tau map.
    </p>
    <p>
    The yellow areas indicate trends that are not statistically significant, suggesting that the observed changes in NDVI in these regions could be due to
    random variability rather than a consistent trend. These non-significant areas are scattered mainly across Eastern Europe, the British Isles, and 
    Northern countries.
    </p>
    <p>
    The "greening trend" hypothesis using the regression coefficient from the Seasonal Mann-Kendall test is confirmed over 40 years by the increase in NDVI from 0 to a maximum of 10% across Europe. 
    This observation indicates that the increase in NDVI between 1989 and 2022 was not very significant but confirms the hypothesis of a greening trend 
    across Europe. Nevertheless, some parts of Europe, especially the Northern part, show a negative change in NDVI between 0 and 10% loss. 
    </p>
    <img src="${publicAsset('image/changeNDVI.jpg')}" alt="Change in NDVI across Europe (1982–2022)" />
     <p>
     By applying a syndrome approach, the study distinguishes multiple vegetation change patterns beyond simple greening or browning. 
     These syndromes capture differences in productivity levels, seasonal dynamics, and trend direction, revealing spatially coherent regions with 
     similar vegetation behaviour. This classification highlights that areas with similar overall trends may still differ substantially in their 
     seasonality or productivity structure, emphasizing the importance of multi-dimensional analysis.
     </p>
     <img src="${publicAsset('image/syndromtype.jpg')}" alt="Syndrome types mapped across Europe" />

     <p>
     Visually, "Increasing biomass" and "Increasing productivity" are the most dominant syndromes, 
     indicating an increase in vegetation in many regions. Both dominant syndromes are relatively proportionally distributed across Europe, 
     with a predominance of increasing biomass in Sweden. 
     </p>
     <p>
     "Increasing biomass" is the most dominant syndrome, representing 52% of NDVI trend between 1982 and 2022, indicating increased biomass 
     in many regions. "Increasing productivity" represented 21.74% of NDVI trend between 1982 and 2022, showing increased productivity in 
     agricultural areas. Further, "No change" and "Changing crop" are slightly less frequent syndromes representing respectively 13.67% and 7.06% of 
     NDVI trend between 1982 and 2022. Thus, a significant number of areas, notably the UK, Norway, Lithuania, Bosnia and Herzegovina, and Italy, show no 
     significant change. "Decreasing biomass", "Decreasing productivity", "Increasing irrigation", and "Decreasing irrigation" are the rarest syndromes, 
     representing less than 2% of NDVI trend between 1982 and 2022, implying localized occurrences of these phenomena.
     </p>
     <img src="${publicAsset('image/sydromproportionin NDVI.jpg')}" alt="Proportional distribution of NDVI syndromes across Europe" />`,
    conclusion: `<p>
     This study reveals a predominant greening trend across Europe from 1982 to 2022, with increasing vegetation productivity, particularly during summer
     months. However, vegetation dynamics show strong spatial and temporal variability, with recent negative or weakened trends in some regions likely 
    linked to land-use change, urban expansion, and climate pressures.
     </p>
     <p>
     Agricultural areas are the main contributors to greening, followed by forests and semi-natural ecosystems, highlighting the role of land management 
     practices in shaping vegetation dynamics. While most regions show increasing biomass and productivity, localized declines indicate ongoing challenges 
     related to land degradation and land conversion. Overall, the results demonstrate the value of long-term Earth observation and syndrome-based analysis 
     for understanding vegetation change and supporting sustainable land-use and environmental decision-making.
     </p>`
  },

  // Cartographie et analyse du dépérissement du massif forestier de Fontainebleau
  {
    id: 2,
    title: "Cartographie et analyse du dépérissement du massif forestier de Fontainebleau",
    category: "Remote Sensing",
    description: "Analyse spatio-temporelle du dépérissement forestier à l’aide d’images Sentinel-2 et de données environnementales entre 2016 et 2022",
    tools: ["ArcGIS Desktop", "QGIS", "RStudio"],
    image: publicAsset('image/poster.jpeg'),
    location: "Fontainebleau, France",
    coordinates: [48.4123, 2.7011],
    detailPage: "/data/analyse-du-deperissement-au-sein-du-massif-forestier-de-fontainebleau-mff",
    downloadEnabled: false,
    download: "projectdoc/Mapping dieback in Fontainebleau forest.pdf",
  
    contextAndIntroduction: `<p>Le massif forestier de Fontainebleau, qui s’étend sur environ 23 700 hectares en Île-de-France, constitue un écosystème forestier d’importance écologique, paysagère et patrimoniale majeure. Depuis plusieurs années, ce massif est confronté à une intensification du dépérissement forestier, phénomène caractérisé par une dégradation progressive de l’état sanitaire des arbres pouvant conduire à leur mortalité.</p>
    <p>Les épisodes répétés de sécheresse, l’augmentation des températures et la faible capacité de rétention en eau des sols sableux du massif accentuent cette dynamique. Dans ce contexte, l’Office National des Forêts (ONF) a initié cette étude afin de produire une cartographie précise des zones en dépérissement, d’identifier les facteurs explicatifs et d’anticiper l’évolution future du phénomène.</p>
    <p>L’objectif principal du projet est donc de caractériser spatialement le dépérissement du massif forestier de Fontainebleau à partir de données satellitaires et d’analyses statistiques, dans une perspective d’aide à la gestion forestière.</p>`,
  
    methodology: `<p>L’étude repose sur une approche intégrée combinant télédétection et systèmes d’information géographique (SIG). Des images satellites Sentinel-2 acquises entre 2016 et 2022 ont été utilisées afin d’analyser l’évolution du couvert forestier. Après prétraitement (corrections radiométriques et atmosphériques), une classification supervisée par maximum de vraisemblance a été réalisée sous ArcGIS-Pro afin de distinguer différentes classes d’occupation du forèstiere (feuillus sains, feuillus dégradés, résineux sains, résineux dégradés et espaces ouverts).</p>
    <p>Les différentes classifications ont été évaluées à l'aide d'une matrice de confusion et validées à l'aide du coefficient Kappa de Cohen:</p>
    
    <img src="${publicAsset('image/sentinel-02.jpg')}" alt="Bandes spectrales Sentinel-2" />
  
    <p>L’identification du dépérissement s’est appuyée sur une analyse diachronique et une détection de changements entre 2016 et 2022. L’indice de végétation NDVI a été calculé afin d’évaluer l’activité photosynthétique, tandis que l’indice NDMI a permis d’estimer le stress hydrique des peuplements forestiers.</p>
  
    <p>Les zones de dégradation ont été isolées après exclusion des surfaces affectées par les incendies et des parcelles en régénération, afin de ne conserver que les zones réellement associées au dépérissement. Par la suite, des analyses statistiques (corrélation de Pearson et ANOVA) ont été réalisées pour évaluer l’influence de variables environnementales telles que le type de sol, la température, le stress hydrique et l’exposition au soleil.</p>
  
    <p>Enfin, un modèle prédictif exploratoire a été développé sous QGIS à l’aide du plugin MOLUSCE. Basé sur un réseau neuronal artificiel, ce modèle a permis de simuler l’évolution potentielle du dépérissement à l’horizon 2028 en intégrant les variables biophysiques significatives.</p>
  
    <img src="${publicAsset('image/molusce.jpg')}" alt="Modélisation MOLUSCE" />`,
  
    keyFindings: `<ul>
    <p>Les résultats montrent une augmentation significative de la dégradation du massif forestier de Fontainebleau entre 2016 et 2022. Cette dégradation a progressé de <strong>20,2%</strong>, affectant à la fois les peuplements feuillus et résineux. Le dépérissement représente à lui seul <strong>81,3% de cette dégradation</strong>, soit environ <strong>16,4% de la superficie totale du massif</strong>.</p>
  
    <img src="${publicAsset('image/Fontaine_change.jpg')}" alt="Cartographie du dépérissement" />
    
    <p>L’analyse spatiale met en évidence une distribution hétérogène du dépérissement, fortement liée aux caractéristiques environnementales. Les zones les plus affectées correspondent majoritairement à des secteurs présentant une faible réserve utile en eau et une forte contrainte hydrique.</p>
  
    <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
      <img src="${publicAsset('image/NDVI_change.jpg')}" alt="NDVI évolution" style="flex: 1; max-width: 50%;" />
      <img src="${publicAsset('image/Fontainebleau stressHyd.jpg')}" alt="NDMI stress hydrique" style="flex: 1; max-width: 50%;" />
    </div>
  
    <p>Les analyses statistiques confirment que le dépérissement est fortement corrélé à plusieurs facteurs : le type de sol (notamment les sols sableux), le stress hydrique et la température. Ces résultats soulignent le rôle majeur du changement climatique dans la dynamique observée.</p>
  
    <p>La modélisation prospective réalisée avec MOLUSCE indique une tendance à l’aggravation du phénomène, avec une augmentation estimée de <strong>59,1% des surfaces en dépérissement à l’horizon 2028</strong>. Bien que ce modèle reste exploratoire, il met en évidence la nécessité d’une gestion forestière proactive.</p>
  
    <img src="${publicAsset('image/deperissement_predit.jpg')}" alt="Projection du dépérissement" />
  
    </ul>`,
  
    conclusion: `<p>Cette étude démontre la pertinence de la télédétection et des SIG pour le suivi et la compréhension du dépérissement forestier à grande échelle. Elle met en évidence une progression rapide du phénomène dans le massif de Fontainebleau, fortement liée aux conditions climatiques et hydriques.</p>
  
    <p>Malgré certaines limites (résolution spatiale, données de gestion incomplètes, modèle prédictif exploratoire), les résultats fournissent une base scientifique solide pour appuyer les décisions de gestion forestière. Ils permettent notamment d’identifier les zones prioritaires d’intervention et d’anticiper les impacts futurs du changement climatique.</p>
  
    <p>Ce projet illustre l’apport des approches spatiales dans la gestion durable des écosystèmes forestiers et constitue un outil d’aide à la décision pour les gestionnaires.</p>`
  },

  // Monitoring Forest Disturbance and Bark Beetle Impact in Hunsrück-Hochwald National Park
  {
    id: 3,
    title: "Monitoring Forest Disturbance and Bark Beetle Impact in Hunsrück-Hochwald National Park",
    category: "Remote Sensing",
    description: "Integrated remote sensing and field-based assessment of bark beetle-driven forest disturbance in Hunsrück-Hochwald National Park using Sentinel-2 imagery, machine learning, and ecological surveys",
    tools: ["SNAP","ArcGIS Pro"],
    image: publicAsset('image/Hunsruck/poster.jpg'),
    location: "Hunsrück-Hochwald National Park, Germany",
    coordinates: [49.7, 7.1],
    detailPage: "/data/forest-disturbance-monitoring-hunsruck-hochwald-national-park",
    downloadEnabled: false,
    download: "projectdoc/FRS_portfolio_s6kanimp_1734880_s6pachri_1506810.pdf",
  
    contextAndIntroduction: `<p>Forests are essential for biodiversity conservation, climate regulation, and the delivery of ecosystem services across Central Europe. However, conifer-dominated forests are increasingly threatened by climate-induced stress and bark beetle outbreaks. In particular, the European spruce bark beetle has become one of the major disturbance agents affecting Norway spruce stands, often triggering rapid canopy decline, red needle discoloration, and tree mortality.</p>
  
    <p>The Hunsrück-Hochwald National Park (HHNP), located in southwestern Germany, provides a relevant case study for investigating these dynamics. The park covers approximately 102 km² and is heavily forested, with a substantial proportion of conifer stands resulting from historical land use and forestry (plantation). Recent drought conditions and rising temperatures have increased the vulnerability of these forests, thereby amplifying bark beetle infestations and associated forest decline.</p>
    
    <img src="${publicAsset('image/Hunsruck/Overview.jpg')}" alt="Hunsrück-Hochwald National Park overview" /> 

    <p>This project aimed to analyse how bark beetle disturbance affects the forest ecosystem of HHNP by combining remote sensing and field observations. The study had three main objectives: first, to map forest and non-forest areas as a basis for disturbance analysis; second, to classify forest types in order to isolate coniferous stands; and third, to detect forest loss and assess the health status of coniferous trees through field surveys. The overall goal was to provide a spatially explicit and ecologically grounded assessment of disturbance patterns within the national park.</p>`,
  
    methodology: `<p>This study combines multi-temporal remote sensing, supervised and unsupervised classification, change detection, and field-based ecological observations in order to assess bark beetle-related forest disturbance in HHNP.</p>
  
    <p><strong>1. Forest / non-forest mapping.</strong></p> 
    <p>The workflow started with the OpenStreetMap forest layer, which was used as a preliminary region-of-interest mask. Fourteen Sentinel-2 scenes were stacked into a multi-band dataset. To reduce dimensionality and retain the dominant spectral information, a Principal Component Analysis (PCA) was applied using the Green, NIR and SWIR bands. From the resulting 42 principal components, 10 were retained, representing about 90% of the explained variance. Because the first principal component was dominated by cloud-related information, it was excluded from the classification process. An unsupervised K-means classification was then performed on PC2 to PC10, and the resulting clusters were grouped into two thematic classes: forest and non-forest.</p>
  
  
    <p><strong>2. Forest type classification.</strong></p>
    <p>To distinguish deciduous from coniferous stands, the forest mask was combined with the non-forest output from the K-means step. Around 2000 random points were generated and visually interpreted, of which 1195 were retained as reliable reference samples. These samples were split into 75% training data (896 points) and 25% validation data (299 points). A Random Forest classifier with 50 trees was then applied to a Sentinel-2 April scene in two configurations: (i) using all 10 Sentinel-2 bands, and (ii) using all 10 Sentinel-2 bands together with a 30 m Copernicus DEM. The April scene was intentionally selected because deciduous stands are still partially leafless during this period, whereas most coniferous stands remain evergreen, improving spectral separability between the two forest types.</p>
  
  
    <p><strong>3. Disturbance mapping in coniferous forest.</strong></p>
    <p>Since bark beetle impacts primarily concern coniferous stands, the forest type map was reclassified to produce a conifer mask. NDVI and PVI were calculated from Sentinel-2 scenes acquired on 13/06/2023 and 25/06/2024, corresponding to peak seasonal reflectance for conifers. A proportional difference was calculated for each index between 2023 and 2024, and the resulting change layers were standardized by z-transformation. These standardized values were then reclassified into five disturbance categories: regrowth, slight regrowth, no change, slight loss, and loss. A post-processing sequence was applied to improve the cartographic output, including removal of roads with a 10 m buffer, boundary cleaning, and size-based clumping of patches.</p>
  
  
    <p><strong>4. Field survey design and health assessment.</strong></p>
    <p>To support ecological interpretation, a field survey was conducted using a 30 m grid aligned with Landsat resolution. Non-conifer-dominated areas were excluded beforehand. Survey areas of 1 × 1 km² were selected to ensure that all three national park management zones (zone 1a, zone 1b, and zone 2) were represented while also maintaining accessibility from parking areas. Within each area, approximately 30 points per zone were randomly selected, with a minimum distance of 90 m between points to reduce spatial autocorrelation. At each selected point, a circular plot with a diameter of 20 m was surveyed. Data recorded in the field included dominant species, forest type, canopy cover, and visible signs of decline such as red needles, bark loss, and green needles on the ground.</p>
  
    <p><strong>5. Validation workflow.</strong></p>
    <p>Validation was conducted in several steps and forms a central part of the analytical framework. First, the forest / non-forest map was evaluated using an <strong>area-adjusted confusion matrix</strong> following Olofsson et al. (2013), allowing the calculation of producer’s accuracy, user’s accuracy, and overall accuracy while accounting for class proportions and uncertainty. Second, the forest type maps of case 1 and case 2 were validated with the independent subset of visually interpreted points. Because NULL values had to be removed after extraction, the final validation was based on 203 points. Again, <strong>area-adjusted confusion matrices</strong> were used to estimate class-specific accuracies and uncertainty margins for deciduous and coniferous classes. Third, adjusted area estimates were derived from class proportions and standard errors to quantify mapped surfaces with 95% confidence intervals.</p>
  
    <p><strong>6. Statistical validation of field observations.</strong></p>
    <p>For the field data, the relationship between conifer health categories and national park management zones was assessed using a <strong>pairwise two-sided Fisher’s exact test</strong>. This test was selected instead of a Chi-square test because of the small number of observations in some categories, particularly in the severe damage class, where expected frequencies were too low for reliable Chi-square inference.</p>
  
    <p><strong>7. Methodological comparison of NDVI and PVI.</strong></p>
    <p>A sensitivity analysis was also carried out by comparing NDVI and PVI values for multiple forest types using a scatterplot. This step was used to evaluate which index was more suitable for detecting conifer disturbance under dense canopy conditions, where NDVI saturation can reduce sensitivity.</p>`,
  
    keyFindings: `<ul>
  
    <p><strong>1. Forest dominance and baseline mapping.</strong></p>
    <p>The forest / non-forest classification confirmed that HHNP is strongly dominated by forest cover. Area-adjusted estimates indicate that forest represents <strong>87.49%</strong> of the classified area, corresponding to an adjusted area of <strong>245.37 ± 9.76 km²</strong>, whereas non-forest represents <strong>12.51%</strong>, corresponding to <strong>35.08 ± 9.76 km²</strong></p>
  
    <p><strong>2. Validation of the forest / non-forest map.</strong></p>
    <p>The area-adjusted confusion matrix yielded an overall accuracy of <strong>85.60 ± 1.78%</strong>. The forest class showed strong accuracy values, with a producer’s accuracy of <strong>87.37 ± 1.38%</strong> and a user’s accuracy of <strong>95.81 ± 1.40%</strong>. In contrast, the non-forest class performed less well, with a producer’s accuracy of <strong>73.26 ± 7.20%</strong> and a user’s accuracy of <strong>45.33 ± 6.80%</strong>, indicating overestimation and higher uncertainty in this class.</p>
  
    <img src="${publicAsset('image/Hunsruck/forest_non_forest.jpg')}" alt="Forest / Non-Forest map for HHNP" />
  
    <p><strong>3. Forest type classification and validation</strong></p>
    <p>The Random Forest models successfully separated deciduous and coniferous forests, with improved performance when topographic information was added. Case 1 (spectral bands only) achieved an overall accuracy of <strong>81.31 ± 2.73%</strong>, while case 2 (spectral bands + DEM) reached <strong>84.34 ± 2.52%</strong>. In both cases, the deciduous class performed better than the coniferous class, but the inclusion of DEM improved the producer’s accuracy of conifers from <strong>63.23 ± 4.84%</strong> to <strong>69.49 ± 5.16%</strong>.</p>
  
    <p>Adjusted area estimates further show that case 2 produced a slightly lower but more reliable conifer area estimate: <strong>66.05 ± 22.20 km²</strong>, compared with <strong>71.51 ± 23.99 km²</strong> in case 1. This suggests that topographic information improved the ecological realism of the forest type classification.</p>
  
    <img src="${publicAsset('image/Hunsruck/Forest_type.jpg')}" alt="Forest type maps for HHNP, case 1 and case 2" />
  
    <p><strong>4. NDVI vs PVI sensitivity</strong></p>
    <p>The comparison of vegetation indices revealed that NDVI suffers from saturation around values of approximately 0.7, especially in deciduous forests under dense canopy conditions. By contrast, PVI remained responsive across the observed range and did not show a pseudo-plateau. This indicates that PVI is more sensitive than NDVI for detecting subtle vegetation changes in dense forest systems.</p>
  
    <img src="${publicAsset('image/Hunsruck/NDVI_PVI_sensitivity.jpg')}" alt="Scatterplot comparing NDVI and PVI sensitivity" />
  
    <p><strong>5. Spatial pattern of forest disturbance</strong></p>
    <p>The disturbance maps revealed canopy loss primarily in the <strong>southwestern and northeastern sectors</strong> of the park. Across both products, the “no change” class dominated, but the PVI-based map displayed more areas classified as “slight loss” than the NDVI-based map. Close-up visual comparison with Sentinel-2 true-colour composites confirmed that both products detected disturbance reasonably well, although some visually identifiable conifer stands were not fully captured due to classification uncertainties in the upstream conifer mask.</p>
  
    <img src="${publicAsset('image/Hunsruck/Forest_loss.jpg')}" alt="Forest loss based on NDVI / PVI" />
    
  
    <p><strong>6. Field-based health assessment</strong></p>
    <p>A total of <strong>196 survey points</strong> were collected, including <strong>140 conifer observations</strong>. Among these conifer points, <strong>56</strong> were classified as dead standing trees, <strong>33</strong> as healthy, <strong>38</strong> as moderately damaged, and <strong>13</strong> as severely damaged. These observations indicate that dead and damaged conifers dominate the sampled areas, reflecting strong ecological impacts of bark beetle infestation.</p>
  
    <img src="${publicAsset('image/Hunsruck/Forest_health.jpg')}" alt="Health status of conifer survey plots in HHNP" />
  
    <p><strong>7. Management zone comparison</strong></p> 
    <p>The sampled conifer points were distributed across the three park zones, with 35 points in zone 1a, 42 in zone 1b, and 61 in zone 2. Although dead standing trees represented around 45% of the observations in zones 1a and 2, the pairwise two-sided Fisher’s exact tests returned only non-significant p-values. Therefore, the null hypothesis of no relationship between conifer health status and park management zone could not be rejected.</p>
  
    <p><strong>8. Integrated interpretation</strong></p>
    <p>Taken together, the remote sensing outputs and the field observations indicate that bark beetle disturbance is producing substantial conifer decline in HHNP. The stronger response of PVI, the concentration of mortality and damage in field plots, and the spatial pattern of canopy loss all support the interpretation of an ongoing, climate-amplified disturbance process affecting mature spruce stands across the national park.</p>
  
    </ul>`,
  
    conclusion: `<p>This project demonstrates the value of combining remote sensing, classification validation, and field ecology for analysing forest disturbance in protected areas. The results show that HHNP remains predominantly forested, but conifer stands are under substantial pressure from bark beetle outbreaks, as evidenced by canopy loss patterns and the high proportion of dead and damaged conifers in the field survey.</p>
  
    <p>A key methodological contribution of the study lies in its explicit validation framework. The use of area-adjusted confusion matrices and adjusted area estimates made it possible to evaluate classification accuracy while accounting for uncertainty, and the comparison of case 1 and case 2 demonstrated the added value of topographic information for forest type mapping. Likewise, the Fisher’s exact test provided a statistically appropriate way to assess management-zone effects under small sample conditions.</p>
  
    <p>The project also highlights the importance of index choice in disturbance monitoring. While NDVI remains useful, PVI proved more sensitive under dense canopy conditions and better captured subtle degradation signals. Despite limitations related to mixed pixels, imperfect conifer masks, and the absence of a dedicated validation dataset for the final forest loss maps, the study provides a robust basis for future monitoring work.</p>
  
    <p>Overall, this project offers a strong analytical foundation for long-term forest health assessment in HHNP and illustrates how remote sensing can be combined with targeted field surveys to better understand bark beetle-driven ecosystem change.</p>`
  },

  //PNMD
  {
    id: 4,
    title: "Analyse des impacts des activités anthropiques sur le couvert forestier et la faune du Parc National du Mbam et Djerem",
    category: "Remote Sensing",
    description: "Analyse spatio-temporelle des dynamiques du couvert forestier et des pressions anthropiques dans une aire protégée d’Afrique centrale à l’aide d’images Landsat, Sentinel-2 et d’enquêtes de terrain",
    tools: ["ArcGIS desktop", "MS Excel"],
    image: publicAsset('image/PNMD/poster.jpg'),
    location: "Parc National du Mbam et Djerem, Cameroun",
    coordinates: [5.96, 12.88],
    detailPage: "/data/impact-activites-anthropiques-pnmd",
    downloadEnabled: false,
    download: "projectdoc/PNMD_project.pdf",
  
    contextAndIntroduction: `<p>Le Parc National du Mbam et Djerem (PNMD), situé au centre du Cameroun, constitue une zone de transition écologique majeure entre les savanes soudaniennes et les forêts tropicales humides. Cette position confère au parc une richesse biologique exceptionnelle, mais également une forte vulnérabilité face aux pressions anthropiques croissantes.</p>
  
    <img src="${publicAsset('image/PNMD/Location_PNMD.jpg')}" alt="Localisation du Parc National du Mbam et Djerem" />
  
    <p>Depuis plusieurs décennies, les activités humaines telles que l’agriculture, la chasse, la pêche, la transhumance et l’exploitation du bois se sont intensifiées dans et autour du parc, modifiant profondément les structures paysagères et les dynamiques écologiques.</p>
  
    <p>Dans ce contexte, l’objectif de cette étude est d’analyser les changements du couvert forestier entre 2000 et 2020 et d’évaluer l’impact des activités anthropiques sur la faune et les habitats. L’approche adoptée repose sur une intégration des données de télédétection, des analyses SIG et des enquêtes de terrain, afin de produire une évaluation spatialement explicite et écologiquement pertinente des transformations du territoire.</p>`,
  
    methodology: `<p>L’étude repose sur une approche multi-source combinant données satellitaires, analyses statistiques et observations de terrain.</p>
  
    <p><strong>1. Traitement et analyser de données</strong></p>
    <p>Des images Landsat (2000, 2010, 2020) et Sentinel-2 (2018, 2020) ont été utilisées afin de caractériser l’évolution du couvert forestier sur deux échelles temporelles (long terme et court terme). Les images ont été prétraitées (corrections radiométriques et atmosphériques) afin d’assurer leur comparabilité.</p>
  
    <p>Une classification supervisée a été réalisée sous SIG afin de discriminer les principales classes d’occupation du sol (forêt dense, forêt dégradée, savane, zones agricoles, zones anthropisées). Les signatures spectrales ont été définies à partir d’échantillons d’apprentissage représentatifs.</p>
  
    <p>La qualité des classifications a été évaluée à l’aide de matrices de confusion et du coefficient Kappa. Les résultats montrent des valeurs comprises entre 0,68 et 0,83, indiquant une précision satisfaisante à élevée selon les dates. Cette étape garantit la robustesse des cartes utilisées pour l’analyse diachronique.</p>
  
  
    <p><strong>2. Analyse de l'occupation du sol.</strong></p>
    <p>Les changements d’occupation du sol ont été quantifiés sur la période 2000–2020, permettant d’identifier les transitions entre classes (forêt dense → forêt dégradée, forêt → agriculture, etc.). Les taux d’évolution ont été calculés afin de mesurer les dynamiques de transformation du paysage.</p>
  
    <p>Des enquêtes de terrain ont été menées auprès des populations locales selon un plan de sondage (proximite au parc) afin d’identifier les activités anthropiques dominantes et leur perception des changements environnementaux. Ces données ont permis de relier les observations satellitaires aux pratiques humaines.</p>
  
    <img src="${publicAsset('image/PNMD/survey.jpg')}" alt="Enquêtes de terrain auprès des populations locales" />

    <p><strong>3. Analyse de la faune</strong></p>
    <p>L’étude a également intégré des observations qualitatives sur la faune au moyen d'un Inventaire Faunique par transects. Il a notamment été question d'identifier les signes de presence de la faune (traces de pas, déjections, etc.) sur des transects predefinis, des signes de disparition de la faune, la modification des habitats et des corridors écologiques, afin d’évaluer les conséquences indirectes des changements du couvert forestier sur la faune. Cette analyse a été suivant le calcul d'indice kilometrique d'abondance de la faune (IKA).</p>
    <p>C'est une méthode permettant de mesurer une abondance relative des espèces le long d’une distance parcourue. Elle a été développée en 1958 par Ferry et Frochot et permet dans un milieu homogène, d’obtenir l’abondance par kilomètre pour chacune des espèces rencontrées.</p>
    <img src="${publicAsset('image/PNMD/IKA.jpg')}" alt="Cartographie des indices de Kolmogorov-Arnold (IKA)" />
    <p>Les résultats de l'IKA ont été analysés pour identifier les espèces les plus affectées par les changements du couvert forestier. Les espèces les plus fréquentes ont été identifiées et les changements d'abondance ont été quantifiés grace au cartes d'interpolation des IKA.</p>`,
  
    
    keyFindings: `<ul>
  
    <p><strong>1. Dynamique globale du couvert forestier.</strong></p>
    <p>Les résultats montrent une augmentation globale du couvert forestier d’environ <strong>12%</strong> entre 2000 et 2020. Toutefois, cette évolution masque une transformation structurelle importante du paysage.</p>
  
    <img src="${publicAsset('image/PNMD/pnmd_change_map.jpg')}" alt="Carte des changements du couvert forestier" />
  
    <p>Malgré l’augmentation globale, les forêts denses ont diminué à un rythme moyen de <strong> 0,36% par an</strong>, au profit de formations forestières dégradées et de zones ouvertes. Cette tendance traduit une dégradation qualitative plutôt qu’une déforestation nette.</p>
    <img src="${publicAsset('image/PNMD/change_stat.jpg')}" alt="Statistiques des changements du couvert forestier" />

    <p>Les pertes forestières sont spatialement concentrées, notamment dans la périphérie est du parc, où l’expansion agricole est la plus marquée.</p>
  
    <img src="${publicAsset('image/PNMD/change_detect.jpg')}" alt="Détection des changements du couvert forestier" />
    
  
    <p><strong>2. Identification des facteurs anthropiques.</strong></p>
    <p>Les enquêtes socio-économiques révèlent que <strong>54 % des populations interrogées</strong> identifient l’expansion agricole comme le principal moteur de la déforestation dans la périphérie du Parc National du Mbam et Djerem. D’autres activités anthropiques contribuent également de manière significative à la pression sur les écosystèmes, notamment la chasse, la pêche, la transhumance et l’exploitation du bois.</p>

    <p>Les modifications du couvert forestier observées à partir des analyses spatiales se traduisent par une <strong>fragmentation accrue des habitats</strong>, entraînant une reconfiguration des aires de distribution de la faune et une augmentation des pressions sur certaines espèces. Ces dynamiques favorisent une perturbation des corridors écologiques et peuvent compromettre la viabilité à long terme des populations animales.</p>

    <img src="${publicAsset('image/PNMD/chasse.jpg')}" alt="Espèces chassées dans le PNMD" />

    <p>Les données issues des enquêtes indiquent que les espèces les plus recherchées par les chasseurs sont principalement des ongulés et des espèces de taille moyenne à grande. Le sanglier et le potamochère sont chassés par <strong>52 % des chasseurs interrogés</strong>, suivis du hérisson (<strong>48 %</strong>) et du léopard (<strong>47 %</strong>). Par ailleurs, les registres de chasse mettent en évidence la pression exercée sur plusieurs espèces protégées, notamment le pangolin (<strong>28 %</strong> des chasseurs), les céphalophes à dos jaune (<strong>13 %</strong>), les bongos (<strong>3 %</strong>), les chimpanzés (<strong>2 %</strong>) et les buffles (<strong>1 %</strong>). Ces résultats témoignent d’une exploitation faunique étendue, incluant des espèces à forte valeur de conservation.</p>

    <img src="${publicAsset('image/PNMD/IKA_analyse.jpg')}" alt="Analyse des indices de Kolmogorov-Arnold (IKA)" />

    <p>L’analyse des indices kilométriques d’abondance (IKA) le long des transects montre que les traces de <strong>bushbuck</strong> sont les plus fréquentes, avec un IKA de <strong>1 ± 0,99</strong>, suivies par celles du céphalophe à rayures noires (<strong>0,917 ± 1,02</strong>). À l’inverse, plusieurs espèces présentent de faibles niveaux de détection, notamment le sitatunga, le céphalophe des buissons, le céphalophe bleu, le sanglier, le potamochère et le céphalophe à dos jaune, avec des valeurs d’IKA de <strong>0,083 ± 0,21</strong>. Ces résultats suggèrent soit une faible densité de ces espèces, soit une pression anthropique élevée limitant leur présence observable.</p>

    <img src="${publicAsset('image/PNMD/interpolation.jpg')}" alt="Interpolation spatiale des indices de chasse" />

    <p>L’analyse spatiale des observations indique que les espèces chassées et recensées le long des transects (sangliers, potamochères, céphalophes et autres espèces forestières) se concentrent principalement dans la <strong>partie orientale du parc et sa périphérie</strong>. En revanche, les indices de présence humaine et les zones de dégradation sont majoritairement localisés dans la <strong>périphérie occidentale</strong>. Cette distribution spatiale suggère un phénomène de déplacement de la faune vers des zones moins perturbées, probablement en réponse à une pression anthropique plus intense à l’ouest du parc.</p>
        
    </ul>`,
  
    conclusion: `<p>Cette étude met en évidence la complexité des dynamiques paysagères dans une aire protégée soumise à de fortes pressions anthropiques. Bien que le couvert forestier global semble en augmentation, cette tendance masque une dégradation progressive des forêts denses, traduisant une perte de qualité écologique.</p>
  
    <p>La combinaison de la télédétection et des enquêtes de terrain constitue une approche robuste pour analyser ces dynamiques et en comprendre les causes. La validation des classifications par coefficient Kappa renforce la fiabilité des résultats obtenus.</p>
  
    <p>Les résultats soulignent la nécessité de mettre en place des stratégies de gestion intégrée, prenant en compte à la fois la conservation des écosystèmes et les besoins des populations locales. Une meilleure régulation des activités agricoles et pastorales apparaît essentielle pour limiter la fragmentation des habitats et préserver la biodiversité du parc.</p>
  
    <p>Ce projet illustre l’intérêt des approches géospatiales pour l’analyse des interactions entre sociétés humaines et écosystèmes dans les régions tropicales.</p>`
  },
  // Wild Boars Vs. Vineyards conflict
  {
    id: 5,
    title: "Spatial Analysis of Potential Conflict Between Vineyards and Wild Boars in the Ruwer Valley",
    category: "GIS",
    description: "Spatio-environmental modeling of vineyard suitability and wild boar damage risk using cost distance analysis and GIS-based simulation",
    tools: ["ArcGIS Pro"],
    image: publicAsset('image/wildboars/poster.jpg'),
    location: "Ruwer Valley, Germany",
    coordinates: [49.75, 6.75],
    detailPage: "/data/conflict-vineyards-wildboars-ruwer",
    downloadEnabled: false,
    download: "projectdoc/ruwer_wildboar.pdf",
  
    contextAndIntroduction: `<p>In a global context of habitat fragmentation and increasing agricultural pressure, human–wildlife conflicts have become a major challenge for landscape management. In Europe, wild boar (<i>Sus scrofa</i>) populations have significantly increased over the past decades, leading to intensified damage to agricultural systems, particularly vineyards.</p>
  
    <p>The Ruwer Valley, located in Rhineland-Palatinate (Germany), represents a typical socio-ecological system where vineyards, forests, and urban areas coexist. This spatial configuration promotes strong interactions between natural habitats and cultivated land, making vineyards especially vulnerable to wild boar incursions.</p>
  
    <img src="${publicAsset('image/wildboars/Overview.jpg')}" alt="Study area location (Figure 1)" />
  
    <p>The objective of this study is twofold: (1) to identify environmentally suitable areas for vineyard establishment, and (2) to assess the spatial risk of wild boar damage using a GIS-based cost distance modeling approach. The underlying hypothesis is that certain vineyard areas may be abandoned due to increased pressure from wildlife.</p>`,
  
    methodology: `<p>The methodology is based on an integrated GIS framework combining multi-criteria analysis, spatial simulation, and ecological connectivity modeling.</p>
  
    <p><strong>1. Vineyard suitability modeling.</strong></p>
    <p>A suitability model was developed using a Digital Elevation Model (25 m resolution) to derive key topographic variables: slope, aspect, and elevation. Suitable areas were defined based on the following thresholds: slope between 10% and 25%, south-east to south-west orientation, and elevation below 260 m.</p>
  
    <img src="${publicAsset('image/wildboars/solar.jpg')}" alt="solar radiation analysis" />
    <p>Additionally, a solar radiation analysis (direct and diffuse) was performed for the growing season (March–October). Areas receiving between 1800 and 2000 hours of sunlight were considered optimal for vineyard development.</p>
  
    <img src="${publicAsset('image/wildboars/vineyard_model.jpg')}" alt="Vineyard suitability model (Figure 2)" />
  
    <p>Forest habitats were extracted from the Corine Land Cover dataset and transformed into core forest areas using a negative buffer. The number of wild boars was estimated using a density of 0.05 individuals per hectare, and spatially simulated using random point generation to represent initial animal locations.</p>
  
    <img src="${publicAsset('image/wildboars/boar_model.jpg')}" alt="Virtual boar model (Figure 3)" />
  
    <p><strong>2. Cost surface construction and analysis .</strong></p>
    <p>A friction (cost) surface was created by combining three main variables: land cover (weight = 0.6), slope (0.25), and road network (0.15). Each variable was reclassified on a scale from 1 (low resistance) to 5 (high resistance), reflecting the likelihood of wild boar movement across different landscape features.</p>
  
    <img src="${publicAsset('image/wildboars/cost_surface.jpg')}" alt="Cost surface (Figure 8)" />
  
    <p>The <i>cost distance</i> tool was applied to model optimal movement paths of wild boars toward vineyards. Vineyards were used as destination sources, ensuring that each simulated animal was connected to the nearest accessible vineyard via least-cost paths.</p>
  
    <p>Vineyard polygons smaller than 0.5 ha were excluded to avoid biases related to non-representative spatial units, thereby improving the robustness of the analysis.</p>`,
  
    keyFindings: `<ul>
  
    <p><strong>1. Spatial distribution of suitable vineyards.</strong></p> 
    <p>Suitable vineyard areas are predominantly located in the northern part of the study area, particularly in low-altitude valley zones. In contrast, southern areas show limited suitability due to higher elevation and steeper slopes.</p>
  
    <img src="${publicAsset('image/wildboars/vineyards_map.jpg')}" alt="Vineyard distribution (Figure 5)" />
  
    <p>Most identified vineyards are relatively small (&lt; 2 ha), while only 15 parcels exceed 10 ha, with a maximum size of 30 ha. This fragmentation plays a key role in vulnerability to wildlife damage.</p>
 
    <p>Simulated wild boar populations are mainly concentrated in southern forested areas. Due to the scarcity of vineyards in this region, individuals tend to migrate toward central and northern vineyards, often over long distances.</p>
  
    <img src="${publicAsset('image/wildboars/boar_paths.jpg')}" alt="Wild boar movement paths (Figure 6)" />
  
    <p><strong>2. Identification of high-risk areas.</strong></p> 
    <p>Vineyards located in the central part of the study area exhibit the highest risk levels, as they represent convergence zones for multiple wild boar movement paths. This results in increased competition and pressure on these agricultural areas.</p>
  
    <p>Large vineyards located in the northern part of the study area are less affected, due to lower wild boar density and reduced proximity to forest habitats.</p> 
    <p>The results highlight the critical role of landscape structure in shaping wildlife movement patterns and associated damage risks. Forest proximity and spatial configuration strongly influence wild boar behavior.</p>
  
    </ul>`,
  
    conclusion: `<p>This study demonstrates the relevance of GIS-based approaches for analyzing human–wildlife conflicts in agricultural landscapes. The integration of vineyard suitability modeling and cost distance analysis provides a spatially explicit framework to identify high-risk areas and anticipate interactions between wild boars and vineyards.</p>
  
    <p>The results indicate that central vineyards are the most exposed to damage, while northern areas offer strong potential for vineyard development with reduced risk. However, several limitations remain, including the simplified representation of wild boar behavior, the absence of hunting pressure data, and the lack of detailed information on food availability.</p>
  
    <p>Future improvements could include the integration of additional variables such as soil properties, urban constraints, hunting zones, and more advanced behavioral models. Despite these limitations, this study provides a robust basis for spatial planning and sustainable management of human–wildlife interactions.</p>`
  },

  // Development of a Web GIS Platform for Forest Management (GeoForest Cameroon)
  {
    id: 6,
    title: "Development of a Web GIS Platform for Forest Management (GeoForest Cameroon)",
    category: "Web Mapping",
    description: "Design and implementation of an interactive Web GIS platform for visualization and management of forest areas in Cameroon using Leaflet, Turf.js, and GeoJSON",
    tools: ["JavaScript", "Leaflet.js", "Turf.js", "jQuery", "W3.CSS", "GeoJSON"],
    image: publicAsset('image/GeoForest/poster.jpg'),
    location: "Cameroon",
    coordinates: [3.8667, 11.5167],
    detailPage: "/data/web-gis-geoforest-cameroon",
    downloadEnabled: true,
    download: "projectdoc/Karel_Nimpa_1734880_Geospatial_Applications.pdf",
    video: publicAsset('image/GeoForest/Geoforest.mp4'),
  
    contextAndIntroduction: `<p>The rapid evolution of web technologies has significantly transformed the way geospatial data is accessed, analyzed, and shared. Traditional desktop GIS systems, while powerful, require installation and are limited in accessibility. In contrast, Web GIS enables real-time visualization and interaction with spatial data directly through web browsers, making geospatial information accessible to a wider audience.</p>
  
    <p>Web GIS integrates geographic information systems with web-based architectures, allowing users to visualize, query, and analyze spatial data without requiring specialized software :contentReference[oaicite:0]{index=0}. This paradigm shift has become essential for decision-making in environmental management and land-use planning.</p>
  
    <img src="${publicAsset('image/GeoForest/webgis_architecture2.jpg')}" alt="Web GIS architecture (client-server model)" />
  
    <p>In this context, the GeoForest Cameroon platform was developed as a Web GIS application designed to support forest management. The system enables visualization and exploration of different forest categories (protected areas, managed forests, hunting zones) and provides an interactive environment for accessing spatial information relevant to forest administration.</p>`,
  
    methodology: `<p>The development of the GeoForest platform follows a classical three-tier Web GIS architecture, integrating front-end, back-end logic, and geospatial data services.</p>
  
    <p><strong>1. Web GIS architecture.</strong></p>
    <p>The system is based on a client–server model where the client (browser) interacts with a web server and a cartographic server. The cartographic server processes spatial data and returns map outputs (WMS/WFS or GeoJSON), while the database stores geospatial information.</p>
  
    <img src="${publicAsset('image/GeoForest/webgis_architecture.jpg')}" alt="Web GIS architecture (client-server model)" />
  
    <p>The user interface was developed using HTML, CSS (W3.CSS), and JavaScript. JavaScript handles interactivity through DOM manipulation, event handling (click, hover), and dynamic content rendering. jQuery and AJAX were used to load spatial data asynchronously without reloading the page.</p>
  
    <img src="${publicAsset('image/GeoForest/frontend_structure.jpg')}" alt="Front-end structure (HTML, CSS, JS)" />
  
    <p> The interactive map was implemented using Leaflet.js, allowing visualization of multiple basemaps (OpenStreetMap, satellite, topographic). Turf.js was used for spatial operations such as masking selected regions and performing geometric processing.</p>
  
    <img src="${publicAsset('image/GeoForest/leaflet_map.jpg')}" alt="Interactive map interface" />
  
    <p>Spatial data were stored and managed using GeoJSON format, enabling efficient visualization and interaction in the browser. External GeoJSON files were dynamically loaded using AJAX requests.</p>
  
    <p><strong>2. Functional implementation.</strong></p>
    <p>Several key functionalities were implemented:</p>
    <ul>
      <li>Region selection via dropdown menu</li>
      <li>Dynamic masking of non-selected areas</li>
      <li>Layer management panel for thematic data (protected areas, forest reserves, hunting zones)</li>
      <li>Interactive popups displaying attribute information</li>
      <li>Dynamic legend updating according to active layers</li>
    </ul>
  
    <img src="${publicAsset('image/GeoForest/layer_panel.jpg')}" alt="Layer management panel" />
  
    <p>The application integrates interactive components such as clickable features, automatic zooming to selected regions, and embedded forms (contact and help forms) to enhance usability.</p>`,
  
    keyFindings: `<ul>
  
    <p> The GeoForest system successfully demonstrates the implementation of a fully functional Web GIS platform capable of visualizing and managing forest data in real time.</p>
  
    <img src="${publicAsset('image/GeoForest/geoforest_interface.jpg')}" alt="GeoForest interface" />
  
    <p> The use of Leaflet and GeoJSON enables fast and efficient rendering of spatial layers, even with multiple thematic datasets.</p>
  
    <p> The integration of AJAX and JavaScript allows seamless interaction without page reload, significantly improving user experience. Users can dynamically switch layers, query features, and explore spatial data.</p>
  
    <img src="${publicAsset('image/GeoForest/popup_example.jpg')}" alt="Example of popup information" />
  
    <p> The masking functionality focuses the analysis on selected regions, improving readability and reducing visual complexity. The platform provides a clear overview of forest categories and their spatial distribution, supporting administrative decision-making processes.The modular architecture allows easy integration of additional datasets, functionalities, or analytical tools in future developments.</p>
  
    </ul>`,
  
    conclusion: `<p>This project demonstrates the potential of Web GIS technologies for developing interactive and accessible geospatial applications. By combining modern web development tools with GIS capabilities, the GeoForest platform provides an efficient solution for forest data visualization and management.</p>
  
    <p>The integration of client-side interactivity, dynamic data loading, and spatial analysis highlights the advantages of Web GIS over traditional desktop GIS systems, particularly in terms of accessibility and scalability.</p>
  
    <p>Future improvements could include the integration of a spatial database (PostgreSQL/PostGIS), user authentication systems, real-time data updates, and advanced analytical tools.</p>
  
    <p>This project illustrates the growing importance of web-based geospatial technologies in environmental management and decision-making.</p>`
  },

  // UAV Multispectral & Hyperspectral Analysis for 3D Terrain Modeling and Nitrogen Estimation in Precision Agriculture
  {
    id: 7,
    title: "UAV Multispectral & Hyperspectral Analysis for 3D Terrain Modeling and Nitrogen Estimation in Precision Agriculture",
    category: "Remote Sensing",
    description: "Advanced UAV-based workflow integrating photogrammetry and hyperspectral analysis to generate high-resolution terrain models and estimate crop nitrogen variability for precision fertilization",
    tools: ["Agisoft Metashape", "ENVI", "R", "QGIS"],
    image: publicAsset('image/UAV/poster.jpg'),
    location: "Ruwer Valley (Germany) & Experimental Potato Field",
    coordinates: [49.75, 6.64],
    detailPage: "/data/uav-precision-agriculture",
    downloadEnabled: false,
    download: "/docs/uav_full_report.pdf",
  
    contextAndIntroduction: `<p>This project presents a <strong>multi-scale UAV remote sensing workflow</strong> combining <strong>multispectral photogrammetry</strong> and <strong>hyperspectral analysis</strong> to support precision agriculture and environmental monitoring.</p>
  
    <p>Two complementary approaches were implemented:</p>
  
    <ul>
      <li><strong>3D photogrammetric reconstruction</strong> of vegetation and terrain using multispectral UAV imagery</li>
      <li><strong>Hyperspectral-based nitrogen estimation</strong> for potato crops using UAV and field spectrometer data</li>
    </ul>
  
    <p>This integration enables both <strong>structural analysis (3D morphology)</strong> and <strong>biochemical assessment (nitrogen content)</strong>, providing a comprehensive understanding of crop conditions.</p>
  
    <p>Nitrogen plays a critical role in crop growth, particularly for potatoes. However, its spatial variability is influenced by environmental conditions, soil properties, and crop growth stages. This project addresses these challenges by leveraging high-resolution UAV data and spectral modelling techniques.</p>`,
  
    methodology: `<h3><strong>1. Multispectral UAV Acquisition (Ruwer Valley)</strong></h3>
  
    <p>Data were acquired using a <strong>DJI Phantom 4 Multispectral (P4M)</strong> equipped with five spectral bands (Blue, Green, Red, Red Edge, NIR).</p>
  
    <ul>
      <li>Study area: 3329 m² (grassland with heterogeneous vegetation)</li>
      <li>Flight altitude: 34.3 m</li>
      <li>Total images: 1,370</li>
      <li>Ground Sampling Distance (GSD): ~2 cm</li>
    </ul>
  
    <p>This ultra-high resolution enabled detailed reconstruction of vegetation structure and terrain variability.</p>
  
    <h3><strong>2. Photogrammetric Reconstruction</strong></h3>
  
    <p>Processing was performed in <strong>Agisoft Metashape</strong> using high-accuracy alignment and dense reconstruction.</p>
  
    <ul>
      <li>Sparse reconstruction: 593,044 tie points</li>
      <li>Dense cloud: ~10.8 million points</li>
      <li>Reprojection error: 1.08 pixels</li>
    </ul>
  
    <p>Point cloud classification (threshold = 0.3) enabled separation of: Ground, Vegetation, Noise andMan-made features</p>
  
    <p>Derived products:</p>
    <ul>
      <li><strong>DEM (4 cm resolution)</strong> → terrain morphology</li>
      <li><strong>DSM</strong> → canopy structure</li>
      <li><strong>Orthomosaics</strong> → high-resolution mapping</li>
    </ul>
  
    <img src="${publicAsset('image/UAV/point_cloud.jpg')}" alt="Dense point cloud" />
  
    <h3><strong>3. Hyperspectral UAV Analysis (Potato Field)</strong></h3>
  
    <p>Hyperspectral data were acquired using the <strong>Gamaya OXI sensor</strong> (~40 spectral bands). Processing workflow:</p>
    <ul>
      <li>Georeferencing (WGS84 UTM Zone 31N)</li>
      <li>Spatial subsetting to experimental plots</li>
      <li>Band calibration using official wavelength definitions</li>
    </ul>
  
    <h3><strong>4. Radiometric Calibration (ELC)</strong></h3>
  
    <p>Calibration was performed using <strong>Empirical Line Correction (ELC)</strong> with 9 reference panels measured by an ASD spectrometer.</p>
  
    <img src="${publicAsset('image/UAV/calibration_plot.jpg')}" alt="Calibration accuracy" />
    <p>Accuracy assessment:</p>
    <ul>
      <li>Strict threshold: ≤ 2.3%</li>
      <li>Acceptable threshold: ≤ 5%</li>
    </ul>
  
    <p>Results showed:</p>
    <ul>
      <li>Good accuracy for low-reflectance panels</li>
      <li>Significant errors for high-reflectance panels (up to 0.84 difference)</li>
      <li>Better consistency in NIR vs VIS</li>
    </ul>
  
    <h3><strong>5. Vegetation Indices & Nitrogen Modelling</strong></h3>
  
    <p>Vegetation indices were computed using R:NDVI, NDRE, RDVI, WDVI, Red Edge Ratio:</p>
      
    <img src="${publicAsset('image/UAV/VI.jpg')}" alt="Calibration accuracy" />
    <p>A vegetation mask (NDVI ≥ 0.6) was applied to isolate canopy pixels.</p>

    <img src="${publicAsset('image/UAV/mask.jpg')}" alt="mask" />
  
    <p>Regression analysis linked spectral indices with field-measured nitrogen content.</p>`,
  
    keyFindings: `<h3>Photogrammetry Results</h3>
  
    <ul>
      <li>High-density point cloud (~10.8M points) capturing fine vegetation patterns</li>
      <li>Clear terrain gradient identified in DEM</li>
      <li>DSM successfully captured canopy variability and surface roughness</li>
    </ul>
  
    <img src="${publicAsset('image/UAV/dem_dsm.jpg')}" alt="DEM vs DSM comparison" />
  
    <h3>Radiometric Calibration</h3>
  
    <ul>
      <li>VIS region showed high variability (mean diff = 0.1685)</li>
      <li>NIR region more stable (mean diff = 0.0243)</li>
      <li>Only 1 panel met strict accuracy criteria</li>
    </ul>
  
    <h3>Nitrogen Estimation</h3>
  
    <ul>
      <li><strong>NDVI & LAI → best predictors</strong></li>
      <li>R² = 0.904 | r = 0.951 | statistically significant</li>
      <li>NDRE also strong (R² = 0.899)</li>
      <li>Band-based models weak (R² ≈ 0.36)</li>
      <li>Model accuracy: RMSE = 97.58 kg/ha</li>
    </ul>
  
    <img src="${publicAsset('image/UAV/nitrogen_regression.jpg')}" alt="Nitrogen regression model" />
  
    <h3>Key Insight</h3>
  
    <p>Vegetation indices significantly outperform single-band analysis, confirming the importance of spectral integration for biochemical estimation.</p>,
  
    <h3>Precision Agriculture Application</h3>
  
    <p>Spatial nitrogen requirement maps revealed strong variability across the field:</p>
  
    <ul>
      <li>Low NDVI zones → up to <strong>656 kg/ha nitrogen required</strong></li>
      <li>High NDVI zones → minimal or no fertilization needed</li>
    </ul>
  
    <img src="${publicAsset('image/UAV/nitrogen_map.jpg')}" alt="Nitrogen recommendation map" />
  
    <p>This enables:</p>
    <ul>
      <li>Site-specific fertilization</li>
      <li>Reduced environmental impact</li>
      <li>Optimized agricultural inputs</li>
    </ul>
  
    <h3>Leaf vs Tuber Analysis</h3>
  
    <ul>
      <li>Weak correlation (R² = 0.173)</li>
      <li>Leaf nitrogen is not a reliable proxy for tuber nitrogen</li>
    </ul>`,
  
    conclusion: `<p>This project demonstrates a <strong>fully integrated UAV remote sensing workflow</strong> combining structural and spectral analysis.</p>
  
    <p>Key contributions:</p>
  
    <ul>
      <li>High-resolution 3D reconstruction of terrain and vegetation</li>
      <li>Robust nitrogen estimation using hyperspectral indices</li>
      <li>Identification of calibration limitations in VIS spectrum</li>
      <li>Operational workflow for precision fertilization</li>
    </ul>
  
    <p>Despite calibration challenges, UAV-based vegetation indices proved to be <strong>reliable and scalable tools</strong> for nitrogen monitoring.</p>
  
    <p>This approach highlights the potential of UAV remote sensing for <strong>data-driven, sustainable agriculture</strong>.</p>`
  },

  // Land Cover and Forest Change in Luxembourg (2000–2020)
  {
    id: 8,
    title: "Land Cover and Forest Change in Luxembourg (2000–2020)",
    category: "Remote Sensing",
    description:
      "Multi-temporal land-cover and forest change analysis in Luxembourg using the GLAD GLCLU Landsat dataset (2000–2020), with trajectory-based change detection and area-adjusted accuracy assessment.",
    tools: ["Google Earth Engine", "QGIS", "RStudio"],
    image: publicAsset('image/LUXEMBOURG/lux.jpg'),
    location: "Luxembourg",
    coordinates: [49.6116, 6.1319],
    detailPage: "/data/land-cover-classification-luxembourg",
    downloadEnabled: false,
    download: "projectdoc/Land_cover_Luxembourg_term_paper.pdf",

    contextAndIntroduction: `<p>Human activities such as agriculture, logging, farming and urbanisation are among the most widespread drivers of global land use. In many countries, the expansion of agricultural, forestry and urban land has intensified in recent decades, creating significant environmental and socio-economic challenges linked to growing human demand for resources.</p>

    <p>Land cover change (LCC) and land use change (LUC) are two closely related but distinct mechanisms through which human activities transform the Earth’s surface. Land cover refers to the physical and biological elements present on the surface, such as vegetation, water bodies and built structures, whereas land use describes the function assigned to land by society, including agriculture, forestry, conservation and settlement. Remote sensing primarily detects land cover from spectral signatures, but analyses are typically interpreted in the context of land use dynamics.</p>

    <p>Although land transformation is not new, its current extent and intensity exceed historical levels, affecting both global and local scales. Land use change is now considered a key driver of environmental change, with up to 80% of the Earth’s surface directly or indirectly affected. In the global North, forest cover has often increased through reforestation or natural regeneration, whereas in the global South forest decline remains pronounced, driven mainly by agricultural and built-up expansion.</p>

    <p>As a global North country, Luxembourg presents a distinct but still ecologically important context. Land use is dominated by agricultural areas and forests, while artificial surfaces occupy a smaller but increasing share of the territory. Previous studies based on Corine Land Cover showed urban and industrial expansion between 1990 and 2006, with agricultural land slightly decreasing and forest areas remaining relatively stable. Even limited forest change can matter in a small, densely connected country, particularly for biodiversity, landscape fragmentation, ecosystem services and sustainable spatial planning.</p>

    <img src="${publicAsset('image/LUXEMBOURG/Overview.jpg')}" alt="Overview of the Luxembourg study area" />

    <p>Remote sensing provides an effective basis for land cover and land use change (LULC) analysis because it enables repeated observation of large areas over time. Using the Landsat-based GLCLU dataset, this project detects and quantifies forest cover change in Luxembourg between 2000 and 2020, with particular focus on the spatial extent and distribution of forest loss. The study addresses two main research questions:</p>

    <ul>
      <li>What are the dominant land-cover classes in Luxembourg, and how did their mapped extent change between 2000 and 2020?</li>
      <li>What was the spatial extent and distribution of forest disturbance in Luxembourg between 2000 and 2020?</li>
    </ul>`,

    methodology: `<p>This study combines multi-temporal Earth observation data, binary forest masking, trajectory-based change detection and area-adjusted accuracy assessment to quantify forest dynamics in Luxembourg between 2000 and 2020.</p>

    <p><strong>1. Study area.</strong></p>
    <p>The analysis focuses on the Grand Duchy of Luxembourg, a 2,586 km² country in Western Europe bordered by Belgium, France and Germany. The northern Oesling region belongs to the Ardennes and is more elevated and dissected by valleys, with an average elevation of approximately 450 m. The central and southern Gutland is characterised by alternating sedimentary formations with different resistance to erosion. These topographic contrasts influence construction, agricultural use and forest distribution. Forests cover approximately 92,150 ha, or about 35% of the natural territory, with broadleaved species representing around 64% and conifers about 36%. More than 55% of forested area is located in the northern, more relief-dominated part of the country.</p>

    <p><strong>2. Datasets.</strong></p>
    <p>The Global Land Cover and Land Use Change (GLCLU) Landsat-based dataset from the Global Land Analysis and Discovery (GLAD) laboratory at the University of Maryland was used as the primary input. The dataset provides globally consistent, annually updated land-cover classifications at 30 m resolution for 2000, 2010 and 2020. It was accessed through Google Earth Engine and spatially subset to Luxembourg’s national boundaries. The underlying Analysis Ready Data product combines radiometric and atmospheric correction, cloud and shadow masking, temporal gap-filling and phenology metrics, augmented with SRTM and ASTER topographic variables. Thematic classes were mapped using class-specific strategies, including bagged decision trees for cropland, regression tree models calibrated with GEDI lidar for forest height and extent, deep learning for built-up areas, and screen-based classification for open water.</p>

    <p><strong>3. Data acquisition and preprocessing.</strong></p>
    <p>GLCLU land-cover maps for 2000, 2010 and 2020 were extracted in Google Earth Engine using the national boundary polygon and exported at 30 m resolution. Very small patches and isolated pixels were removed, and classes with the same land-cover type were aggregated. Forest classes were grouped into open forest (tree height 5–25 m) and dense forest (tree height &gt; 25 m).</p>

    <img src="${publicAsset('image/LUXEMBOURG/Land_cover_map.jpg')}" alt="GLCLU land cover maps for Luxembourg (2000, 2010 and 2020)" />

    <p><strong>4. Binary forest / non-forest classification.</strong></p>
    <p>For the forest-focused analysis, the GLCLU legend was simplified into a binary forest / non-forest classification for each year. All woody vegetation classes were grouped as forest (value 1), while all remaining classes were grouped as non-forest (value 0). Net forest change was computed as FA<sub>2020</sub> − FA<sub>2000</sub>, where FA<sub>t</sub> is the forest area in year t.</p>

    <img src="${publicAsset('image/LUXEMBOURG/Forest_non_forest.jpg')}" alt="Binary forest mask maps for Luxembourg (2000, 2010 and 2020)" />

    <p><strong>5. Trajectory-based change detection.</strong></p>
    <p>The three binary forest masks were combined into a single trajectory map using a 3-digit change code:</p>

    <img src="${publicAsset('image/LUXEMBOURG/Luxembourg_change_detection.png')}" alt="Change code formula for forest trajectory mapping" />

    <p>This produced classes for stable forest, stable non-forest, forest loss in 2010, forest loss in 2020, forest gain in 2010 and forest gain in 2020. Unstable trajectory classes 101 and 010, which represented only 0.26% and 0.04% of the study area respectively, were visually inspected in Google Earth time-series imagery and reclassified as stable forest or stable non-forest when no persistent change event was visible.</p>

    <p><strong>6. Accuracy assessment and validation.</strong></p>
    <p>The reliability of the forest-change map was assessed using stratified random sampling combined with area-adjusted accuracy estimation following Olofsson et al. (2014). A minimum of 10 validation points was assigned to each rare change class, while the remaining samples were allocated to dominant stable classes according to mapped area, yielding 96 validation points in total. Each sample was compared with a reference class determined through visual interpretation of Google Earth imagery. Accuracy metrics, including user’s accuracy, producer’s accuracy, overall accuracy and adjusted area estimates, were computed in RStudio.</p>

    <p><strong>7. Software workflow.</strong></p>
    <p>Google Earth Engine was used to access and download GLCLU data; QGIS was used for spatial post-processing, map production and visual inspection of change patterns; and RStudio was used for summarising statistics, plotting and accuracy assessment.</p>`,

    keyFindings: `<p><strong>1. Dominant land-cover dynamics between 2000 and 2020.</strong></p>
    <p>The mapped area of the main GLCLU classes remained stable across the three reference years at approximately 259,300 ha. Built-up / artificial surfaces increased from 82,297 ha in 2000 to 91,874 ha in 2020, indicating continued expansion of artificial land cover. Total forest area, calculated as the sum of open and dense forest, decreased steadily from 81,406 ha in 2000 to 78,085 ha in 2020, corresponding to a net mapped forest decrease of approximately 3,321 ha. Dense short vegetation and cropland also decreased slightly, while minor classes such as wetlands, semi-arid surfaces and open water occupied only small areas and showed limited temporal variation.</p>

    <img src="${publicAsset('image/LUXEMBOURG/Land_cover_statistics.jpg')}" alt="Land cover class area statistics for 2000, 2010 and 2020" />

    <p><strong>2. Spatial pattern of forest change.</strong></p>
    <p>Stable forest dominated most of the study area, particularly in the northern and eastern parts of the country where larger and more continuous forest patches occur. Stable non-forest was more prevalent in the central and southern parts of Luxembourg. Forest loss was not uniformly distributed but concentrated in specific zones, mainly at the margins of existing forest patches. Loss in 2020 appeared more frequent and extensive than loss in 2010. Forest gains were comparatively sparse and occurred mainly in small, isolated patches, indicating limited regeneration relative to loss.</p>

    <img src="${publicAsset('image/LUXEMBOURG/Forest_change_map.jpg')}" alt="Forest change trajectory map for Luxembourg" />

    <p><strong>3. Magnitude of forest loss and gain.</strong></p>
    <p>Mapped proportions indicate that forest loss accounts for 1.0% of the study area in 2010 and 1.7% in 2020, giving a combined gross forest loss of approximately 2.7%. Forest gain remains much lower, with 0.22% in 2010 and 1.4% in 2020, for an overall gain of about 1.62%. This suggests insufficient recovery relative to mapped forest loss over the study period.</p>

    <img src="${publicAsset('image/LUXEMBOURG/Forest_change_diagram.jpg')}" alt="Forest change class areas and area-adjusted metrics" />

    <p>Area-adjusted estimates indicate that stable non-forest dominates the study area with an adjusted area of <strong>157,500 ha</strong>, followed by stable forest with <strong>80,532 ha</strong>. Adjusted forest loss was estimated at <strong>6,200 ha</strong> in 2010 and <strong>8,078 ha</strong> in 2020, while forest gain was <strong>5,872 ha</strong> in 2010 and <strong>1,125 ha</strong> in 2020. Combined adjusted estimates suggest total forest loss of about <strong>14,278 ha</strong> and total forest gain of <strong>6,997 ha</strong>, resulting in a net forest decrease of approximately <strong>7,281 ha</strong> between 2000 and 2020. The difference between mapped and adjusted estimates highlights the importance of correcting for classification error in change detection.</p>

    <p><strong>4. Accuracy assessment.</strong></p>
    <p>The trajectory-based change map achieved an overall accuracy of <strong>0.8916 ± 0.0731</strong>. However, this value is strongly influenced by the large proportion of stable classes. Stable forest reached a user’s accuracy of <strong>0.9412 ± 0.1153</strong> and a producer’s accuracy of <strong>0.8625 ± 0.1327</strong>, while stable non-forest reached a user’s accuracy of <strong>0.8974 ± 0.0965</strong> and a producer’s accuracy of <strong>0.9928 ± 0.007</strong>. In contrast, forest loss and gain classes showed lower and more uncertain accuracies. Loss in 2010 had a particularly low producer’s accuracy of <strong>0.2095 ± 0.3164</strong>, and gain in 2020 showed a low user’s accuracy of <strong>0.3 ± 0.2994</strong>, indicating that change classes were more difficult to map reliably than stable classes.</p>

    <p><strong>5. Integrated interpretation.</strong></p>
    <p>Overall, the results show a gradual shift toward more human-dominated land-use patterns in Luxembourg. Forest cover remained one of the dominant land-cover types, but net forest decline occurred over the study period. Loss was concentrated at forest edges and in fragmented areas rather than within large continuous forest blocks, likely reflecting local pressures such as logging, infrastructure expansion and peri-urban development. Stable forest was mainly concentrated in northern Luxembourg (Oesling), while southern and central regions showed more stable non-forest land uses driven by urbanisation and agriculture. The limited and scattered forest gains suggest that natural regrowth or afforestation is not keeping pace with forest loss.</p>`,

    conclusion: `<p>This project demonstrates the value of integrating long-term Landsat-based datasets with a multi-temporal change detection framework for analysing land-cover dynamics in Luxembourg. By combining the GLCLU dataset with trajectory-based forest change mapping and area-adjusted accuracy assessment, the study provides a structured and reproducible basis for quantifying forest transitions between 2000 and 2020.</p>

    <p>The results show that Luxembourg experienced continued expansion of built-up areas alongside a net decline in forest cover. Mapped statistics indicate a forest decrease of approximately 3,321 ha, whereas area-adjusted estimates suggest a larger reduction of roughly 7,281 ha once classification uncertainty is accounted for. Forest loss was spatially concentrated at patch edges and in fragmented landscapes, while stable forest remained dominant in the northern part of the country. The accuracy assessment confirmed that stable classes were mapped reliably, whereas forest gain and loss classes showed higher uncertainty, which is common in remote sensing change detection.</p>

    <p>Key limitations include the 30 m Landsat resolution, which may miss fine-scale transitions in mixed forest–urban zones; spectral confusion between similar vegetation classes; and the relatively limited number of validation samples for rare change classes. Future work could integrate higher-resolution imagery such as Sentinel-2, extend the temporal scope beyond 2020, and incorporate socioeconomic drivers to better explain observed spatial patterns.</p>

    <p>Overall, this study provides a robust framework for understanding spatial and temporal forest dynamics in Luxembourg and illustrates how Earth observation time series combined with statistically sound accuracy assessment can support environmental monitoring, spatial planning and sustainable land management under ongoing land-use change.</p>`
  },

  // Quantifying Forest Disturbance Using Multi-Temporal Landsat Time Series and Random Forest Classification
  {
    id: 9,
    title: "Quantifying Forest Disturbance Using Multi-Temporal Landsat Time Series and Random Forest Classification",
    category: "Remote Sensing",
    description:
      "Multi-temporal Landsat analysis of forest cover change in the Dja-et-Lobo district (Cameroon, 2013–2024) using FORCE preprocessing, Random Forest classification, and area-adjusted change detection.",
    tools: ["FORCE", "R", "QGIS", "Landsat 7/8/9"],
    image: publicAsset('image/Forest_disturbance/Change_map_of_the_Dja-et-Lobo_district.jpg'),
    location: "Dja-et-Lobo District, Cameroon",
    coordinates: [2.8, 12.9],
    detailPage: "/data/quantifying-forest-disturbance-dja-et-lobo",
    downloadEnabled: false,
    download: "projectdoc/Forest_disturbance_Dja-et-Lobo_term_paper.pdf",

    contextAndIntroduction: `<p>Land-use change is one of the main drivers of biodiversity loss worldwide. Tropical rainforests are among the ecosystems most affected by the conversion of forest areas into agricultural land, particularly in Africa. The Congo Basin hosts the second-largest tropical forest ecosystem on Earth, covering approximately 170 million hectares of dense rainforest and 116 million hectares of open forest and wooded savannahs where trees remain a significant component of the landscape.</p>

    <p>In Cameroon, forests provide essential environmental services at local, regional and global scales. Despite their importance, these ecosystems face increasing pressure from logging, agricultural expansion and land-use conversion. In the Dja-et-Lobo district, rubber and cocoa cultivation have been major contributors to deforestation and forest degradation. Rubber plantations alone have been linked to more than 8,000 hectares of forest cleared and converted over eight years, with reported socio-economic impacts on local communities, including indigenous populations in Meyomessala.</p>

    <img src="${publicAsset('image/Forest_disturbance/Overview.jpg')}" alt="Overview of the Dja-et-Lobo study area" />

    <p>Satellite-based remote sensing provides a consistent and spatially explicit approach to monitoring forest cover change and supporting forest management planning. However, despite documented deforestation pressures in Dja-et-Lobo, spatially explicit analysis quantifying forest dynamics at the district level over the last decade remains limited. This study uses multitemporal Landsat imagery and geospatial analysis to map land-use and land-cover dynamics between 2013 and 2024, and applies post-classification change detection to quantify forest disturbance.</p>

    <p>The central research question guiding the study is: <strong>How has forest disturbance evolved in the Dja-et-Lobo district between 2013 and 2024?</strong> To address this question, the analysis focuses on quantifying land use and cover within the district and assessing changes in the spatial extent and distribution of forest cover to identify disturbance patterns.</p>`,

    methodology: `<p>This study applies a FORCE-based Earth observation workflow combining Analysis Ready Data (ARD) generation, Highly Analysis Ready Data (HARD) feature engineering, Random Forest classification, binary forest masking and trajectory-based change detection validated with area-adjusted accuracy assessment.</p>

    <img src="${publicAsset('image/Forest_disturbance/Overview_of_methodological_workflow.jpg')}" alt="Overview of the methodological workflow" />

    <p><strong>1. Study area and data.</strong></p>
    <p>The Dja-et-Lobo district is located in southern Cameroon and comprises the municipalities of Meyomessala, Djoum and Mintom. The region has an equatorial climate with abundant rainfall (approximately 2,600 mm/year), dense humid rainforest vegetation and a hydrographic network dominated by the Dja and Ayina river basins. Multispectral Landsat imagery acquired between 2013 and 2024 was used for analysis. Based on the temporal distribution of available Landsat Level-2 imagery, Landsat 7, 8 and 9 were retained. After cloud filtering and masking, <strong>293 usable Landsat scenes</strong> were processed using the open-source FORCE framework.</p>

    <img src="${publicAsset('image/Forest_disturbance/distribution_per_sensor_of_Landsat_imagery.jpg')}" alt="Distribution of Landsat imagery by sensor (1984–2025)" />

    <p><strong>2. Analysis Ready Data (ARD).</strong></p>
    <p>Landsat Level-1 imagery was converted to bottom-of-atmosphere surface reflectance through radiative-transfer-based atmospheric correction, BRDF correction and topographic C-correction. Cloud and cloud-shadow pixels were masked using the Fmask algorithm. All corrected scenes were projected to Africa Albers Equal Area Conic and organised into a spatially aligned 30 m data cube with 30 km × 30 km tiling.</p>

    <p><strong>3. Clear-sky observations and HARD feature engineering.</strong></p>
    <p>Clear-sky observation (CSO) layers were computed to evaluate the spatial and temporal availability of valid observations. Most pixels contained 3–10 valid observations over 2013–2024, with peak frequencies around 4–7 observations, reflecting the constraints of persistent cloud cover and Landsat 7 scan-line errors in this humid tropical environment.</p>

    <img src="${publicAsset('image/Forest_disturbance/forest_clear_sky_observation_map.jpg')}" alt="Clear-sky observation map derived from Landsat (2013–2024)" />

    <img src="${publicAsset('image/Forest_disturbance/CSO_bands_histogram.jpg')}" alt="Histogram of clear-sky observation counts" />

    <p>Highly Analysis Ready Data (HARD) layers were derived to improve separability among dense tropical canopy, disturbed forest and non-forest classes. NDVI and EVI were computed for all valid observations, together with temporal metrics including quartiles (Q25, Q50, Q75), standard deviation, mean and maximum NDVI. Four-year maximum NDVI composites were generated for each sub-period to reduce cloud contamination and seasonal variability.</p>

    <img src="${publicAsset('image/Forest_disturbance/Max_NDVI_composite_2013-2016.jpg')}" alt="Maximum NDVI composite for 2013–2016" />

    <p><strong>4. Reference data and Random Forest classification.</strong></p>
    <p>Six land-cover classes were defined: urban area, bare soil, agricultural area, shrubland, forest and water. Training samples were digitised from Google Earth imagery and Landsat composites for each sub-period (2013–2016, 2017–2020, 2021–2024). A stratified validation design yielded <strong>894 validation samples</strong>, with stable forest represented by 645 samples and a minimum of 50 samples per remaining class.</p>

    <img src="${publicAsset('image/Forest_disturbance/Training_points_dataset_for_2017-2020.jpg')}" alt="Training points dataset for 2017–2020" />

    <img src="${publicAsset('image/Forest_disturbance/Validation_points_dataset.jpg')}" alt="Validation points dataset" />

    <p>Random Forest classifiers with 500 trees were trained independently for each sub-period using identical feature definitions and period-specific training data. This multitemporal strategy reduces sensor bias and avoids transferring spectral differences across periods.</p>

    <img src="${publicAsset('image/Forest_disturbance/Dja-et-lobo_district_Land_cover_maps.jpg')}" alt="Land cover maps for the Dja-et-Lobo district (2016, 2020, 2024)" />

    <p><strong>5. Binary forest masking and trajectory-based change detection.</strong></p>
    <p>Classification outputs were recoded into binary forest / non-forest maps for 2016, 2020 and 2024. Forest pixels were assigned a value of 1 and all other classes grouped as non-forest (value 0). Post-classification comparison between sub-periods was used to derive forest change trajectories using a 3-digit change code:</p>
    <p><em>Change code = 100 × F<sub>2016</sub> + 10 × F<sub>2020</sub> + 1 × F<sub>2024</sub></em>, where F<sub>t</sub> = 1 if the pixel was forest in year t and 0 otherwise.</p>
    <p>Unstable intermediate patterns (101 and 010) were visually verified using Landsat time series and Google Earth imagery and reclassified as stable forest or stable non-forest where appropriate.</p>

    <img src="${publicAsset('image/Forest_disturbance/forest_and_non-forest_map.jpg')}" alt="Binary forest and non-forest maps (2016, 2020, 2024)" />

    <p><strong>6. Validation.</strong></p>
    <p>Change-map validation followed Olofsson et al. (2014), combining stratified random sampling with area-adjusted accuracy estimation. Validation points were interpreted against Landsat time series and Google Earth imagery, and accuracy metrics were computed in R.</p>`,

    keyFindings: `<p><strong>1. Dominant land-cover dynamics between 2016 and 2024.</strong></p>
    <p>Forest remained the dominant land cover across all reference years, covering approximately <strong>1.92 million ha</strong> in 2016 and decreasing to about <strong>1.80 million ha</strong> in 2024. Agricultural areas expanded strongly from <strong>13,874 ha</strong> in 2016 to <strong>95,813 ha</strong> in 2024. Urban areas increased steadily from <strong>8,578 ha</strong> to <strong>21,908 ha</strong>, indicating gradual settlement expansion. Shrubland showed a moderate rise, bare soil peaked in 2020 (likely reflecting temporary land exposure linked to agricultural activity), and water bodies remained the smallest and most stable class.</p>

    <img src="${publicAsset('image/Forest_disturbance/Classes_area_statistics.jpg')}" alt="Land cover class area statistics for 2016, 2020 and 2024" />

    <p><strong>2. Spatial pattern of forest change.</strong></p>
    <p>Stable forest dominated most of the study area, particularly in the central and southern parts of the district. Forest loss appeared mainly as scattered patches along road networks and around settlements, with larger clusters visible in the northern part of the district. Forest gains were comparatively sparse and occurred in small isolated patches, suggesting limited regeneration or transitional phases between non-forest and forest cover during the study period.</p>

    <img src="${publicAsset('image/Forest_disturbance/Change_map_of_the_Dja-et-Lobo_district.jpg')}" alt="Forest change map of the Dja-et-Lobo district" />

    <p><strong>3. Magnitude of forest loss and gain.</strong></p>
    <p>Mapped proportions indicate that forest loss accounts for <strong>1.74%</strong> (loss 2020) and <strong>3.57%</strong> (loss 2024) of the total study area, giving a combined gross forest loss of approximately <strong>5.3%</strong>. Forest gain remains low, with <strong>0.47%</strong> (gain 2020) and <strong>0.07%</strong> (gain 2024), indicating limited recovery relative to detected forest loss.</p>

    <img src="${publicAsset('image/Forest_disturbance/Diagram_of_forest_change_area.jpg')}" alt="Diagram of forest change class areas and metrics" />

    <p>Area-adjusted estimates indicate that stable forest dominates with an adjusted area of <strong>1,881,816 ± 16,854 ha</strong>, followed by stable non-forest with <strong>41,440 ± 8,890 ha</strong>. Adjusted forest loss was estimated at <strong>23,082 ± 4,838 ha</strong> (loss 2020) and <strong>29,215 ± 10,402 ha</strong> (loss 2024), while forest gain covered <strong>11,144 ± 9,174 ha</strong> (gain 2020) and <strong>5,275 ± 6,034 ha</strong> (gain 2024). Combined adjusted estimates indicate a net forest decrease of approximately <strong>119,422 ha</strong>, showing that total forest loss exceeded detected forest gain over the study period.</p>

    <p><strong>4. Accuracy assessment.</strong></p>
    <p>The change map achieved an overall accuracy of <strong>0.959 ± 0.0085</strong>. Stable classes exhibited the highest accuracies: stable forest reached a user’s accuracy of <strong>0.9918 ± 0.006</strong> and a producer’s accuracy of <strong>0.9705 ± 0.0061</strong>, while stable non-forest reached a user’s accuracy of <strong>0.875 ± 0.0946</strong> and a producer’s accuracy of <strong>0.7304 ± 0.1472</strong>. Forest loss classes showed high producer accuracy (<strong>0.9972 ± 0.0038</strong> for loss 2020; <strong>0.9728 ± 0.0527</strong> for loss 2024) but lower user accuracies, particularly for loss 2024 (<strong>0.4 ± 0.1448</strong>). Forest gain classes presented the lowest accuracies, with user’s accuracy between <strong>0.21</strong> and <strong>0.27</strong> and producer’s accuracy between <strong>0.07</strong> and <strong>0.17</strong>.</p>

    <img src="${publicAsset('image/Forest_disturbance/area-adjusted confusion matrix.jpg')}" alt="Area-adjusted confusion matrix for the forest change map" />

    <p><strong>5. Integrated interpretation.</strong></p>
    <p>Overall, the results indicate that forest loss in Dja-et-Lobo is spatially concentrated in accessible areas, particularly along road networks and near settlements. Larger contiguous areas of conversion are likely associated with plantation expansion, especially rubber cultivation, as suggested by regular spatial patterns observed in the imagery. The limited forest gain suggests that regeneration has not offset deforestation at equivalent levels, with implications for habitat fragmentation, biodiversity and ecosystem resilience in this Congo Basin forest landscape.</p>`,

    conclusion: `<p>This project demonstrates that satellite-based time-series analysis can be effectively applied to monitor forest cover change in regions with challenging data availability. Using the FORCE framework, 293 Landsat scenes were processed into consistent land-cover classifications and a validated forest change assessment for the period 2013–2024.</p>

    <p>The results reveal a clear net loss of forest area in the Dja-et-Lobo district, primarily driven by agricultural expansion. Approximately 5.3% of forest cover was affected by deforestation during the study period, while forest gain remained comparatively limited. The high overall accuracy of 0.959 ± 0.0085 suggests that the approach provides a robust representation of large-scale forest dynamics, although uncertainties remain for smaller and more transient changes, particularly forest gain classes.</p>

    <p>Key limitations include persistent cloud cover reducing temporal observation density, Landsat 7 scan-line artefacts, 30 m spatial resolution limiting detection of small-scale changes, and higher classification noise in the 2017–2020 period. Future work could integrate Sentinel-2 and radar data, improve reference datasets with field observations, and explore direct time-series change detection to reduce reliance on post-classification comparison.</p>

    <p>Overall, the study contributes to a better understanding of deforestation processes in the Dja-et-Lobo district and provides a transferable framework for environmental monitoring, conservation prioritisation and sustainable land management in tropical forest ecosystems.</p>`
  },

  // Raum+ Web GIS Platform
  {
    id: 10,
    title: "Raum+ Web GIS Platform",
    category: "Web Mapping",
    description:
      "Development of the Raum+ web GIS platform for ProRaum Consult: a browser-based spatial planning application for mapping, editing and analysing settlement reserves using PostGIS, GeoServer, Node.js and Leaflet.",
    tools: ["JavaScript", "Node.js", "PostgreSQL", "PostGIS", "GeoServer", "Leaflet", "QGIS"],
    image: publicAsset('image/Raum/raum.jpg'),
    location: "Karlsruhe, Germany",
    coordinates: [49.00937, 8.40444],
    detailPage: "/data/raum-web-platform",
    downloadEnabled: false,
    download: "projectdoc/Raum_platform_development.docx",
    video: publicAsset('image/Raum/RaumPlatform.mp4'),

    contextAndIntroduction: `<p>This project consisted in developing the Raum+ web GIS platform for ProRaum Consult, a sustainable land management planning company based in Karlsruhe (Germany). ProRaum Consult specialises in the sustainable development of urban areas and produces spatial development concepts using the Raum+ methodology, which highlights unexploited potential and underused areas at different regional scales to optimise the use of land resources.</p>

    <p>Twenty years ago, ProRaum Consult implemented a first version of the Raum+ platform using older technologies. The objective of this project was to rebuild the platform with current web GIS tools, enabling online access and editing of land-use spatial data for municipalities and planning authorities.</p>

    <p>Raum+ combines interactive maps, attribute tables, dynamic forms and reporting views to support the identification and management of settlement reserves, including internal development potential, external reserves, building gaps and densification areas. The platform also required careful handling of sensitive geospatial data through role-based access and municipality-scoped permissions.</p>`,

    methodology: `<p>The Raum+ platform follows a three-tier web GIS architecture in which the client (frontend), application services (backend and map server) and geodatabase interact to deliver map visualisation, feature editing and reporting functionality.</p>

    <img src="${publicAsset('image/Raum/Client_user_architecture.jpg')}" alt="Three-tier user-client architecture for the web GIS" />

    <p><strong>1. Technology selection.</strong></p>
    <p>Free, recent and compatible technologies were evaluated for building a modern web GIS. The selected stack was organised around three main components: a geodatabase to store and manage user information and GIS data; a map server to publish WMS and WFS services; and a web server to deliver the application and route requests between the client and map server. PostgreSQL with the PostGIS extension was chosen as the spatial database, GeoServer as the map server, and Node.js with Express as the backend web server. QGIS was used for data preparation and import.</p>

    <img src="${publicAsset('image/Raum/platform_componeents.jpg')}" alt="Platform components: frontend, Express server and PostgreSQL database" />

    <p><strong>2. Geodatabase setup and data management.</strong></p>
    <p>A PostGIS-enabled PostgreSQL database was created and populated with project GIS layers, including basemaps, building layers, administrative boundaries, land parcels and development potential areas. Spatial extensions were enabled and data were imported from QGIS into PostgreSQL. Tables were structured to support both visualisation and editable feature workflows, with geometry fields stored in the database and inspected through pgAdmin.</p>

    <div class="figure-row">
      <img src="${publicAsset('image/Raum/postgreSQL.jpg')}" alt="PostgreSQL and PostGIS database setup" />
      <img src="${publicAsset('image/Raum/visualise_with_postgreSQL.jpg')}" alt="Visualising spatial layers in PostgreSQL with pgAdmin" />
    </div>

    <p><strong>3. GeoServer configuration and layer publishing.</strong></p>
    <p>The PostGIS database was connected to GeoServer through a PostGIS store. For each editable GIS dataset, a WFS was created; for reference layers, WMS services were published. Layer styles exported from QGIS as Styled Layer Descriptor (.SLD) files were uploaded to GeoServer and assigned to the corresponding layers. Primary key exposure was enabled for editable PostGIS layers so that feature updates could be handled correctly through web services.</p>

    <img src="${publicAsset('image/Raum/Geoserver.jpg')}" alt="GeoServer installation, packages and configuration" />

    <img src="${publicAsset('image/Raum/publishing_with_geoserver.jpg')}" alt="Publishing layers with GeoServer" />

    <p><strong>4. Frontend development.</strong></p>
    <p>The user interface was built with HTML, CSS and JavaScript. The Leaflet library was used to create an interactive map connected to GeoServer WMS and WFS layers. The frontend includes region and municipality selectors, a layer control panel, base map switching, map tools for zooming and feature inspection, and dynamic forms for creating and editing settlement reserve records. Project configuration is centralised so that layers, fields, permissions and translations can be adapted per project without changing core application code.</p>

    <p><strong>5. Backend services and security.</strong></p>
    <p>A Node.js/Express backend handles authentication, API routing, database queries and communication with GeoServer. HTTPS was configured for secure access. Role-based access controls determine whether users can view, edit or administer data. Municipality users can typically access only their own municipality, while regional and administrator roles have broader permissions.</p>

    <img src="${publicAsset('image/Raum/node.jpg')}" alt="Node.js backend setup" />`,

    keyFindings: `<p><strong>1. User access and project context.</strong></p>
    <p>The platform opens with a login page and then loads the project workspace according to the user’s role and permissions. After authentication, users select a region and municipality to define the spatial scope of the session. The interface supports English, German and French, and includes contact and assistance links to the platform manual and Raum+ data model documentation.</p>

    <img src="${publicAsset('image/Raum/login.jpg')}" alt="Raum+ login page and main workspace" />

    <img src="${publicAsset('image/Raum/Region_and_municip_select.jpg')}" alt="Region and municipality selection dropdowns" />

    <p><strong>2. Interactive map and layer management.</strong></p>
    <p>The map view combines administrative boundaries, land parcels, buildings and thematic settlement reserve layers. Users can switch base maps, toggle theme layers, inspect feature attributes, zoom to selected features and print the current map extent. Map tools support geometry digitisation and editing for authorised users.</p>

    <div class="figure-row">
      <img src="${publicAsset('image/Raum/tools.jpg')}" alt="Map navigation and editing tools" />
      <img src="${publicAsset('image/Raum/feature_edition.jpg')}" alt="Digitising and editing feature geometry on the map" />
    </div>

    <p><strong>3. Settlement reserve management.</strong></p>
    <p>Raum+ organises land potential into categories such as internal development, external reserves, building gaps and densification. Users with edit rights can open tabular lists, create new features through structured forms, update attributes and modify geometries directly on the map. When geometry is changed, the platform automatically recalculates area values, reducing manual data entry errors.</p>

    <img src="${publicAsset('image/Raum/newFeatureForm.jpg')}" alt="Dynamic form for creating a new settlement reserve feature" />

    <img src="${publicAsset('image/Raum/edition toolbar.jpg')}" alt="Feature editing toolbar on the map" />

    <p><strong>4. Search, export and reporting.</strong></p>
    <p>The search module allows users to filter settlement reserves by potential type, ownership, municipality, area range and other attributes. Results can be viewed on a map preview, opened in the full map interface, displayed in a table or exported in formats including Excel, Shapefile, DXF, GeoJSON and GeoPackage. The fact sheet provides regional and municipal summaries of survey results and land potential through dynamic charts and tables.</p>

    <img src="${publicAsset('image/Raum/platforn_view.jpg')}" alt="Raum+ platform overview: interactive map, layer control and navigation" />

    <img src="${publicAsset('image/Raum/search.jpg')}" alt="Search interface for total settlement reserves" />

    <img src="${publicAsset('image/Raum/download_feature.jpg')}" alt="Feature list with download and export options" />

    <img src="${publicAsset('image/Raum/Raum+Manual.jpg')}" alt="Raum+ platform overview: login, tables, map and editing views" />

    <p><strong>5. Integrated outcome.</strong></p>
    <p>The delivered platform is a fully working web GIS in which PostgreSQL/PostGIS stores spatial and attribute data, GeoServer publishes standard OGC services, and the Leaflet-based frontend enables interactive visualisation and editing. The result supports ProRaum Consult’s Raum+ methodology by making settlement reserve data accessible online for analysis, updating and reporting across municipalities and regions.</p>`,

    conclusion: `<p>This project demonstrates how a modern three-tier web GIS can be built by combining PostGIS, GeoServer, Node.js and Leaflet to support sustainable spatial planning workflows. The new Raum+ platform replaces legacy technology with a browser-based system that allows municipalities and planning teams to view, search, edit and export settlement reserve data through a single interface.</p>

    <p>The development process highlighted both the technical and organisational dimensions of web GIS. On the technical side, careful database design, consistent layer publishing in GeoServer and structured frontend configuration were essential to connect maps, forms and reporting views. On the organisational side, role-based permissions and municipality-scoped access were critical for managing sensitive planning data responsibly.</p>

    <p>Key challenges included handling editable WFS layers, maintaining consistent styling between QGIS and GeoServer, configuring secure HTTPS access and designing forms flexible enough to represent complex land-potential attributes. Future improvements could include deeper integration of higher-resolution basemaps, expanded fact-sheet analytics and further automation of data validation workflows.</p>

    <p>Overall, the project delivers a production-oriented geospatial web application that operationalises land planning data in an accessible, multi-language platform for ProRaum Consult and its municipal partners.</p>`
  },

  // Spatial Analysis of Crimes vs. Urban Venues in London
  {
    id: 11,
    title: "Spatial Analysis of Crimes vs. Urban Venues in London",
    category: "Geostatistics",
    description:
      "Multi-part geospatial statistics study in Greater London combining point-pattern analysis of crime and urban venues, areal hotspot and clustering methods for cumulative impact zoning, and spatial regression plus geostatistical interpolation of PM2.5.",
    tools: ["R", "spatstat"],
    image: publicAsset('image/Geostat/geostat_violent_crime_kde.jpg'),
    location: "London, United Kingdom",
    coordinates: [51.5074, -0.1278],
    detailPage: "/data/spatial-analysis-crimes-urban-venues-london",
    downloadEnabled: false,
    download: "projectdoc/Geostatistics_London.docx",

    contextAndIntroduction: `<p>This project examines spatial patterns in Greater London through three complementary geostatistical workflows. London comprises 32 boroughs and the City of London, divided into more than 600 administrative wards where population density, land use and socio-economic conditions vary strongly. These contrasts make the city a suitable setting for analysing how crime, urban venues and environmental exposure are distributed in space.</p>

    <p>The study is organised in three parts. <strong>Part I</strong> investigates the spatial relationship between crime events and urban venues using point-pattern and density-based methods. <strong>Part II</strong> applies areal statistics, hotspot detection and spatially constrained clustering to support evidence-based delineation of cumulative impact zones linked to the night-time economy. <strong>Part III</strong> extends the urban analysis to ward-level PM2.5 concentrations through spatial regression models and geostatistical interpolation, allowing comparison of explanatory and predictive approaches under spatial dependence.</p>

    <p>Crime data were obtained from UK Police open data (110,357 incidents in June 2024). Venue locations came from the Foursquare Places API (7,970 points). Ward boundaries and socio-economic variables provided the areal framework for aggregation, clustering and regression. All analyses were carried out in EPSG:27700 (British National Grid).</p>`,

    methodology: `<p>The project applies three geostatistical workflows to Greater London. Each part uses a different spatial representation — point events, ward polygons, and continuous pollution grids — and each method within a part was chosen because it answers a distinct analytical question.</p>

    <h3><strong>Part I – Spatial point pattern analysis (crime vs. urban venues)</strong></h3>

    <p>Part I treats crimes and venues as point events within the ward boundary window. Four methods were applied sequentially because each tests a different aspect of spatial association: global distance-based interaction, naive proximity, density-adjusted proximity, and continuous hotspot overlap.</p>

    <p><strong>1. Cross-G-function analysis.</strong> The cross-G-function G<sub>12</sub>(r) measures the cumulative proportion of crime points that lie within distance r of at least one venue point, relative to what would be expected if crime and venue locations were independent. Monte Carlo simulation (95% confidence envelopes) generates a null model of random labelling; if the observed curve lies above the envelope, pairs occur closer than expected (attraction), below the envelope indicates repulsion, and curves within the envelope indicate independence. This method summarises interaction across the full study area and all distance ranges simultaneously.</p>

    <p><strong>2. Nearest neighbour distance analysis.</strong> For each violent crime point, the Euclidean distance to the nearest venue of a given type was calculated in EPSG:27700. Mean, median, minimum, maximum and standard deviation were computed for the ten most frequent venue types. To test whether observed proximity reflects genuine association or merely venue abundance, the same statistics were recomputed using randomly placed venue locations with identical counts, allowing direct comparison of observed versus random distance distributions.</p>

    <p><strong>3. Relative risk analysis (density-adjusted proximity).</strong> Rather than measuring absolute distance, relative risk compares the proportion of crimes occurring within fixed buffers (50, 100, 200, 500 and 1,000 m) around real venue locations against the proportion around randomly generated venue locations with the same abundance. A relative risk above 1 means crimes are more concentrated near real venues than expected under complete spatial randomness; values below 1 indicate under-concentration.</p>

    <p><strong>4. Kernel density estimation (KDE) with Z-score standardisation.</strong> Point events were converted into continuous density surfaces using Gaussian kernels. Bandwidth was selected by Diggle’s cross-validation (≈ 257 m) to preserve local detail. Each surface was Z-score standardised so that values ≥ 1 represent above-average concentrations. Hotspot overlap was then computed on a common grid by intersecting violent-crime hotspots (Z ≥ 1) with each venue-type hotspot, yielding the percentage of shared high-intensity area.</p>

    <p>The figure below shows the crime and venue categories retained for the cross-G-function analysis — anti-social behaviour, violent crime and other theft versus pubs, restaurants and cafés — selected because they represent both high-frequency crime types and common urban venue categories.</p>

    <img src="${publicAsset('image/Geostat/geostat_cross_k_selection.jpg')}" alt="Selected crime and venue categories for cross-G-function analysis" />

    <h3><strong>Part II – Areal statistics, hotspots and cumulative impact zones</strong></h3>

    <p>Part II shifts from point events to ward-level densities in order to support policy-relevant zoning of cumulative impact areas linked to the night-time economy.</p>

    <p><strong>1. Data aggregation and spatial weights.</strong> Crime incidents (violence, anti-social behaviour, criminal damage/arson) and alcohol-led venues were counted per ward and converted to densities (events per km²). Queen contiguity neighbours (wards sharing any border or corner) were row-standardised so that each ward’s spatial lag is a weighted average of neighbouring values, ensuring comparability across wards with different numbers of neighbours.</p>

    <p><strong>2. Global and local spatial autocorrelation.</strong> Global Moran’s I tests whether similar values cluster spatially across all wards. Local Moran’s I (LISA) decomposes this into ward-level High–High, Low–Low, High–Low and Low–High categories. Getis–Ord Gi* identifies statistically significant hotspots and coldspots by comparing each ward’s value with its local neighbourhood mean. The Gi* results for crime and venue density were intersected to locate wards where both variables are simultaneously elevated.</p>

    <p><strong>3. Bivariate LISA.</strong> To capture spillover beyond ward boundaries, bivariate LISA was computed between each ward’s crime density and the average venue density of its neighbours. This tests whether high crime in one ward is associated with high venue density in surrounding wards — a pattern relevant for cumulative impact zone design.</p>

    <p><strong>4. Spatially constrained hierarchical clustering.</strong> Crime density, venue density, median income, deprivation, PTAL, population density, housing composition and median age were Z-score standardised. Two distance matrices were built: attribute dissimilarity between wards and centroid proximity. The elbow method and average silhouette width (k = 2–8) guided cluster number selection; k = 4 was retained for interpretability. Spatially constrained clustering combined both matrices through a constraint parameter alpha (0 = attribute only, 1 = spatial only); alpha = 0.3 was chosen as the balance between statistical fit and spatial compactness. Results were validated with PCA, silhouette distributions, cluster profile heat maps and policy classification maps.</p>

    <h3><strong>Part III – Spatial regression and geostatistical interpolation of PM2.5</strong></h3>

    <p>Part III examines ward-level PM2.5 exposure through two complementary strands: explanatory spatial regression and predictive geostatistical interpolation.</p>

    <p><strong>1. Data preparation.</strong> Ward polygons were intersected with a PM2.5 pollution grid; area-weighted mean concentrations were computed per ward and merged with socio-economic variables. Missing values were removed and PM2.5 was log-transformed as log(PM2.5 + 1) to reduce skewness. The figure below shows the underlying PM2.5 grid clipped to Greater London, which provides the continuous spatial basis for both ward aggregation and later interpolation.</p>

    <img src="${publicAsset('image/Geostat/geostat_pm25_grid_overview.jpg')}" alt="Overview of the PM2.5 grid for Greater London" />

    <p><strong>2. Spatial regression (LM, lag and error models).</strong> The ten socio-economic variables with the strongest absolute correlation to log(PM2.5 + 1) were retained as predictors. Three models were fitted on queen-contiguity row-standardised weights: a standard linear model (baseline), a spatial lag model (dependent variable depends on neighbouring values via ρ), and a spatial error model (spatially structured error term via λ). Models were compared using AIC, log-likelihood, residual Moran’s I and residual diagnostics. Spatial block cross-validation grouped wards into spatial folds via k-means on centroids to evaluate out-of-sample RMSE, MAE and R².</p>

    <p><strong>3. Geostatistical interpolation.</strong> The eight strongest predictors were used for regression kriging. A linear mixed-effects model with borough as random intercept (R² = 0.711) outperformed a standard linear trend and was retained as the regression component. Residual variogram analysis justified kriging of unexplained spatial structure. On a 50 m grid, regression kriging, ordinary kriging, cokriging (with NOx as secondary variable) and inverse distance weighting were applied and compared through 10-fold cross-validation (RMSE, MAE, R², bias) plus observed-versus-predicted and residual distribution plots.</p>`,

    keyFindings: `<h3><strong>Part I – Point pattern analysis: crime and urban venues</strong></h3>

    <p><strong>1. Cross-G-function analysis.</strong> The cross-G-function tests whether crime and venue points occur closer together than expected under spatial randomness across the full study area. A 95% Monte Carlo envelope was used as the null reference.</p>

    <p>The figure below plots observed G-cross curves for three crime types (anti-social behaviour, violent crime, other theft) against three venue types (pub, restaurant, café). At short distances, all observed curves lie below the simulation envelopes, indicating repulsive or weak interaction rather than attraction. Anti-social behaviour and violent crime remain below the envelope over almost the entire distance range; other theft approaches independence only at larger distances (850–1,300 m depending on venue type).</p>

    <img src="${publicAsset('image/Geostat/geostat_cross_g_functions.jpg')}" alt="Cross-summary G-functions between selected crime and venue types" />

    <p>Interpretation: the cross-G-function summarises London-wide interaction and can mask strong local hotspot co-location. The global repulsion pattern therefore does not contradict the local concentration effects revealed by the methods below — it reflects a scale-dependent result.</p>

    <p><strong>2. Nearest neighbour distance analysis.</strong> This method measures how far each of 24,134 violent crime points lies from the nearest venue of each of the ten most frequent types. It provides a direct proximity measure but is sensitive to venue abundance.</p>

    <p>The bar chart below shows mean nearest-neighbour distances by venue type. Pubs have the lowest mean distance (~600 m), followed by cafés, restaurants and bakeries (~750 m). Venue types with fewer locations show larger mean distances, suggesting that apparent proximity may simply reflect how many venues exist.</p>

    <img src="${publicAsset('image/Geostat/geostat_nn_analysis.jpg')}" alt="Nearest neighbour analysis of the top 10 venue types" />

    <p>The scatter plot below correlates mean nearest-neighbour distance with venue count for observed and randomly placed venues. Both show a strong negative relationship: more venues mean shorter distances. The observed and random patterns are nearly identical.</p>

    <div class="figure-row">
      <img src="${publicAsset('image/Geostat/geostat_nn_correlations.jpg')}" alt="Random vs observed mean nearest neighbour distance correlations" />
      <img src="${publicAsset('image/Geostat/geostat_nn_by_venue.jpg')}" alt="Random vs observed mean NN distance by venue type" />
    </div>

    <p>Interpretation: nearest-neighbour distance is strongly driven by venue abundance. Shorter distances do not, by themselves, indicate a meaningful crime–venue association. This method mainly demonstrates the bias that relative risk and KDE methods are designed to correct.</p>

    <p><strong>3. Relative risk analysis.</strong> Relative risk compares the proportion of violent crimes within fixed buffers around real venues against the proportion around randomly placed venues with identical counts, at distances of 50, 100, 200, 500 and 1,000 m.</p>

    <p>The line chart below shows how relative risk varies with distance for each venue type. Burger joints reach relative risk ≈ 8 at 100 m; fast food restaurants exceed 7 at 50 m. Indian restaurants and bars show the lowest short-distance risks, though still above 2. Risk generally declines as buffer distance increases, but remains elevated within ~200 m for several categories.</p>

    <img src="${publicAsset('image/Geostat/geostat_relative_risk_lines.jpg')}" alt="Relative risk of violent crime near venue types" />

    <p>The heat map below presents the same values in matrix form, highlighting how risk shifts between 50 m and 100 m buffers. Burger joints and bars show increasing risk from 50 to 100 m, while most other types decrease — making short-distance patterns easier to compare across venue categories.</p>

    <img src="${publicAsset('image/Geostat/geostat_relative_risk_heatmap.jpg')}" alt="Relative risk heat map for violent crime near venue types" />

    <p>Interpretation: violent crime is disproportionately concentrated near burger joints, fast food outlets and coffee shops at short distances, even after accounting for venue abundance. This contrasts with the cross-G-function and supports a localised attraction effect at neighbourhood scale.</p>

    <p><strong>4. Kernel density estimation and hotspot overlap.</strong> KDE converts point events into continuous density surfaces; Z-score standardisation highlights areas where concentration exceeds the city-wide mean (Z ≥ 1 = hotspot). Bandwidth was set to ≈ 257 m (Diggle’s cross-validation) to retain local detail.</p>

    <p>The maps below show violent-crime density before and after Z-score standardisation. Raw density reveals a strong central London concentration; standardisation preserves this core while making above-average zones directly comparable across the city.</p>

    <img src="${publicAsset('image/Geostat/geostat_violent_crime_kde.jpg')}" alt="Violent crime density raw and Z-score standardised" />

    <p>The overlap map below intersects violent-crime hotspots (Z ≥ 1) with each venue-type hotspot on a common grid. Coffee shops share the largest overlap (54.8%), followed by pubs (45.7%), burger joints (36.6%) and Indian restaurants (12.3%). Coffee shops and burger joints show compact central clusters; pubs show fragmented local peaks; Indian restaurants are more dispersed.</p>

    <img src="${publicAsset('image/Geostat/geostat_hotspot_overlap.jpg')}" alt="Hotspot overlap between venue types and violent crime" />

    <p>Interpretation: venue types with similarly central spatial structures show the highest hotspot overlap with violent crime. The degree of spatial coincidence varies strongly by venue type and urban form, not only by proximity.</p>

    <h3><strong>Part II – Hotspots, clustering and cumulative impact zones</strong></h3>

    <p><strong>1. Global spatial autocorrelation.</strong> Global Moran’s I tests whether ward-level crime and venue densities are more similar among neighbours than expected by chance, using queen contiguity and row-standardised weights.</p>

    <p>The figure below reports Moran’s I for both variables. Crime density shows strong positive clustering (I = 0.605); venue density also clusters significantly but more weakly (I = 0.323). Both p-values are highly significant, confirming that neither variable is spatially random at the ward level.</p>

    <img src="${publicAsset('image/Geostat/geostat_global_morans_i.jpg')}" alt="Global Moran's I for crime and venue density" />

    <p><strong>2. Local autocorrelation and hotspot detection.</strong> LISA and Getis–Ord Gi* decompose global clustering into ward-level patterns to identify where high and low values concentrate.</p>

    <p>The Moran scatterplot below plots each ward’s standardised crime density against its spatial lag (neighbourhood average). Most wards fall in the Low–Low quadrant; a substantial group occupies High–High, confirming that similar values cluster together rather than forming random scatter.</p>

    <img src="${publicAsset('image/Geostat/geostat_moran_scatterplot.jpg')}" alt="Moran scatterplot for ward-level crime density" />

    <p>The LISA cluster map below classifies wards into High–High, Low–Low and outlier categories. A significant High–High cluster occupies central London; Low–Low clusters dominate outer wards. Spatial outliers are limited to the margins of the central cluster.</p>

    <img src="${publicAsset('image/Geostat/geostat_lisa_cluster_map.jpg')}" alt="LISA cluster map for ward-level crime density" />

    <p>The Gi* maps below identify statistically significant hotspots (red) and coldspots (blue) for crime density and venue density separately. Crime shows a large contiguous central hotspot surrounded by peripheral coldspots. Venue density also shows significant hotspots centrally but without an equally strong peripheral coldspot ring.</p>

    <img src="${publicAsset('image/Geostat/geostat_getis_ord_gi.jpg')}" alt="Getis-Ord Gi hotspot and coldspot maps" />

    <p>The intersection map below overlays both Gi* results. A central core of wards is classified as dual hotspots (high crime and high venues). This core is surrounded by crime-only hotspot wards, showing that crime concentration extends beyond the densest nightlife areas.</p>

    <img src="${publicAsset('image/Geostat/geostat_getis_intersection.jpg')}" alt="Intersection of Getis-Ord Gi results for crime and venue density" />

    <p>The bivariate LISA map below tests whether each ward’s crime density is associated with neighbouring wards’ venue density. Significant High crime – High venue neighbours form a compact central cluster, indicating spillover effects that cross administrative boundaries — relevant for cumulative impact zone design.</p>

    <img src="${publicAsset('image/Geostat/geostat_bivariate_lisa.jpg')}" alt="Bivariate LISA for crime density versus neighbouring venue density" />

    <p><strong>3. Spatially constrained clustering.</strong> Ward typologies were built by combining attribute similarity (crime, venues, income, deprivation, PTAL, population, housing, age) with spatial proximity. k = 4 clusters and alpha = 0.3 were selected after diagnostic evaluation.</p>

    <p>The diagnostics below show the elbow curve flattening after k = 4 and silhouette width peaking at k = 2. Four clusters were retained because k = 2 would be too coarse for London’s heterogeneity. The alpha trade-off plot shows alpha = 0.3 as the compromise between attribute fit and spatial compactness.</p>

    <div class="figure-row">
      <img src="${publicAsset('image/Geostat/geostat_cluster_diagnostics.jpg')}" alt="Cluster number diagnostics (elbow and silhouette)" />
      <img src="${publicAsset('image/Geostat/geostat_alpha_tradeoff.jpg')}" alt="Trade-off between data fit and spatial compactness across alpha" />
    </div>

    <p>The comparison map below contrasts unconstrained clustering (left, alpha = 0) with spatially constrained clustering (right, alpha = 0.3). The unconstrained solution produces fragmented patches scattered across London; the constrained solution yields four contiguous zones suitable for policy interpretation.</p>

    <img src="${publicAsset('image/Geostat/geostat_clustering_comparison.jpg')}" alt="Unconstrained vs spatially constrained ward typologies" />

    <p>The PCA plot below shows how clusters separate along the main axes of variation. The first component (≈ 87% cumulative variance) represents an urban intensity gradient — crime, venues and PTAL — and clearly separates Cluster 4 (cumulative impact zone) from the three residential clusters.</p>

    <img src="${publicAsset('image/Geostat/geostat_pca_by_cluster.jpg')}" alt="Principal component score distributions by spatial cluster" />

    <p>The silhouette plot below validates cluster separation. Cluster 4 (cumulative impact zone) shows the strongest separation with mostly positive silhouette values; residential clusters show more overlap, reflecting greater internal heterogeneity.</p>

    <img src="${publicAsset('image/Geostat/geostat_silhouette_distribution.jpg')}" alt="Distribution of silhouette widths for each spatial cluster" />

    <p>The cluster profile heat map below summarises standardised mean values per cluster. Cluster 4 stands out with high Z-scores for crime density (~142 crimes/km²), venue density (~4.4 venues/km²) and PTAL (5.7). Cluster 1 is the affluent residential type (higher income, lower crime); Clusters 2 and 3 are quieter residential areas differing in accessibility and income.</p>

    <img src="${publicAsset('image/Geostat/geostat_cluster_profile_heatmap.jpg')}" alt="Cluster profile heat map of standardised ward variables" />

    <p><strong>4. Policy maps and socio-economic context.</strong> Cluster results were translated into policy-relevant classifications using crime–venue quadrants and Z-score thresholds.</p>

    <p>The scatter plot below places all wards in standardised crime–venue space coloured by policy label. The cumulative impact zone concentrates in the high crime – high venue quadrant; residential clusters occupy the low–low quadrant with some overlap between quieter residential types.</p>

    <img src="${publicAsset('image/Geostat/geostat_crime_venue_scatter.jpg')}" alt="London wards in standardised crime-venue space by policy classification" />

    <p>The quadrant map below shows the spatial expression of this classification. High crime – high venue wards form a compact central block; low crime – low venue wards dominate the periphery, matching the core–periphery structure identified by LISA and Gi*.</p>

    <img src="${publicAsset('image/Geostat/geostat_crime_venue_quadrants.jpg')}" alt="London wards classified into crime-venue quadrants" />

    <p>The policy label map below assigns each ward a policy category from spatially constrained clustering. The cumulative impact zone is strongly concentrated in central London, providing an evidence-based spatial unit for licensing restrictions rather than relying on borough boundaries alone.</p>

    <img src="${publicAsset('image/Geostat/geostat_policy_labels.jpg')}" alt="Policy label classification from spatially constrained clustering" />

    <p>The priority zone map below highlights wards exceeding Z-score thresholds on crime, venues or both — the wards with the most urgent need for intervention. These priority wards coincide with the cumulative impact zone core identified across all Part II methods.</p>

    <img src="${publicAsset('image/Geostat/geostat_policy_priority_zones.jpg')}" alt="Policy priority zones based on Z-score thresholds" />

    <h3><strong>Part III – PM2.5 spatial regression and interpolation</strong></h3>

    <p><strong>1. Exploratory pattern and predictor screening.</strong> Ward-level PM2.5 was mapped and correlated with socio-economic variables to identify predictors of urban pollution intensity.</p>

    <p>The ward map below shows area-weighted mean PM2.5 per ward. Concentrations are highest in central London and decline towards the periphery, with a few elevated wards in western outer London — indicating spatial structure that violates the independence assumption of standard regression.</p>

    <img src="${publicAsset('image/Geostat/geostat_pm25_by_ward.jpg')}" alt="Average PM2.5 concentration per ward" />

    <p>The bar chart below ranks the ten predictors with the strongest absolute correlation to log(PM2.5 + 1). Public transport accessibility and population density correlate most strongly (positive); cars per household, open space and owner-occupied households correlate most strongly (negative). These variables act as proxies for urban intensity versus lower-density residential areas.</p>

    <img src="${publicAsset('image/Geostat/geostat_pm25_predictors.jpg')}" alt="Top predictors of log PM2.5 by absolute correlation" />

    <p><strong>2. Spatial regression comparison.</strong> Linear, spatial lag and spatial error models were fitted on queen-contiguity weights. The spatial error model achieved the lowest AIC and reduced residual Moran’s I to ≈ 0 (non-significant), indicating that spatially structured omitted variables best explain remaining dependence. Spatial parameters were ρ = 0.532 (lag) and λ = 0.638 (error).</p>

    <p>The diagnostic panels below show residual distributions and observed-versus-fitted plots for each model. The linear model displays the widest residual spread and largest deviations from the 1:1 line at high PM2.5 values. Both spatial models concentrate residuals closer to zero; the error model shows the tightest fit.</p>

    <img src="${publicAsset('image/Geostat/geostat_lm_residual_diagnostics.jpg')}" alt="Residual diagnostics for the linear model" />

    <img src="${publicAsset('image/Geostat/geostat_lag_residual_diagnostics.jpg')}" alt="Residual diagnostics for the spatial lag model" />

    <img src="${publicAsset('image/Geostat/geostat_error_residual_diagnostics.jpg')}" alt="Residual diagnostics for the spatial error model" />

    <p>The prediction maps below compare observed PM2.5 with fitted values from all three models. All reproduce the central hotspot, but the linear model smooths the range most strongly — underestimating peak values and overestimating low ones. The spatial error model tracks observed values most closely across central and peripheral wards.</p>

    <img src="${publicAsset('image/Geostat/geostat_observed_vs_predicted_maps.jpg')}" alt="Observed vs prediction maps for linear, lag and error models" />

    <p>The residual maps below show where each model under- or over-predicts spatially. All three share broadly similar patterns: positive residuals in western peripheral wards (persistent underprediction) and local contrasts in southern London that the spatial models partially reduce. No single large residual hotspot dominates, suggesting misfit is locally scattered.</p>

    <img src="${publicAsset('image/Geostat/geostat_residual_maps_linear_lag_error.jpg')}" alt="Residual maps for linear, lag and error models" />

    <p>Interpretation: spatial regression improves in-sample fit and removes residual autocorrelation, especially with the error specification. However, spatial block cross-validation shows only modest predictive gains over OLS — the main benefit is explanatory rather than predictive.</p>

    <p><strong>3. Geostatistical interpolation.</strong> Regression kriging (with linear mixed-effects trend, R² = 0.711), ordinary kriging, cokriging with NOx and IDW were applied on a 50 m grid and evaluated with 10-fold cross-validation.</p>

    <p>The comparison panel below shows diagnostic differences between the standard linear trend and the linear mixed-effects trend used in regression kriging. The LME concentrates residuals closer to zero and reduces overprediction at both low and high observed values, justifying its use as the deterministic component before kriging residuals.</p>

    <img src="${publicAsset('image/Geostat/geostat_lm_vs_lme_diagnostics.jpg')}" alt="Linear model vs linear mixed effects model diagnostics" />

    <p>The residual variogram below characterises spatial dependence in the regression residuals. Semivariance increases at short distances and plateaus at ≈ 4–5 km (nugget ≈ 0.016, sill ≈ 0.029), confirming that the regression trend alone does not remove all spatial structure and that residual kriging is justified.</p>

    <img src="${publicAsset('image/Geostat/geostat_rk_variogram.jpg')}" alt="Residual variogram for regression kriging" />

    <p>The four-panel map below compares interpolated PM2.5 surfaces from regression kriging, ordinary kriging, cokriging and IDW. All reproduce the central-to-peripheral gradient. The three kriging methods produce smooth, broadly similar surfaces; IDW is more patchy with isolated high-value spots and a sharply contained central zone. A western London elevation appears in all methods and is most pronounced in cokriging (which uses NOx as secondary variable).</p>

    <img src="${publicAsset('image/Geostat/geostat_pm25_interpolation_surfaces.jpg')}" alt="Interpolated PM2.5 surfaces for all methods" />

    <p>The metrics chart below summarises 10-fold cross-validation performance. Ordinary kriging achieves the lowest RMSE (0.189) and highest R² (0.588); regression kriging is nearly identical; cokriging is slightly weaker; IDW performs worst (RMSE 0.202, positive bias 0.024). The three kriging methods are effectively equivalent; IDW compresses the prediction range.</p>

    <img src="${publicAsset('image/Geostat/geostat_cv_metrics.jpg')}" alt="Cross-validation performance metrics for all interpolation methods" />

    <p>The scatter plots below show observed versus predicted values from cross-validation for each method. Kriging-based methods follow the 1:1 line closely with similar point clouds; IDW shows wider spread, overestimating low values and underestimating high values — consistent with its weaker metrics.</p>

    <img src="${publicAsset('image/Geostat/geostat_cv_observed_vs_predicted.jpg')}" alt="Observed vs predicted by interpolation method" />

    <p>The boxplots below compare cross-validation residual distributions. Kriging methods produce residuals centred near zero with similar spread; IDW shows a broader distribution, confirming its inferior and less stable predictive behaviour.</p>

    <img src="${publicAsset('image/Geostat/geostat_cv_residual_distributions.jpg')}" alt="Cross-validation residual distributions by interpolation method" />

    <p>Interpretation: all interpolation methods capture London’s main PM2.5 gradient, but kriging-based approaches outperform IDW. Regression kriging adds socio-economic context through the LME trend, while ordinary kriging achieves marginally best cross-validation scores. Together with Part III’s spatial regression, the results show that PM2.5 in London is spatially structured, linked to urban intensity proxies, and best modelled with methods that explicitly account for spatial dependence.</p>`,

    conclusion: `<p>This project demonstrates how multiple geostatistical approaches can be combined to analyse urban spatial processes in London at complementary scales. Part I shows that crime–venue relationships are method- and scale-dependent: global cross-G-functions suggest repulsion, whereas relative risk and KDE hotspot overlap reveal strong local associations for burger joints, fast food outlets, coffee shops and pubs in central London.</p>

    <p>Part II translates these patterns into policy-relevant areal structures. Hotspot analysis, bivariate LISA and spatially constrained clustering consistently identify a compact central cumulative impact zone where crime density, nightlife venue density and accessibility coincide. This supports evidence-based delineation of cumulative impact zones rather than relying on administrative boundaries alone.</p>

    <p>Part III shows that ward-level PM2.5 in London is spatially structured and linked to proxies of urban intensity. Spatial error regression removes residual autocorrelation most effectively, while regression kriging and comparative interpolation methods provide continuous pollution surfaces for mapping and validation. Together, the three parts offer an integrated view of how crime, urban activity and environmental exposure vary across Greater London, while emphasising that the results indicate spatial association rather than causality.</p>

    <p>Future work could extend the analysis with longer temporal coverage, time-of-day information, footfall or policing data, and multivariate models that jointly account for crime, venue activity and environmental covariates.</p>`
  },

];
