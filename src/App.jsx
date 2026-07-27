import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { initializeData } from './services/dataService';
import { subscribeToSettings } from './services/settingsService';
import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from './components/WelcomeScreen';
import PortfolioLayout from './layouts/PortfolioLayout';
import Home            from './pages/Home';
import PrivateRoute    from './components/admin/PrivateRoute';

const Login = lazy(() => import('./pages/Login'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminHero = lazy(() => import('./pages/admin/AdminHero'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminEducation = lazy(() => import('./pages/admin/AdminEducation'));
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements'));

function App() {
  const [settings, setSettings] = useState(null);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem('hasSeenWelcome');
  });

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        sessionStorage.setItem('hasSeenWelcome', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

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
    }
  }, [settings]);

  return (
    <AuthProvider>
      <BrowserRouter>
      <AnimatePresence mode="wait">
        {showWelcome && <WelcomeScreen name={settings?.ownerName || "AZMEERA CHARAN"} />}
      </AnimatePresence>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
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
      </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
