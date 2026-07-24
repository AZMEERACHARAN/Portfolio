import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login           from './pages/Login';
import PortfolioLayout from './layouts/PortfolioLayout';
import Home            from './pages/Home';
import AdminLayout     from './layouts/AdminLayout';
import PrivateRoute    from './components/admin/PrivateRoute';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';
import AdminHero        from './pages/admin/AdminHero';
import AdminAbout       from './pages/admin/AdminAbout';
import AdminSkills      from './pages/admin/AdminSkills';
import AdminProjects    from './pages/admin/AdminProjects';
import AdminEducation   from './pages/admin/AdminEducation';
import AdminExperience  from './pages/admin/AdminExperience';
import AdminCertificates from './pages/admin/AdminCertificates';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/portfolio" element={<PortfolioLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Admin — protected */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                element={<AdminDashboard />} />
            <Route path="hero"          element={<AdminHero />} />
            <Route path="about"         element={<AdminAbout />} />
            <Route path="skills"        element={<AdminSkills />} />
            <Route path="projects"      element={<AdminProjects />} />
            <Route path="education"     element={<AdminEducation />} />
            <Route path="experience"    element={<AdminExperience />} />
            <Route path="certificates"  element={<AdminCertificates />} />
            <Route path="messages"      element={<AdminPlaceholder />} />
            <Route path="settings"      element={<AdminPlaceholder />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
