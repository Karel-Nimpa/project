import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import { publicAsset } from '../utils/publicAsset';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const navigate = useNavigate();
  const featuredProjects = projects.slice(0, 4);

  return (
    <div className="min-h-screen">
      <section 
        className="relative py-8 md:py-3 overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(to bottom right, rgba(236, 253, 245, 0.5), rgba(219, 234, 254, 0.5), rgba(204, 251, 241, 0.5)), url(https://repository-images.githubusercontent.com/327571172/2d81d500-51a1-11eb-99e0-49197b298a52)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Photo on the left */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm">
                <img
                  src="https://drive.google.com/uc?export=view&id=1W75xAh82VEh7hwdaGs6BiPob6DYyWZja"
                  alt="Karel NIMPA"
                  className="w-full h-auto rounded-lg shadow-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = publicAsset('Tour de Ville (88).jpg');
                  }}
                />
              </div>
            </div>
            
            {/* Text content on the right */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 lg:p-8 shadow-lg">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-lg">
                  Karel NIMPA
                </h1>
                <p className="text-2xl md:text-3xl text-gray-800 mb-4 font-semibold drop-shadow-md">
                  Environmental, Earth Observation & Geospatial Engineer
                </p>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto lg:mx-0 mb-8 drop-shadow-sm">
                Leveraging Earth observation, GIS, and spatial data science to support land-use planning, spatial suitability analysis, biodiversity conservation, and sustainable resource management across environmental, urban, and energy systems.
                </p>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6">
                <button
                  onClick={() => onNavigate('Portfolio')}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                  View Portfolio <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('About')}
                  className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border-2 border-emerald-600 shadow-lg"
                >
                  About Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center mb-0.5">
                <img src={publicAsset('Icons/Layer1.png')} alt="GIS Analysis" className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GIS Analysis</h3>
              <p className="text-sm text-gray-600">
              Spatial analysis, modeling, and multi-criteria decision support for land-use planning, conservation, and sustainable resource management.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center mb-0.5">
                <img src={publicAsset('Icons/MNT.png')} alt="Satellite" className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Remote Sensing</h3>
              <p className="text-sm text-gray-600">
              Multi-temporal satellite imagery analysis for land-use/land-cover mapping, vegetation, crop and buildingdynamics, and change detection.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center mb-0.5">
                <img src={publicAsset('Icons/webApp.png')} alt="Web Mapping" className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Web Mapping</h3>
              <p className="text-sm text-gray-600">
              Interactive mapping applications and spatial data visualization dashboards for environmental monitoring and planning.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center mb-0.5">
                <img src={publicAsset('Icons/pngegg (5).png')} alt="Spatial Suitability" className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Spatial Suitability </h3>
              <p className="text-sm text-gray-600">
              Spatial suitability analysis for agriculture, transport infrastructure, renewable energy (solar, wind), and land-use planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Selected work demonstrating spatial analysis and remote sensing applications
              for environmental conservation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  if (project.detailPage) {
                    const projectId = project.detailPage.replace('/data/', '');
                    navigate(`/data/${projectId}`);
                  }
                }}
                className={`bg-white rounded-lg overflow-hidden shadow-md transition-shadow ${
                  project.detailPage 
                    ? 'cursor-pointer hover:shadow-xl' 
                    : 'hover:shadow-lg'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-600">
                      {project.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('Portfolio')}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
