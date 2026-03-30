import { Project } from '../types';

export const projects: Project[] = [
  // Trend analysis of NDVI data and syndrom approach of NDVI data for Europe (1982-2022)
  {
    id: 1,
    title: "Trend analysis of NDVI data and syndrom approach of NDVI data for Europe (1982-2022)",
    category: "GIS",
    description: "Seasonal Mann–Kendall NDVI trends, syndrome mapping, and lagged rainfall–biomass analysis for Europe (1982-2022).",
    tools: ["Rstudio", "QGIS"],
    image: "/image/Europe.jpeg", 
    location: "Europe",
    coordinates: [51.1657, 10.4515],
    detailPage: "/data/ndvi-europe-1982-2022",
    downloadEnabled: false,
    download: "/files/Portfolio_V3.pdf",
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
    
     <img src="/image/correlationLC.jpg" alt="correlation between NDVI and land-cover" /> 
     <p><b>4. Spatial analysis and mapping</b></p>
     <p>The resulting trend and syndrome classes were mapped and analyzed spatially to reveal regional patterns of vegetation change across Europe and their relationship with land-use characteristics.</p>
     <p>All analyses were conducted using R for time-series processing and statistical analysis, combined with GIS tools (QGIS) for spatial analysis and visualization.</p>`,
    
     keyFindings: `<ul>
    <p>
    The analysis of NDVI time series from 1982 to 2022 shows an overall greening trend across large parts of Europe, indicating 
    increasing vegetation productivity over time. However, this general pattern masks strong regional contrasts, with localized browning 
    or stagnation observed in specific areas, particularly in regions under intense land-use pressure or environmental stress.
    </p>
    <p>
    Particularly, the predominant green color across the map indicates positive tau values for most regions, suggesting an overall improvement in 
    vegetation health over the study period. This is consistent with the "greening trend" hypothesis, which states that areas experience an increase in
     vegetation cover and density. If to consider specific regions, we can see that some of them, particularly in Southern, Central and Western Europe, 
     show stronger positive tau values (darker green), indicating more significant improvements in vegetation health. Conversely, some regions, especially 
     in Norway, Ireland, Switzerland, and Eastern Europe, show areas with tau values close to zero or slightly negative (yellow to red), suggesting weaker 
     trends or potential deterioration of vegetation health.
    </p>
     <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
       <img src="/image/TAU_europe.jpg" alt="NDVI trends" style="flex: 1; max-width: 50%;" /> 
       <img src="/image/Pvalue_europe.jpg" style="flex: 1; max-width: 50%;" /> 
     </div>

     <p>
    Overall, we can confirm the "greening trend" in vegetation health across Europe over the last four decades, with some regional exceptions.
    The p-value map hows the statistical significance of the trends identified by the tau map. Areas with low p-values (shades of red/pink) 
    indicate statistically significant trends, whereas areas with high p-values (shades of green) indicate non-significant trends
    The dark blue areas on the p-value map, corresponding to significant p-values, enhance the confidence of the positive trends observed on the tau map.
    </p>
    <p>
    The yellow areas indicate trends that are not statistically significant, suggesting that the observed changes in NDVI in these regions could be due to
    random variability rather than a consistent trend. These non-significant areas are scattered across manly Eastern Europe, the British Isles, and 
    Northern countries.
    </p>
    <p>
    the "greening trend" hypothesis using the regression coefficient from the Seasonal Mann-Kendall test is confirmed over 40 years by the increase in NDVI from 0 to a maximum of 10% across Europe. 
    This observation indicates that the increase in NDVI between 1989 and 2022 was not very significant but confirms the hypothesis of greening trend 
    across Europe. Nevertheless, we note that some parts of Europe, especially the Northern part, show a negative change in NDVI between 0 and 10% loss. 
    </p>
    <img src="/image/changeNDVI.jpg" />
     <p>
     By applying a syndrome approach, the study distinguishes multiple vegetation change patterns beyond simple greening or browning. 
     These syndromes capture differences in productivity levels, seasonal dynamics, and trend direction, revealing spatially coherent regions with 
     similar vegetation behavior.This classification highlights that areas with similar overall trends may still differ substantially in their 
     seasonality or productivity structure, emphasizing the importance of multi-dimensional analysis.
     </p>
     <img src="/image/syndromtype.jpg" />
     </p>

     <p>
     It visually appears that "Increasing biomass" and "Increasing productivity" are the most dominant and significant syndrome, 
     indicating an increase in vegetation in many regions. Both dominant syndromes are relatively proportionally distributed across Europe, 
     with a predominance of increasing biomass in Sweden. 
     </p>
     <p>
     "Increasing biomass" is the most dominant and significant syndrome representing 52% of NDVI trend between 1982-2022, indicating increased biomass 
     in many regions. “Increasing productivity” represented 21.74% of NDVI trend between 1982-2022, the syndrome showing increased productivity in 
     agricultural areas. Further, "No change" and "Changing crop" are slightly less frequent syndromes representing respectively 13.67% and 7.06% of 
     NDVI trend between 1982-2022. Thus, a significant number of areas, notably the UK, Norway, Lithuania, Bosnia and Herzegovina, and Italy, show no 
     significant change. "Decreasing biomass", "Decreasing productivity", "Increasing irrigation", and "Decreasing irrigation" are the rarest syndromes 
     representing less than 2% of NDVI trend between 1982-2022, implying localized occurrences of these phenomena.
     </p>
     <img src="/image/sydromproportionin NDVI.jpg" /> 
     </ul>`,
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
    image: "/image/poster.jpeg",
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
    
    <img src="/image/sentinel-02.jpg" alt="Bandes spectrales Sentinel-2" />
  
    <p>L’identification du dépérissement s’est appuyée sur une analyse diachronique et une détection de changements entre 2016 et 2022. L’indice de végétation NDVI a été calculé afin d’évaluer l’activité photosynthétique, tandis que l’indice NDMI a permis d’estimer le stress hydrique des peuplements forestiers.</p>
  
    <p>Les zones de dégradation ont été isolées après exclusion des surfaces affectées par les incendies et des parcelles en régénération, afin de ne conserver que les zones réellement associées au dépérissement. Par la suite, des analyses statistiques (corrélation de Pearson et ANOVA) ont été réalisées pour évaluer l’influence de variables environnementales telles que le type de sol, la température, le stress hydrique et l’exposition au soleil.</p>
  
    <p>Enfin, un modèle prédictif exploratoire a été développé sous QGIS à l’aide du plugin MOLUSCE. Basé sur un réseau neuronal artificiel, ce modèle a permis de simuler l’évolution potentielle du dépérissement à l’horizon 2028 en intégrant les variables biophysiques significatives.</p>
  
    <img src="/image/molusce.jpg" alt="Modélisation MOLUSCE" />`,
  
    keyFindings: `<ul>
    <p>Les résultats montrent une augmentation significative de la dégradation du massif forestier de Fontainebleau entre 2016 et 2022. Cette dégradation a progressé de <strong>20,2%</strong>, affectant à la fois les peuplements feuillus et résineux. Le dépérissement représente à lui seul <strong>81,3% de cette dégradation</strong>, soit environ <strong>16,4% de la superficie totale du massif</strong>.</p>
  
    <img src="/image/Fontaine_change.jpg" alt="Cartographie du dépérissement" />
    
    <p>L’analyse spatiale met en évidence une distribution hétérogène du dépérissement, fortement liée aux caractéristiques environnementales. Les zones les plus affectées correspondent majoritairement à des secteurs présentant une faible réserve utile en eau et une forte contrainte hydrique.</p>
  
    <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
      <img src="/image/NDVI_change.jpg" alt="NDVI évolution" style="flex: 1; max-width: 50%;" />
      <img src="/image/Fontainebleau stressHyd.jpg" alt="NDMI stress hydrique" style="flex: 1; max-width: 50%;" />
    </div>
  
    <p>Les analyses statistiques confirment que le dépérissement est fortement corrélé à plusieurs facteurs : le type de sol (notamment les sols sableux), le stress hydrique et la température. Ces résultats soulignent le rôle majeur du changement climatique dans la dynamique observée.</p>
  
    <p>La modélisation prospective réalisée avec MOLUSCE indique une tendance à l’aggravation du phénomène, avec une augmentation estimée de <strong>59,1% des surfaces en dépérissement à l’horizon 2028</strong>. Bien que ce modèle reste exploratoire, il met en évidence la nécessité d’une gestion forestière proactive.</p>
  
    <img src="/image/deperissement_predit.jpg" alt="Projection du dépérissement" />
  
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
    image: "/image/Hunsruck/poster.jpeg",
    location: "Hunsrück-Hochwald National Park, Germany",
    coordinates: [49.7, 7.1],
    detailPage: "/data/forest-disturbance-monitoring-hunsruck-hochwald-national-park",
    downloadEnabled: false,
    download: "projectdoc/FRS_portfolio_s6kanimp_1734880_s6pachri_1506810.pdf",
  
    contextAndIntroduction: `<p>Forests are essential for biodiversity conservation, climate regulation, and the delivery of ecosystem services across Central Europe. However, conifer-dominated forests are increasingly threatened by climate-induced stress and bark beetle outbreaks. In particular, the European spruce bark beetle has become one of the major disturbance agents affecting Norway spruce stands, often triggering rapid canopy decline, red needle discoloration, and tree mortality.</p>
  
    <p>The Hunsrück-Hochwald National Park (HHNP), located in southwestern Germany, provides a relevant case study for investigating these dynamics. The park covers approximately 102 km² and is heavily forested, with a substantial proportion of conifer stands resulting from historical land use and forestry (plantation). Recent drought conditions and rising temperatures have increased the vulnerability of these forests, thereby amplifying bark beetle infestations and associated forest decline.</p>
    
    <img src="/image/Hunsruck/Overview.jpg" alt="Hunsrück-Hochwald National Park overview" /> 

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
  
    <img src="/image/Hunsruck/forest_non_forest.jpg" alt="Forest / Non-Forest map for HHNP" />
  
    <p><strong>3. Forest type classification and validation</strong></p>
    <p>The Random Forest models successfully separated deciduous and coniferous forests, with improved performance when topographic information was added. Case 1 (spectral bands only) achieved an overall accuracy of <strong>81.31 ± 2.73%</strong>, while case 2 (spectral bands + DEM) reached <strong>84.34 ± 2.52%</strong>. In both cases, the deciduous class performed better than the coniferous class, but the inclusion of DEM improved the producer’s accuracy of conifers from <strong>63.23 ± 4.84%</strong> to <strong>69.49 ± 5.16%</strong>.</p>
  
    <p>Adjusted area estimates further show that case 2 produced a slightly lower but more reliable conifer area estimate: <strong>66.05 ± 22.20 km²</strong>, compared with <strong>71.51 ± 23.99 km²</strong> in case 1. This suggests that topographic information improved the ecological realism of the forest type classification.</p>
  
    <img src="/image/Hunsruck/Forest_type.jpg" alt="Forest type maps for HHNP, case 1 and case 2" />
  
    <p><strong>4. NDVI vs PVI sensitivity</strong></p>
    <p>The comparison of vegetation indices revealed that NDVI suffers from saturation around values of approximately 0.7, especially in deciduous forests under dense canopy conditions. By contrast, PVI remained responsive across the observed range and did not show a pseudo-plateau. This indicates that PVI is more sensitive than NDVI for detecting subtle vegetation changes in dense forest systems.</p>
  
    <img src="/image/Hunsruck/NDVI_PVI_sensitivity.jpg" alt="Scatterplot comparing NDVI and PVI sensitivity" />
  
    <p><strong>5. Spatial pattern of forest disturbance</strong></p>
    <p>The disturbance maps revealed canopy loss primarily in the <strong>southwestern and northeastern sectors</strong> of the park. Across both products, the “no change” class dominated, but the PVI-based map displayed more areas classified as “slight loss” than the NDVI-based map. Close-up visual comparison with Sentinel-2 true-colour composites confirmed that both products detected disturbance reasonably well, although some visually identifiable conifer stands were not fully captured due to classification uncertainties in the upstream conifer mask.</p>
  
    <img src="/image/Hunsruck/Forest_loss.jpg" alt="Forest loss based on NDVI / PVI" />
    
  
    <p><strong>6. Field-based health assessment</strong></p>
    <p>A total of <strong>196 survey points</strong> were collected, including <strong>140 conifer observations</strong>. Among these conifer points, <strong>56</strong> were classified as dead standing trees, <strong>33</strong> as healthy, <strong>38</strong> as moderately damaged, and <strong>13</strong> as severely damaged. These observations indicate that dead and damaged conifers dominate the sampled areas, reflecting strong ecological impacts of bark beetle infestation.</p>
  
    <img src="/image/Hunsruck/Forest_health.jpg" alt="Health status of conifer survey plots in HHNP" />
  
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
    image: "/image/PNMD/poster.jpg",
    location: "Parc National du Mbam et Djerem, Cameroun",
    coordinates: [5.96, 12.88],
    detailPage: "/data/impact-activites-anthropiques-pnmd",
    downloadEnabled: false,
    download: "projectdoc/PNMD_project.pdf",
  
    contextAndIntroduction: `<p>Le Parc National du Mbam et Djerem (PNMD), situé au centre du Cameroun, constitue une zone de transition écologique majeure entre les savanes soudaniennes et les forêts tropicales humides. Cette position confère au parc une richesse biologique exceptionnelle, mais également une forte vulnérabilité face aux pressions anthropiques croissantes.</p>
  
    <img src="/image/PNMD/Location_PNMD.jpg" alt="Localisation du Parc National du Mbam et Djerem" />
  
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
  
    <img src="/image/PNMD/survey.jpg" alt="Enquêtes de terrain auprès des populations locales" />

    <p><strong>3. Analyse de la faune</strong></p>
    <p>L’étude a également intégré des observations qualitatives sur la faune au moyen d'un Inventaire Faunique par transects. Il a notamment été question d'identifier les signes de presence de la faune (traces de pas, déjections, etc.) sur des transects predefinis, des signes de disparition de la faune, la modification des habitats et des corridors écologiques, afin d’évaluer les conséquences indirectes des changements du couvert forestier sur la faune. Cette analyse a été suivant le calcul d'indice kilometrique d'abondance de la faune (IKA).</p>
    <p>C'est une méthode permettant de mesurer une abondance relative des espèces le long d’une distance parcourue. Elle a été développée en 1958 par Ferry et Frochot et permet dans un milieu homogène, d’obtenir l’abondance par kilomètre pour chacune des espèces rencontrées.</p>
    <img src="/image/PNMD/IKA.jpg" alt="Enquêtes de terrain auprès des populations locales" />
    <p>Les résultats de l'IKA ont été analysés pour identifier les espèces les plus affectées par les changements du couvert forestier. Les espèces les plus fréquentes ont été identifiées et les changements d'abondance ont été quantifiés grace au cartes d'interpolation des IKA.</p>`,
  
    
    keyFindings: `<ul>
  
    <p><strong>1. Dynamique globale du couvert forestier.</strong></p>
    <p>Les résultats montrent une augmentation globale du couvert forestier d’environ <strong>12%</strong> entre 2000 et 2020. Toutefois, cette évolution masque une transformation structurelle importante du paysage.</p>
  
    <img src="/image/PNMD/pnmd_change_map.jpg" alt="Carte des changements du couvert forestier" />
  
    <p>Malgré l’augmentation globale, les forêts denses ont diminué à un rythme moyen de <strong> 0,36% par an</strong>, au profit de formations forestières dégradées et de zones ouvertes. Cette tendance traduit une dégradation qualitative plutôt qu’une déforestation nette.</p>
    <img src="/image/PNMD/change_stat.jpg" alt="Carte des changements du couvert forestier" />

    <p>Les pertes forestières sont spatialement concentrées, notamment dans la périphérie est du parc, où l’expansion agricole est la plus marquée.</p>
  
    <img src="/image/PNMD/change_detect.jpg" alt="detection des changements du couvert forestier" />
    
  
    <p><strong>2. Identification des facteurs anthropiques.</strong></p>
    <p>Les enquêtes socio-économiques révèlent que <strong>54 % des populations interrogées</strong> identifient l’expansion agricole comme le principal moteur de la déforestation dans la périphérie du Parc National du Mbam et Djerem. D’autres activités anthropiques contribuent également de manière significative à la pression sur les écosystèmes, notamment la chasse, la pêche, la transhumance et l’exploitation du bois.</p>

    <p>Les modifications du couvert forestier observées à partir des analyses spatiales se traduisent par une <strong>fragmentation accrue des habitats</strong>, entraînant une reconfiguration des aires de distribution de la faune et une augmentation des pressions sur certaines espèces. Ces dynamiques favorisent une perturbation des corridors écologiques et peuvent compromettre la viabilité à long terme des populations animales.</p>

    <img src="/image/PNMD/chasse.jpg" alt="especes chassées" />

    <p>Les données issues des enquêtes indiquent que les espèces les plus recherchées par les chasseurs sont principalement des ongulés et des espèces de taille moyenne à grande. Le sanglier et le potamochère sont chassés par <strong>52 % des chasseurs interrogés</strong>, suivis du hérisson (<strong>48 %</strong>) et du léopard (<strong>47 %</strong>). Par ailleurs, les registres de chasse mettent en évidence la pression exercée sur plusieurs espèces protégées, notamment le pangolin (<strong>28 %</strong> des chasseurs), les céphalophes à dos jaune (<strong>13 %</strong>), les bongos (<strong>3 %</strong>), les chimpanzés (<strong>2 %</strong>) et les buffles (<strong>1 %</strong>). Ces résultats témoignent d’une exploitation faunique étendue, incluant des espèces à forte valeur de conservation.</p>

    <img src="/image/PNMD/IKA_analyse.jpg" alt="analyse des IKA des espèces" />

    <p>L’analyse des indices kilométriques d’abondance (IKA) le long des transects montre que les traces de <strong>bushbuck</strong> sont les plus fréquentes, avec un IKA de <strong>1 ± 0,99</strong>, suivies par celles du céphalophe à rayures noires (<strong>0,917 ± 1,02</strong>). À l’inverse, plusieurs espèces présentent de faibles niveaux de détection, notamment le sitatunga, le céphalophe des buissons, le céphalophe bleu, le sanglier, le potamochère et le céphalophe à dos jaune, avec des valeurs d’IKA de <strong>0,083 ± 0,21</strong>. Ces résultats suggèrent soit une faible densité de ces espèces, soit une pression anthropique élevée limitant leur présence observable.</p>

    <img src="/image/PNMD/interpolation.jpg" alt="analyse des IKA des espèces" />

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
    image: "/image/wildboars/poster.jpg",
    location: "Ruwer Valley, Germany",
    coordinates: [49.75, 6.75],
    detailPage: "/data/conflict-vineyards-wildboars-ruwer",
    downloadEnabled: false,
    download: "projectdoc/ruwer_wildboar.pdf",
  
    contextAndIntroduction: `<p>In a global context of habitat fragmentation and increasing agricultural pressure, human–wildlife conflicts have become a major challenge for landscape management. In Europe, wild boar (<i>Sus scrofa</i>) populations have significantly increased over the past decades, leading to intensified damage to agricultural systems, particularly vineyards.</p>
  
    <p>The Ruwer Valley, located in Rhineland-Palatinate (Germany), represents a typical socio-ecological system where vineyards, forests, and urban areas coexist. This spatial configuration promotes strong interactions between natural habitats and cultivated land, making vineyards especially vulnerable to wild boar incursions.</p>
  
    <img src="/image/wildboars/Overview.jpg" alt="Study area location (Figure 1)" />
  
    <p>The objective of this study is twofold: (1) to identify environmentally suitable areas for vineyard establishment, and (2) to assess the spatial risk of wild boar damage using a GIS-based cost distance modeling approach. The underlying hypothesis is that certain vineyard areas may be abandoned due to increased pressure from wildlife.</p>`,
  
    methodology: `<p>The methodology is based on an integrated GIS framework combining multi-criteria analysis, spatial simulation, and ecological connectivity modeling.</p>
  
    <p><strong>1. Vineyard suitability modeling.</strong></p>
    <p>A suitability model was developed using a Digital Elevation Model (25 m resolution) to derive key topographic variables: slope, aspect, and elevation. Suitable areas were defined based on the following thresholds: slope between 10% and 25%, south-east to south-west orientation, and elevation below 260 m.</p>
  
    <img src="/image/wildboars/solar.jpg" alt="solar radiation analysis" />
    <p>Additionally, a solar radiation analysis (direct and diffuse) was performed for the growing season (March–October). Areas receiving between 1800 and 2000 hours of sunlight were considered optimal for vineyard development.</p>
  
    <img src="/image/wildboars/vineyard_model.jpg" alt="Vineyard suitability model (Figure 2)" />
  
    <p>Forest habitats were extracted from the Corine Land Cover dataset and transformed into core forest areas using a negative buffer. The number of wild boars was estimated using a density of 0.05 individuals per hectare, and spatially simulated using random point generation to represent initial animal locations.</p>
  
    <img src="/image/wildboars/boar_model.jpg" alt="Virtual boar model (Figure 3)" />
  
    <p><strong>2. Cost surface construction and analysis .</strong></p>
    <p>A friction (cost) surface was created by combining three main variables: land cover (weight = 0.6), slope (0.25), and road network (0.15). Each variable was reclassified on a scale from 1 (low resistance) to 5 (high resistance), reflecting the likelihood of wild boar movement across different landscape features.</p>
  
    <img src="/image/wildboars/cost_surface.jpg" alt="Cost surface (Figure 8)" />
  
    <p>The <i>cost distance</i> tool was applied to model optimal movement paths of wild boars toward vineyards. Vineyards were used as destination sources, ensuring that each simulated animal was connected to the nearest accessible vineyard via least-cost paths.</p>
  
    <p>Vineyard polygons smaller than 0.5 ha were excluded to avoid biases related to non-representative spatial units, thereby improving the robustness of the analysis.</p>`,
  
    keyFindings: `<ul>
  
    <p><strong>1. Spatial distribution of suitable vineyards.</strong></p> 
    <p>Suitable vineyard areas are predominantly located in the northern part of the study area, particularly in low-altitude valley zones. In contrast, southern areas show limited suitability due to higher elevation and steeper slopes.</p>
  
    <img src="/image/wildboars/vineyards_map.jpg" alt="Vineyard distribution (Figure 5)" />
  
    <p>Most identified vineyards are relatively small (&lt; 2 ha), while only 15 parcels exceed 10 ha, with a maximum size of 30 ha. This fragmentation plays a key role in vulnerability to wildlife damage.</p>
 
    <p>Simulated wild boar populations are mainly concentrated in southern forested areas. Due to the scarcity of vineyards in this region, individuals tend to migrate toward central and northern vineyards, often over long distances.</p>
  
    <img src="/image/wildboars/boar_paths.jpg" alt="Wild boar movement paths (Figure 6)" />
  
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
    image: "/image/GeoForest/poster.jpg",
    location: "Cameroon",
    coordinates: [3.8667, 11.5167],
    detailPage: "/data/web-gis-geoforest-cameroon",
    downloadEnabled: true,
    download: "projectdoc/Karel_Nimpa_1734880_Geospatial_Applications.pdf",
    video: "/image/GeoForest/Geoforest.mp4",
  
    contextAndIntroduction: `<p>The rapid evolution of web technologies has significantly transformed the way geospatial data is accessed, analyzed, and shared. Traditional desktop GIS systems, while powerful, require installation and are limited in accessibility. In contrast, Web GIS enables real-time visualization and interaction with spatial data directly through web browsers, making geospatial information accessible to a wider audience.</p>
  
    <p>Web GIS integrates geographic information systems with web-based architectures, allowing users to visualize, query, and analyze spatial data without requiring specialized software :contentReference[oaicite:0]{index=0}. This paradigm shift has become essential for decision-making in environmental management and land-use planning.</p>
  
    <img src="/image/GeoForest/webgis_architecture2.jpg" alt="Web GIS architecture (client-server model)" />
  
    <p>In this context, the GeoForest Cameroon platform was developed as a Web GIS application designed to support forest management. The system enables visualization and exploration of different forest categories (protected areas, managed forests, hunting zones) and provides an interactive environment for accessing spatial information relevant to forest administration.</p>`,
  
    methodology: `<p>The development of the GeoForest platform follows a classical three-tier Web GIS architecture, integrating front-end, back-end logic, and geospatial data services.</p>
  
    <p><strong>1. Web GIS architecture.</strong></p>
    <p>The system is based on a client–server model where the client (browser) interacts with a web server and a cartographic server. The cartographic server processes spatial data and returns map outputs (WMS/WFS or GeoJSON), while the database stores geospatial information.</p>
  
    <img src="/image/GeoForest/webgis_architecture.jpg" alt="Web GIS architecture (client-server model)" />
  
    <p>The user interface was developed using HTML, CSS (W3.CSS), and JavaScript. JavaScript handles interactivity through DOM manipulation, event handling (click, hover), and dynamic content rendering. jQuery and AJAX were used to load spatial data asynchronously without reloading the page.</p>
  
    <img src="/image/GeoForest/frontend_structure.jpg" alt="Front-end structure (HTML, CSS, JS)" />
  
    <p> The interactive map was implemented using Leaflet.js, allowing visualization of multiple basemaps (OpenStreetMap, satellite, topographic). Turf.js was used for spatial operations such as masking selected regions and performing geometric processing.</p>
  
    <img src="/image/GeoForest/leaflet_map.jpg" alt="Interactive map interface" />
  
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
  
    <img src="/image/GeoForest/layer_panel.jpg" alt="Layer management panel" />
  
    <p>The application integrates interactive components such as clickable features, automatic zooming to selected regions, and embedded forms (contact and help forms) to enhance usability.</p>`,
  
    keyFindings: `<ul>
  
    <p> The GeoForest system successfully demonstrates the implementation of a fully functional Web GIS platform capable of visualizing and managing forest data in real time.</p>
  
    <img src="/image/GeoForest/geoforest_interface.jpg" alt="GeoForest interface" />
  
    <p> The use of Leaflet and GeoJSON enables fast and efficient rendering of spatial layers, even with multiple thematic datasets.</p>
  
    <p> The integration of AJAX and JavaScript allows seamless interaction without page reload, significantly improving user experience. Users can dynamically switch layers, query features, and explore spatial data.</p>
  
    <img src="/image/GeoForest/popup_example.jpg" alt="Example of popup information" />
  
    <p> The masking functionality focuses the analysis on selected regions, improving readability and reducing visual complexity. The platform provides a clear overview of forest categories and their spatial distribution, supporting administrative decision-making processes.The modular architecture allows easy integration of additional datasets, functionalities, or analytical tools in future developments.</p>
  
    </ul>`,
  
    conclusion: `<p>This project demonstrates the potential of Web GIS technologies for developing interactive and accessible geospatial applications. By combining modern web development tools with GIS capabilities, the GeoForest platform provides an efficient solution for forest data visualization and management.</p>
  
    <p>The integration of client-side interactivity, dynamic data loading, and spatial analysis highlights the advantages of Web GIS over traditional desktop GIS systems, particularly in terms of accessibility and scalability.</p>
  
    <p>Future improvements could include the integration of a spatial database (PostgreSQL/PostGIS), user authentication systems, real-time data updates, and advanced analytical tools.</p>
  
    <p>This project illustrates the growing importance of web-based geospatial technologies in environmental management and decision-making.</p>`
  },

  {
    id: 7,
    title: "UAV Multispectral & Hyperspectral Analysis for 3D Terrain Modeling and Nitrogen Estimation in Precision Agriculture",
    category: "Remote Sensing",
    description: "Advanced UAV-based workflow integrating photogrammetry and hyperspectral analysis to generate high-resolution terrain models and estimate crop nitrogen variability for precision fertilization",
    tools: ["Agisoft Metashape", "ENVI", "R", "QGIS"],
    image: "/image/UAV/poster.jpg",
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
  
    <img src="/image/UAV/point_cloud.jpg" alt="Dense point cloud" />
  
    <h3><strong>3. Hyperspectral UAV Analysis (Potato Field)</strong></h3>
  
    <p>Hyperspectral data were acquired using the <strong>Gamaya OXI sensor</strong> (~40 spectral bands). Processing workflow:</p>
    <ul>
      <li>Georeferencing (WGS84 UTM Zone 31N)</li>
      <li>Spatial subsetting to experimental plots</li>
      <li>Band calibration using official wavelength definitions</li>
    </ul>
  
    <h3><strong>4. Radiometric Calibration (ELC)</strong></h3>
  
    <p>Calibration was performed using <strong>Empirical Line Correction (ELC)</strong> with 9 reference panels measured by an ASD spectrometer.</p>
  
    <img src="/image/UAV/calibration_plot.jpg" alt="Calibration accuracy" />
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
      
    <img src="/image/UAV/VI.jpg" alt="Calibration accuracy" />
    <p>A vegetation mask (NDVI ≥ 0.6) was applied to isolate canopy pixels.</p>

    <img src="/image/UAV/mask.jpg" alt="mask" />
  
    <p>Regression analysis linked spectral indices with field-measured nitrogen content.</p>`,
  
    keyFindings: `<h3>Photogrammetry Results</h3>
  
    <ul>
      <li>High-density point cloud (~10.8M points) capturing fine vegetation patterns</li>
      <li>Clear terrain gradient identified in DEM</li>
      <li>DSM successfully captured canopy variability and surface roughness</li>
    </ul>
  
    <img src="/image/UAV/dem_dsm.jpg" alt="DEM vs DSM comparison" />
  
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
  
    <img src="/image/UAV/nitrogen_regression.jpg" alt="Nitrogen regression model" />
  
    <h3>Key Insight</h3>
  
    <p>Vegetation indices significantly outperform single-band analysis, confirming the importance of spectral integration for biochemical estimation.</p>,
  
    <h3>Precision Agriculture Application</h3>
  
    <p>Spatial nitrogen requirement maps revealed strong variability across the field:</p>
  
    <ul>
      <li>Low NDVI zones → up to <strong>656 kg/ha nitrogen required</strong></li>
      <li>High NDVI zones → minimal or no fertilization needed</li>
    </ul>
  
    <img src="/image/UAV/nitrogen_map.jpg" alt="Nitrogen recommendation map" />
  
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

  {
    id: 8,
    title: "Land Cover Classification (Luxembourg)",
    category: "Remote Sensing",
    description:
      "Academic poster project: land cover mapping with Google Earth Engine and QGIS in Luxembourg. The embedded PDF below contains the full narrative, methods, and figures.",
    tools: ["Google Earth Engine", "QGIS"],
    image: "/image/LUXEMBOURG/lux.jpg",
    location: "Luxembourg",
    coordinates: [49.6116, 6.1319],
    detailPage: "/data/land-cover-classification-luxembourg",
    descriptionPdf:
      "/image/LUXEMBOURG/poster-luxembourg.pdf",
  },

  {
    id: 9,
    title: "Quantifying Forest Disturbance Using Multi-Temporal Landsat Time Series and Random Forest Classification (Coming Soon)",
    category: "Remote Sensing",
    description: "A multi-temporal remote sensing analysis to quantify deforestation dynamics and anthropogenic pressure in the Dja-et-Lobo district (Cameroon) using Landsat time series and machine learning.",
    tools: ["FORCE", "R", "Google Earth Engine", "QGIS", "ArcGIS Pro", "Landsat 7/8/9"],
    image: "/image/Mbam/mbam.jpg",
    location: "Dja-et-Lobo District, Cameroon",
    coordinates: [2.8, 12.9],
    detailPage: "/data/quantifying-forest-disturbance-dja-et-lobo",
  
    /*contextAndIntroduction: `<p>Land-use change is one of the main drivers of biodiversity loss in tropical ecosystems. In Central Africa, the Congo Basin forests are increasingly threatened by agricultural expansion, logging, and infrastructure development.</p>
  
    <p>In Cameroon, deforestation is accelerating, with thousands of hectares converted annually to agricultural land and plantations. In the Dja-et-Lobo district, large-scale rubber and cocoa expansion have significantly contributed to forest degradation.</p>
  
    <p>This project addresses the lack of spatially explicit analysis by applying <strong>multi-temporal satellite data and machine learning</strong> to quantify forest disturbance between <strong>2013 and 2024</strong>.</p>`,
  
    methodology: `<h3>1. Data Preparation & Preprocessing</h3>
  
    <ul>
      <li>293 Landsat scenes (L7, L8, L9) processed</li>
      <li>Atmospheric correction (TOA → BOA reflectance)</li>
      <li>Cloud masking using Fmask</li>
      <li>BRDF and topographic correction</li>
      <li>Data cube generation (30 m resolution)</li>
    </ul>
  
    <h3>2. Feature Engineering (HARD)</h3>
  
    <ul>
      <li>Vegetation indices: NDVI, EVI</li>
      <li>Temporal metrics: mean, max, quartiles, standard deviation</li>
      <li>4-year NDVI maximum compositing to reduce cloud noise</li>
    </ul>
  
    <h3>3. Land Cover Classification</h3>
  
    <ul>
      <li>Algorithm: Random Forest (500 trees)</li>
      <li>6 classes: forest, agriculture, shrubland, urban, bare soil, water</li>
      <li>Training data: Google Earth + Landsat interpretation</li>
      <li>Validation: 894 stratified samples</li>
    </ul>
  
    <h3>4. Change Detection</h3>
  
    <ul>
      <li>Post-classification comparison (2016–2020–2024)</li>
      <li>Binary forest / non-forest classification</li>
      <li>Change trajectory encoding (e.g., 111 = stable forest)</li>
    </ul>
  
    <h3>5. Accuracy Assessment</h3>
  
    <ul>
      <li>Area-adjusted confusion matrix (Olofsson method)</li>
      <li>Overall accuracy: <strong>0.959 ± 0.0085</strong></li>
    </ul>`,
  
    keyFindings: `<h3><strong>Forest Cover Change</strong></h3>
  
    <ul>
      <li>Total forest loss: <strong>~5.3% of study area</strong></li>
      <li>Net forest loss: <strong>~119,422 hectares</strong></li>
      <li>Forest area decreased from ~1.92M ha to ~1.8M ha</li>
    </ul>
  
    <h3>Land Use Dynamics</h3>
  
    <ul>
      <li>Agriculture expanded from <strong>13,874 ha → 95,813 ha</strong></li>
      <li>Urban areas increased from <strong>8,578 ha → 21,908 ha</strong></li>
    </ul>
  
    <h3>Spatial Patterns</h3>
  
    <ul>
      <li>Deforestation concentrated along <strong>roads and settlements</strong></li>
      <li>Large-scale clearing linked to plantation expansion</li>
      <li>Forest regeneration remains minimal (< 1%)</li>
    </ul>
    <p>Increased forest fragmentation, loss of continuous wildlife habitats and reduced ecosystem resilience</p>
  
    <h3>Decision-Making Support</h3>
  
    <ul>
      <li>Identification of deforestation hotspots</li>
      <li>Support for conservation prioritisation</li>
      <li>Evidence for regulating agricultural expansion</li>
      <li>Baseline for long-term forest monitoring</li>
    </ul>
  
    <p>This workflow provides a <strong>scalable and reproducible framework</strong> for environmental monitoring in tropical regions.</p>
    <ul>
    <li>Time-series remote sensing (2013–2024)</li>
      <li>Advanced preprocessing using FORCE</li>
      <li>Machine learning (Random Forest classification)</li>
      <li>Spectral-temporal feature engineering</li>
      <li>Area-adjusted accuracy assessment</li>
      <li>Change trajectory modelling</li>
    </ul>`,
  
    conclusion: `<p>This project demonstrates how <strong>multi-temporal Earth observation data combined with machine learning</strong> can provide robust, quantitative insights into forest dynamics.</p>
  
    <p>The results confirm that deforestation in the Dja-et-Lobo district is primarily driven by agricultural expansion and infrastructure accessibility.</p>
  
    <p>The methodology is transferable and can support <strong>policy-making, conservation planning, and sustainable land management</strong> in tropical ecosystems.</p>`*/
  },

  {
    id: 10,
    title: "Raum Web Platform (Coming Soon)",
    category: "Web Mapping",
    description: "Raum Web Platform is a web-based platform for the analysis of spatial data. It is built with javascript, node.js, PostgreSQL, PostGIS, and QGIS.",
    tools: ["javascript", "node.js", "PostgreSQL", "PostGIS", "QGIS"],
    image: "/image/Raum/raum.jpg",
    location: "Raum",
    coordinates: [49.00937, 8.40444] //karlsruhe, Germany
  },
  
];
