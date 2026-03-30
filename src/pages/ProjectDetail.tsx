import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, MapPin, Github, Video } from 'lucide-react';
import { projects } from '../data/projects';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Find project by detailPage path
  const project = projects.find((p) => p.detailPage === `/data/${projectId}`);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/portfolio')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (project.download) {
      const link = document.createElement('a');
      link.href = project.download;
      link.download = project.download.split('/').pop() || 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Check if download button should be shown
  const shouldShowDownload = project.downloadEnabled !== false && project.download;
  const isPdfDescription = Boolean(project.descriptionPdf);

  // Helper function to render HTML content safely
  const renderHTML = (htmlString: string) => {
    return { __html: htmlString };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/portfolio')}
            className="inline-flex items-center gap-2 text-white hover:text-emerald-100 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Portfolio
          </button>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {project.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{project.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 ${isPdfDescription ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-12`}>
          {/* Main Content */}
          <div className={`${isPdfDescription ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-8`}>
            {!isPdfDescription && project.video && (
              <section
                className="bg-white rounded-lg shadow-md overflow-hidden"
                aria-labelledby="project-demo-heading"
              >
                <div className="p-6 sm:p-8 border-b border-gray-100">
                  <h2
                    id="project-demo-heading"
                    className="text-2xl font-bold text-gray-900 flex items-center gap-2"
                  >
                    <Video className="w-7 h-7 text-emerald-600 shrink-0" aria-hidden />
                    Project demo
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    Watch online: walkthrough of the implementation and main outcomes.
                  </p>
                </div>
                <div className="bg-black">
                  <video
                    className="w-full max-h-[min(70vh,720px)]"
                    controls
                    playsInline
                    preload="metadata"
                    poster={project.image}
                  >
                    <source src={project.video} type="video/mp4" />
                    Your browser does not support embedded video. You can still open the file directly:{' '}
                    <a href={project.video} className="text-emerald-400 underline">
                      {project.video}
                    </a>
                  </video>
                </div>
              </section>
            )}

            {/* Description */}
            {!isPdfDescription && (
              <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>
              </section>
            )}

            {isPdfDescription && project.descriptionPdf && (
              <section
                className="bg-white rounded-lg shadow-md overflow-hidden"
                aria-labelledby="poster-pdf-heading"
              >
                <div className="px-8 pt-8 pb-4 border-b border-gray-100">
                  <h2 id="poster-pdf-heading" className="text-2xl font-bold text-gray-900">
                    Project poster
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Full project description is displayed below.
                  </p>
                </div>
                <div className="p-4 sm:p-6 bg-gray-100">
                  <iframe
                    title={`${project.title} — poster PDF`}
                    src={project.descriptionPdf}
                    className="w-full min-h-[75vh] rounded-lg border border-gray-200 bg-white shadow-inner"
                  />
                </div>
              </section>
            )}

            {/* Context and Introduction */}
            {!isPdfDescription && project.contextAndIntroduction && (
              <section className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Context and Introduction</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={renderHTML(project.contextAndIntroduction)}
                />
              </section>
            )}

            {/* Methodology */}
            {!isPdfDescription && project.methodology && (
              <section className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Methodology</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={renderHTML(project.methodology)}
                />
              </section>
            )}

            {/* Key Findings */}
            {!isPdfDescription && project.keyFindings && (
              <section className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Findings</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={renderHTML(project.keyFindings)}
                />
              </section>
            )}

            {/* Conclusion */}
            {!isPdfDescription && project.conclusion && (
              <section className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Conclusion</h2>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={renderHTML(project.conclusion)}
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          {!isPdfDescription && (
            <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Download and GitHub Buttons */}
              {(shouldShowDownload || project.github) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="space-y-3">
                    {shouldShowDownload && (
                      <button
                        onClick={handleDownload}
                        className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download Report
                      </button>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                      >
                        <Github className="w-5 h-5" />
                        View on GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                    <p className="text-gray-600">{project.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
