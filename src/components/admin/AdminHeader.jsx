import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Bell, LogOut, Menu,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

// ── Derive a readable page title from the route ───────────────────────────────
const PAGE_TITLES = {
  '/admin/dashboard':    { title: 'Dashboard',    sub: 'Overview of your portfolio' },
  '/admin/hero':         { title: 'Hero Section', sub: 'Edit your hero banner' },
  '/admin/about':        { title: 'About',        sub: 'Update your bio & info' },
  '/admin/skills':       { title: 'Skills',       sub: 'Manage your skills & tools' },
  '/admin/projects':     { title: 'Projects',     sub: 'Add, edit & showcase projects' },
  '/admin/education':    { title: 'Education',    sub: 'Manage education timeline' },
  '/admin/experience':   { title: 'Experience',   sub: 'Manage work experience' },
  '/admin/certificates': { title: 'Certificates', sub: 'Manage certifications' },
  '/admin/messages':     { title: 'Messages',     sub: 'View contact messages' },
  '/admin/settings':     { title: 'Settings',     sub: 'Manage account & preferences' },
};

// ── Notification dropdown ─────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, text: 'New message from John Doe', time: '2 min ago',  dot: 'bg-primary' },
  { id: 2, text: 'Portfolio viewed 120 times', time: '1 hr ago',  dot: 'bg-accent-2' },
  { id: 3, text: 'New certificate added',      time: '3 hrs ago', dot: 'bg-green-400' },
];

const NotificationsDropdown = ({ open }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="
          absolute right-0 top-[calc(100%+10px)] w-80 z-50
          bg-[#0a0d1c]/95 backdrop-blur-2xl border border-white/8
          rounded-2xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]
          overflow-hidden
        "
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <p className="text-white font-semibold text-sm">Notifications</p>
          <span className="text-[10px] text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
        </div>
        <div className="divide-y divide-white/5">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/4 transition-colors cursor-pointer">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
              <div>
                <p className="text-white/90 text-xs leading-snug">{n.text}</p>
                <p className="text-[--text-muted] text-[10px] mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-white/6 text-center">
          <span className="text-primary text-xs font-medium cursor-pointer hover:underline">View all notifications</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── AdminHeader ───────────────────────────────────────────────────────────────
const AdminHeader = ({ onMenuClick }) => {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLight    = theme === 'light';

  const [notifOpen, setNotifOpen] = useState(false);

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Admin', sub: '' };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <header className="
      sticky top-0 z-30 h-16
      bg-[#080b18]/80 backdrop-blur-2xl
      border-b border-white/6
      flex items-center px-5 gap-4
      shadow-[0_1px_0_rgba(255,255,255,0.04)]
    ">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/8 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2 }}
          className="flex-1 min-w-0"
        >
          <h1 className="text-white font-bold text-base leading-none truncate">{pageInfo.title}</h1>
          {pageInfo.sub && (
            <p className="text-[--text-muted] text-[11px] mt-0.5 hidden sm:block truncate">{pageInfo.sub}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* View Portfolio */}
        <motion.a
          href="/"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[--text-muted] hover:text-white hover:bg-white/8 border border-white/6 hover:border-white/12 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </motion.a>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[--text-muted] hover:text-white hover:bg-white/8 border border-white/6 hover:border-white/12 transition-all overflow-hidden"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLight ? (
              <motion.span key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => setNotifOpen(o => !o)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[--text-muted] hover:text-white hover:bg-white/8 border border-white/6 hover:border-white/12 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-[#080b18]" />
          </motion.button>
          <NotificationsDropdown open={notifOpen} />
          {/* Click-outside closer */}
          {notifOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          )}
        </div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/8 border border-white/6 hover:border-red-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </motion.button>
      </div>
    </header>
  );
};

export default AdminHeader;
