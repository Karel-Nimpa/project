import { Award, BookOpen, Globe, Leaf } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Spatial data scientist passionate about using GIS and remote sensing
            to address environmental challenges in Africa
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Professional Background</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                I am an Environmental,  GIS & Remote Sensing Engineer specializing 
                in land-use analysis, sustainable resource management and spatial suitability assessment.
                My work integrates environmental science with geospatial technologies to support
                decision-making across land, infrastructure, and conservation systems
                </p>
                <p>
                Beyond land-use management, I develop and apply GIS-based suitability and spatial optimization 
                analyses for a wide range of applications including transport infrastructure, 
                renewable energy installations, and urban development.Using Earth observation data, multi-criteria analysis, 
                and spatial modeling, I evaluate environmental constraints, accessibility, risk, and sustainability trade-offs.
                </p>
                <p>
                My work also strongly engages with sustainable resource management, addressing challenges related to urban systems, 
                energy networks, transportation corridors, and land-use change dynamics.In parallel, biodiversity conservation is a key dimension 
                of my profile. I have applied spatial analysis to protected areas and deforestation in Africa, forest disturbance in Europe and conservation planning.
                </p>
                <p>
                With a dual background in Environmental Science and Geomatics, I aim to produce geospatial analyses that are operationally 
                relevant for planners, conservation practitioners, and policymakers. I am particularly motivated 
                by interdisciplinary projects where spatial data supports sustainable and resilient systems.
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Research Interests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Land use and Land Cover Change</h3>
                      <p className="text-gray-600 text-sm">
                      Multi-temporal analysis of land-use and land-cover change, including deforestation, 
                      agricultural expansion, urban growth, and landscape dynamics using Earth observation and GIS techniques.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Conservation & Protected Areas Planning</h3>
                      <p className="text-gray-600 text-sm">
                      Spatial analysis and prioritization for protected areas, biodiversity conservation, wildlife corridors, 
                      and land-use zoning at the interface of conservation and human pressures.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-teal-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Transport, Energy & Infrastructure Systems</h3>
                      <p className="text-gray-600 text-sm">
                      Spatial assessment and suitability analysis for transport and energy infrastructure, including 
                      road networks and renewable energy. 
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Urban Systems</h3>
                      <p className="text-gray-600 text-sm">
                        Mapping and valuation of natural capital and urban systems. Analyzing building parcels for urban planning and management.
                        Web mapping applications for urban planning and management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Skills</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">GIS & Mapping</h4>
                    <div className="flex flex-wrap gap-2">
                      {['QGIS', 'ArcGIS Pro', 'ArcMap'].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Programming</h4>
                    <div className="flex flex-wrap gap-2">
                      {['R', 'JavaScript', 'Python', 'SQL'].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Remote Sensing</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Google Earth Engine', 'ENVI', 'ERDAS', 'FORCE', 'SAR'].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Web Development</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Leaflet', 'Openlayers', 'Node.js', 'PHP', 'HTML', 'CSS'].map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Certifications</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Esri Technical Certification</li>
                    <li>• Drone pilot within a model aircraft association (B2 - B3)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
