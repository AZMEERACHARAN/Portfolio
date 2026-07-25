import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeData } from './services/dataService';
import { subscribeToSettings } from './services/settingsService';
import Login           from './pages/Login';
import PortfolioLayout from './layouts/PortfolioLayout';
import Home            from './pages/Home';
import AdminLayout     from './layouts/AdminLayout';
import PrivateRoute    from './components/admin/PrivateRoute';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminMessages     from './pages/admin/AdminMessages';
import AdminHero        from './pages/admin/AdminHero';
import AdminAbout       from './pages/admin/AdminAbout';
import AdminSkills      from './pages/admin/AdminSkills';
import AdminProjects    from './pages/admin/AdminProjects';
import AdminEducation   from './pages/admin/AdminEducation';
import AdminExperience  from './pages/admin/AdminExperience';
import AdminCertificates from './pages/admin/AdminCertificates';
import AdminServices     from './pages/admin/AdminServices';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminAchievements from './pages/admin/AdminAchievements';

function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Ensure all localStorage keys have their default values if empty
    initializeData();
    
    const unsubscribe = subscribeToSettings((data) => {
      if (data) setSettings(data);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (settings) {
      document.title = settings.metaTitle || settings.websiteTitle || 'Azmeera Charan Portfolio';
      
      const setMeta = (name, content) => {
        if (!content) return;
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      setMeta('description', settings.metaDescription);
      setMeta('keywords', settings.metaKeywords);

      if (settings.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = settings.faviconUrl;
      }
      
      if (settings.primaryColor) document.documentElement.style.setProperty('--primary', settings.primaryColor);
      if (settings.secondaryColor) document.documentElement.style.setProperty('--accent-2', settings.secondaryColor);
      if (settings.accentColor) document.documentElement.style.setProperty('--accent', settings.accentColor);
      
      if (settings.theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }
  }, [settings]);

  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PortfolioLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/admin" element={<Login />} />

        {/* Admin — protected */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard"     element={<AdminDashboard />} />
            <Route path="hero"          element={<AdminHero />} />
            <Route path="about"         element={<AdminAbout />} />
            <Route path="skills"        element={<AdminSkills />} />
            <Route path="projects"      element={<AdminProjects />} />
            <Route path="education"     element={<AdminEducation />} />
            <Route path="experience"    element={<AdminExperience />} />
            <Route path="certificates"  element={<AdminCertificates />} />
            <Route path="services"      element={<AdminServices />} />
            <Route path="testimonials"  element={<AdminTestimonials />} />
            <Route path="achievements"  element={<AdminAchievements />} />
            <Route path="messages"      element={<AdminMessages />} />
            <Route path="settings"      element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
