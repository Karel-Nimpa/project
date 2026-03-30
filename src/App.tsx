import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Resume from './pages/Resume';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page name from pathname
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/portfolio') || path.startsWith('/data')) return 'Portfolio';
    if (path === '/about') return 'About';
    if (path === '/resume') return 'Resume';
    return 'Home';
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'Home':
        navigate('/');
        break;
      case 'About':
        navigate('/about');
        break;
      case 'Resume':
        navigate('/resume');
        break;
      case 'Portfolio':
        navigate('/portfolio');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onNavigate={handleNavigate} />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/data/:projectId" element={<ProjectDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
