import { Briefcase, GraduationCap, Award, FileText, Download } from 'lucide-react';

export default function Resume() {
  const experience = [
    {
      title: 'Environmental & GIS Analyst',
      organization: 'ProRaum Consult - Karlsruhe, Germany',
      period: '2024 - Present',
      description: [
        'Monitoring urban landscape changes over time, maintaining and updating geographic databases',
        'producing thematic maps, and drafting procedural GIS documentation',
        'Automated spatial workflows using QGIS Model Builder and contributed to 3D spatial simulations for urban analysis',
        'Developed and maintained a Raum platform for urban planning and management'
      ]
    },
    {
      title: 'Research Assistant',
      organization: 'Trier University - Trier, Germany',
      period: '2024 - 2025',
      description: [
        'Introduced new students from the Master of Environmental Science to GIS concept and practical classes',
        'Assisted with correcting and grading exercises from the students'
      ]
    },
    {
      title: 'Geospatial analyst - Internship',
      organization: 'National Forestry Office (ONF) - Fontainebleau, France',
      period: '2023',
      description: [
        'Provided GIS support for the management of the national forest inventory',
        'Analyzed forest dieback patterns by linking affected areas with soil properties, forest types, and solar exposure',
        'Conducted predictive spatial modeling to assess future dieback risks and translated results into decision-support material for forest governance and management',
        'managed a geospatial database and mapped forest fires in Fontainebleau forest'
      ]
    },
    {
      title: 'Geospatial analyst - Internship',
      organization: 'Wildlife Conservation Society - Mbakaou, Cameroon',
      period: '2021',
      description: [
        'Mapped LCLUC in Mbam and Djerem National Park to assess agricultural expansion and deforestation drivers using remote sensing techniques',
        'Conducted wildlife inventory analysis and identify hotspots of wildlife loss and human-wildlife conflicts',
        'Integrated spatial results into land-use zoning negotiations with park authorities and local communities'
      ]
    },
    {
      title: 'Environmental Consultant - Internship',
      organization: 'Rainbow Environment Consult - Yaoundé, Cameroon',
      period: '2021',
      description: [
        'Involved in the Green Cocoa Project to map LCLUC around Dja and Lobo Biosphere Reserves using remote sensing techniques',
        'Contributed to environmental and social surveys with farmers and local communities',
        'Assessed the impacts of cocoa and rubber farm expansion on biodiversity and ecosystem services of the reserves'
      ]
    }
  ];

  const education = [
    {
      degree: 'Master of science in Geoinformatics',
      institution: 'Trier University - Trier, Germany',
      period: '2024 - 2026',
      focus: 'Focus: Remote Sensing & Geospatial Analysis',
      thesis: 'Thesis: building detection using CNN and Deep Learning versus traditional methods for land use/land cover classification'
    },
    {
      degree: 'Master of engineering in Environmental management',
      institution: 'AgroParisTech - Paris, France',
      period: '2022 - 2023',
      focus: 'Focus: Environmental Ecosystem Management and Forestry',
      thesis: 'Thesis: Cartographie et causes du dépérissement du massif forestier de Fontainebleau par télédétection et SIG'
    },
    {
      degree: 'Bachelor of Engineering in Environmental management',
      institution: 'University of Dschang - Dschang, Cameroon',
      period: '2018 - 2021',
      focus: 'Focus: Conservation, polution and environmental impact assessment',
      thesis: 'Thesis: Evaluation de l\'impact environnemental de l\'exploitation forestière dans l\'est du Cameroun : le cas de l\'unité de gestion forestière 10040 à Kongo'
    }
  ];

  const publications = [
    ' Will come soon...'
  ];

  //const awards = [
    //{
    //  title: '',
    //  organization: '',
    //  year: ''
    //}
    //];

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Karel NIMPA-CV.pdf';
    link.download = 'Karel NIMPA-CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-6 md:py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Resume</h1>
              <p className="text-xl opacity-90">
                Professional experience in GIS, remote sensing, and Environmental field
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-48 h-48 lg:w-56 lg:h-56">
                <img
                  src="https://drive.google.com/uc?export=view&id=1W75xAh82VEh7hwdaGs6BiPob6DYyWZja"
                  alt="Karel NIMPA"
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    e.currentTarget.src = 'CV_photo.jpg'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Experience</h2>
                </div>
                <button
                  onClick={handleDownloadCV}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </button>
              </div>
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-emerald-600 font-medium">{exp.organization}</p>
                      </div>
                      <span className="text-gray-500 text-sm mt-2 md:mt-0">{exp.period}</span>
                    </div>
                    <ul className="space-y-2">
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="text-gray-700 flex gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Education</h2>
              </div>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                      <span className="text-gray-500 text-sm mt-2 md:mt-0">{edu.period}</span>
                    </div>
                    <p className="text-blue-600 font-medium mb-1">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">{edu.focus}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Publications</h2>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <ul className="space-y-4">
                  {publications.map((pub, index) => (
                    <li key={index} className="text-gray-700 text-sm leading-relaxed">
                      {pub}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleDownloadCV}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download CV
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Technical Skills</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">GIS & Mapping</h3>
                  <div className="flex flex-wrap gap-2">
                    {['QGIS','ArcGIS Pro', 'ArcMap'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Programming</h3>
                  <div className="flex flex-wrap gap-2">
                    {['R', 'JavaScript','Python', 'SQL'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Remote Sensing</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Google Earth Engine', 'ENVI', 'ERDAS', 'FORCE', 'SAR'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Web Development</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Leaflet', 'Openlayers', 'Node.js', 'PHP', 'HTML', 'CSS'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Earth observationData</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Landsat', 'Sentinel', 'MODIS', 'SPOT'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Awards & Recognition section commented out - no awards to display */}
            {/* <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Awards & Recognition</h2>
              <div className="space-y-4">
                {awards.map((award, index) => (
                  <div key={index} className="border-l-4 border-emerald-600 pl-4">
                    <h3 className="font-semibold text-gray-900">{award.title}</h3>
                    <p className="text-sm text-gray-600">{award.organization}</p>
                    <p className="text-sm text-emerald-600 font-medium">{award.year}</p>
                  </div>
                ))}
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </div>
  );
}
