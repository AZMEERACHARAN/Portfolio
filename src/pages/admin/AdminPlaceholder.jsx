import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const PAGE_LABELS = {
  '/admin/hero':         'Hero Section',
  '/admin/about':        'About',
  '/admin/skills':       'Skills',
  '/admin/projects':     'Projects',
  '/admin/education':    'Education',
  '/admin/experience':   'Experience',
  '/admin/certificates': 'Certificates',
  '/admin/messages':     'Messages',
  '/admin/settings':     'Settings',
};

const AdminPlaceholder = () => {
  const location = useLocation();
  const label = PAGE_LABELS[location.pathname] || 'Page';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Construction className="w-9 h-9 text-primary" />
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">{label}</h2>
      <p className="text-[--text-muted] text-sm max-w-xs">
        This section is coming soon. The CRUD interface for <span className="text-white font-medium">{label}</span> will be built next.
      </p>
      <div className="mt-6 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
        🚧 Under Construction
      </div>
    </motion.div>
  );
};

export default AdminPlaceholder;
