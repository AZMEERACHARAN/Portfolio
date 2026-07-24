import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2, Code2, Mail, Award,
  ArrowUpRight, Clock, Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { label: 'Projects',     value: '12',  icon: FolderGit2, color: 'from-primary/20 to-primary/5',    border: 'border-primary/20',    icon_color: 'text-primary'    },
  { label: 'Skills',       value: '34',  icon: Code2,      color: 'from-accent-2/20 to-accent-2/5',  border: 'border-accent-2/20',   icon_color: 'text-accent-2'   },
  { label: 'Certificates', value: '8',   icon: Award,      color: 'from-green-400/20 to-green-400/5', border: 'border-green-400/20',  icon_color: 'text-green-400'  },
  { label: 'Messages',     value: '3',   icon: Mail,       color: 'from-violet-500/20 to-violet-500/5', border: 'border-violet-500/20', icon_color: 'text-violet-400' },
];

const QUICK_ACTIONS = [
  { label: 'Edit Hero',     to: '/admin/hero',      color: 'bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary' },
  { label: 'Add Project',   to: '/admin/projects',  color: 'bg-accent-2/10 border-accent-2/20 hover:bg-accent-2/20 text-accent-2' },
  { label: 'View Messages', to: '/admin/messages',  color: 'bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20 text-violet-400' },
  { label: 'Settings',      to: '/admin/settings',  color: 'bg-green-400/10 border-green-400/20 hover:bg-green-400/20 text-green-400' },
];

const RECENT_ACTIVITY = [
  { id: 1, action: 'Updated', item: 'Hero Section text', time: '2 hours ago', icon: Layout, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 2, action: 'Added new', item: 'E-commerce Project', time: '5 hours ago', icon: FolderGit2, color: 'text-accent-2', bg: 'bg-accent-2/10' },
  { id: 3, action: 'Read', item: 'Message from John', time: '1 day ago', icon: Mail, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { id: 4, action: 'Updated', item: 'Frontend Skills list', time: '2 days ago', icon: Code2, color: 'text-green-400', bg: 'bg-green-400/10' },
];

const RECENT_MESSAGES = [
  { id: 1, name: 'John Doe',    email: 'john@example.com',  preview: 'Hi! I loved your portfolio work, would love to collaborate…', time: '2m ago',  read: false },
  { id: 2, name: 'Jane Smith',  email: 'jane@example.com',  preview: 'Your project showcase is impressive. Can we connect?',         time: '1h ago',  read: false },
  { id: 3, name: 'Mark Wilson', email: 'mark@example.com',  preview: 'Interested in your freelance availability for a new project.', time: '3h ago',  read: true  },
];

const card = 'bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item:      { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4,0,0.2,1] } } },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const greeting =
    hour < 12 ? 'Good Morning' :
    hour < 18 ? 'Good Afternoon' :
    'Good Evening';

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Welcome banner with Current Date & Time */}
      <motion.div
        variants={stagger.item}
        className={`${card} p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}
      >
        {/* decorative glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-accent-2/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex-1">
          <p className="text-[--text-muted] text-sm font-medium">{greeting} 👋</p>
          <h2 className="text-white text-3xl font-bold mt-1 tracking-tight">
            Welcome back, <span className="text-gradient">Azmeera Charan</span>
          </h2>
          <p className="text-[--text-muted] text-sm mt-2">Here's what's happening with your portfolio today.</p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">{formattedTime}</p>
            <p className="text-[--text-muted] text-xs mt-0.5">{formattedDate}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${card} p-5 bg-gradient-to-br ${s.color} border ${s.border} flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-default group`}>
              <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${s.icon_color}`} />
              </div>
              <div>
                <p className="text-white text-2xl font-bold leading-none">{s.value}</p>
                <p className="text-white/60 text-xs mt-1.5 font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Recent Activity & Quick actions row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={stagger.item} className={`${card} p-6 lg:col-span-2 flex flex-col`}>
          <div className="flex items-center justify-between mb-6">
            <p className="text-white font-bold text-base">Recent Activity</p>
          </div>
          <div className="space-y-6 flex-1">
            {RECENT_ACTIVITY.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline line */}
                  {index !== RECENT_ACTIVITY.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-white/10" />
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.bg} ${activity.color} border border-white/5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-white/90">
                      <span className="font-semibold">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-[11px] text-[--text-muted] mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={stagger.item} className={`${card} p-6`}>
          <p className="text-white font-bold text-base mb-6">Quick Actions</p>
          <div className="space-y-3">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all ${a.color} group`}
              >
                {a.label}
                <div className="w-6 h-6 rounded-md bg-current/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent messages */}
      <motion.div variants={stagger.item} className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-white font-bold text-base">Recent Messages</p>
          <button
            onClick={() => navigate('/admin/messages')}
            className="text-primary text-xs font-semibold hover:underline"
          >
            View all messages
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECENT_MESSAGES.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col p-4 rounded-xl transition-all cursor-pointer border hover:-translate-y-1 ${msg.read ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-primary/20 bg-primary/10 hover:bg-primary/20 shadow-[0_4px_20px_-10px_rgba(124,107,255,0.2)]'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${msg.read ? 'bg-white/10' : 'bg-gradient-to-br from-primary to-accent-2'}`}>
                    {msg.name[0]}
                  </div>
                  <div>
                    <p className={`text-sm font-bold leading-tight ${msg.read ? 'text-white/80' : 'text-white'}`}>{msg.name}</p>
                    <p className="text-[11px] text-[--text-muted]">{msg.email}</p>
                  </div>
                </div>
                {!msg.read && <span className="w-2 h-2 bg-accent-2 rounded-full shadow-[0_0_8px_rgba(94,234,212,0.8)]" />}
              </div>
              <p className="text-[--text-muted] text-xs leading-relaxed line-clamp-2">
                "{msg.preview}"
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-medium text-[--text-muted]">{msg.time}</span>
                <span className={`text-[10px] font-semibold ${msg.read ? 'text-white/40' : 'text-primary'}`}>{msg.read ? 'Read' : 'New'}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
