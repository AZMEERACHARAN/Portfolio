import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Briefcase, Mail, Settings,
  ChevronDown, ChevronLeft, ChevronRight,
  Home, User, Code2, FolderGit2, GraduationCap,
  ClipboardList, Award, Zap, MessageSquareQuote, Trophy, X
} from 'lucide-react';

// ── Menu definition ──────────────────────────────────────────────────────────
const MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/admin/dashboard',
    exact: true,
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: Briefcase,
    children: [
      { id: 'hero',         label: 'Hero',         icon: Home,          to: '/admin/hero' },
      { id: 'about',        label: 'About',        icon: User,          to: '/admin/about' },
      { id: 'skills',       label: 'Skills',       icon: Code2,         to: '/admin/skills' },
      { id: 'projects',     label: 'Projects',     icon: FolderGit2,    to: '/admin/projects' },
      { id: 'education',    label: 'Education',    icon: GraduationCap, to: '/admin/education' },
      { id: 'experience',   label: 'Experience',   icon: ClipboardList, to: '/admin/experience' },
      { id: 'certificates', label: 'Certificates', icon: Award,         to: '/admin/certificates' },
      { id: 'services',     label: 'Services',     icon: Zap,           to: '/admin/services' },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, to: '/admin/testimonials' },
      { id: 'achievements', label: 'Achievements', icon: Trophy,        to: '/admin/achievements' },
    ],
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: Mail,
    to: '/admin/messages',
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    to: '/admin/settings',
  },
];

// ── Tooltip wrapper (icon-only mode) ─────────────────────────────────────────
const Tooltip = ({ label, children }) => (
  <div className="relative group/tip flex items-center">
    {children}
    <div
      className="
        pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2
        px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap z-[999]
        bg-[#0f1020] text-white border border-white/10 shadow-xl
        opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100
        transition-all duration-200 origin-left
      "
    >
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0f1020]" />
    </div>
  </div>
);

// ── Single nav item ───────────────────────────────────────────────────────────
const NavItem = ({ item, collapsed, depth = 0 }) => {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.to
    : item.to && location.pathname.startsWith(item.to);

  const Icon = item.icon;

  const innerContent = (
    <div
      className={`
        flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer
        transition-all duration-200 relative group
        ${isActive
          ? 'bg-primary/15 text-primary border border-primary/20'
          : 'text-[--text-muted] hover:text-white hover:bg-white/5 border border-transparent'
        }
        ${depth > 0 ? 'text-sm py-2' : ''}
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId={`active-bar-${depth}`}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full"
        />
      )}
      <Icon className={`shrink-0 ${depth > 0 ? 'w-4 h-4' : 'w-[18px] h-[18px]'}`} />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 font-medium whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {/* Badge */}
      {!collapsed && item.badge && (
        <span className="ml-auto text-[10px] font-bold bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">
          {item.badge}
        </span>
      )}
      {collapsed && item.badge && (
        <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <Tooltip label={item.label}>
        <NavLink to={item.to || '#'} className="block w-full">
          {innerContent}
        </NavLink>
      </Tooltip>
    );
  }

  return (
    <NavLink to={item.to || '#'} className="block w-full">
      {innerContent}
    </NavLink>
  );
};

// ── Collapsible group ─────────────────────────────────────────────────────────
const NavGroup = ({ item, collapsed }) => {
  const location = useLocation();
  const isChildActive = item.children?.some(c => location.pathname.startsWith(c.to));
  const [open, setOpen] = useState(isChildActive);
  const Icon = item.icon;

  if (collapsed) {
    return (
      <Tooltip label={item.label}>
        <div
          className={`
            flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer
            transition-all duration-200 border
            ${isChildActive
              ? 'bg-primary/15 text-primary border-primary/20'
              : 'text-[--text-muted] hover:text-white hover:bg-white/5 border-transparent'
            }
          `}
        >
          <Icon className="w-[18px] h-[18px] shrink-0" />
        </div>
      </Tooltip>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          w-full flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer
          transition-all duration-200 border
          ${isChildActive
            ? 'text-primary border-primary/20 bg-primary/10'
            : 'text-[--text-muted] hover:text-white hover:bg-white/5 border-transparent'
          }
        `}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" />
        <span className="flex-1 font-medium text-left whitespace-nowrap">{item.label}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 opacity-60" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-1 ml-5 pl-3 border-l border-white/8 space-y-0.5 py-1">
              {item.children.map(child => (
                <NavItem key={child.id} item={child} collapsed={false} depth={1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
const AdminSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo + collapse toggle */}
      <div className="flex items-center h-16 px-4 border-b border-white/6 shrink-0">
        <AnimatePresence initial={false} mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(124,107,255,0.4)]">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm leading-none truncate">Admin Panel</p>
                <p className="text-[--text-muted] text-[11px] mt-0.5 truncate">Azmeera Charan</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-[0_0_20px_rgba(124,107,255,0.4)]">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse button — desktop only */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex ml-auto p-1.5 rounded-lg text-[--text-muted] hover:text-white hover:bg-white/8 transition-colors shrink-0"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft className="w-4 h-4" />
          }
        </button>

        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden ml-auto p-1.5 rounded-lg text-[--text-muted] hover:text-white hover:bg-white/8 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1 scrollbar-hide">
        {MENU.map(item =>
          item.children
            ? <NavGroup key={item.id} item={item} collapsed={collapsed} />
            : <NavItem  key={item.id} item={item} collapsed={collapsed} />
        )}
      </nav>

      {/* User profile at bottom */}
      <div className="shrink-0 border-t border-white/6 p-3">
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/40 to-accent-2/40 border border-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0a18]" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-white text-sm font-medium truncate leading-none">Azmeera Charan</p>
                <p className="text-[--text-muted] text-[11px] mt-0.5 truncate">admin@azmeera.dev</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="
          hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40
          bg-[#080b18]/90 backdrop-blur-2xl border-r border-white/6
          shadow-[4px_0_32px_rgba(0,0,0,0.4)]
          overflow-hidden
        "
      >
        {sidebarContent}
      </motion.aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="
                fixed left-0 top-0 h-screen z-50 w-[260px]
                bg-[#080b18] border-r border-white/8
                shadow-[4px_0_40px_rgba(0,0,0,0.6)]
                lg:hidden flex flex-col
              "
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
