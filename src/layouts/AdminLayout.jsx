import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader  from '../components/admin/AdminHeader';

const AdminLayout = () => {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarW = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen flex bg-[#060a16] text-[--text]">
      {/* Subtle radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main area — shifts right when sidebar expands */}
      <motion.div
        animate={{ marginLeft: isMobile ? 0 : sidebarW }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-h-screen relative z-10 lg:ml-0"
        style={{ marginLeft: 0 /* overridden on lg by motion */ }}
      >
        {/* Header */}
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
