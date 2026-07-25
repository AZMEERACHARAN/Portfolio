import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderGit2, Code2, Mail, Award,
  ArrowUpRight, Clock, Activity, 
  Briefcase, GraduationCap, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subscribeToDashboardData } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';

const QUICK_ACTIONS = [
  { label: 'Edit Settings',   to: '/admin/settings',  color: 'bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary' },
  { label: 'Add Project',     to: '/admin/projects',  color: 'bg-accent-2/10 border-accent-2/20 hover:bg-accent-2/20 text-accent-2' },
  { label: 'View Messages',   to: '/admin/messages',  color: 'bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20 text-violet-400' },
  { label: 'Add Certificate', to: '/admin/certificates', color: 'bg-green-400/10 border-green-400/20 hover:bg-green-400/20 text-green-400' },
];

const card = 'bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item:      { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4,0,0.2,1] } } },
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const seconds = Math.floor((new Date() - timestamp) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToDashboardData(
      (data) => {
        setDashboardData(data);
        setIsLoading(false);
        setDbError(false);
      },
      (error) => {
        console.error(error);
        setDbError(true);
      }
    );
    return () => unsubscribe();
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white/5 rounded-3xl" />
          <div className="h-96 bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  const { stats, recentMessages, recentProjects, activityTimeline, lastUpdated } = dashboardData;

  const STATS_CARDS = [
    { label: 'Total Projects', value: stats.projects, icon: FolderGit2, color: 'from-primary/20 to-primary/5', border: 'border-primary/20', icon_color: 'text-primary' },
    { label: 'Total Skills', value: stats.skills, icon: Code2, color: 'from-accent-2/20 to-accent-2/5', border: 'border-accent-2/20', icon_color: 'text-accent-2' },
    { label: 'Total Education', value: stats.education, icon: GraduationCap, color: 'from-orange-400/20 to-orange-400/5', border: 'border-orange-400/20', icon_color: 'text-orange-400' },
    { label: 'Total Experience', value: stats.experience, icon: Briefcase, color: 'from-blue-400/20 to-blue-400/5', border: 'border-blue-400/20', icon_color: 'text-blue-400' },
    { label: 'Total Certificates', value: stats.certificates, icon: Award, color: 'from-green-400/20 to-green-400/5', border: 'border-green-400/20', icon_color: 'text-green-400' },
    { label: 'Total Messages', value: stats.messages, icon: Mail, color: 'from-indigo-400/20 to-indigo-400/5', border: 'border-indigo-400/20', icon_color: 'text-indigo-400' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: 'from-violet-500/20 to-violet-500/5', border: 'border-violet-500/20', icon_color: 'text-violet-400' },
  ];

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl mx-auto pb-10"
    >
      {/* Welcome banner */}
      <motion.div
        variants={stagger.item}
        className={`${card} p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden`}
      >
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-accent-2/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex-1">
          <p className="text-[--text-muted] text-sm font-medium">{greeting} 👋</p>
          <h2 className="text-white text-3xl font-bold mt-1 tracking-tight">
            Welcome back, <span className="text-gradient">Admin</span>
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/60 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              <Activity className="w-3.5 h-3.5" />
              <span>{stats.projects + stats.skills + stats.education + stats.experience + stats.certificates} Total Sections</span>
            </div>
            {lastUpdated && (
              <div className="text-xs text-[--text-muted]">
                Last updated: {formatTimeAgo(lastUpdated)}
              </div>
            )}
          </div>
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
      <motion.div variants={stagger.item} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {STATS_CARDS.map(s => {
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
            {activityTimeline.length === 0 ? (
              <p className="text-[--text-muted] text-sm">No recent activity.</p>
            ) : (
              activityTimeline.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={`${activity.id}-${index}`} className="relative flex gap-4">
                    {index !== activityTimeline.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-[-24px] w-px bg-white/10" />
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.bg} ${activity.color} border border-white/5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-white/90">
                        <span className="font-semibold">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-[11px] text-[--text-muted] mt-1">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
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

          {/* Portfolio Health */}
          <motion.div variants={stagger.item} className={`${card} p-6`}>
            <p className="text-white font-bold text-base mb-6">Portfolio Health</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${dbError ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {dbError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Firestore Database</p>
                    <p className="text-xs text-[--text-muted]">{dbError ? 'Disconnected' : 'Connected & Syncing'}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${dbError ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Authentication</p>
                    <p className="text-xs text-[--text-muted]">Signed in as Admin</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </div>
            </div>
          </motion.div>
        </div>
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
          {recentMessages.length === 0 ? (
            <p className="text-[--text-muted] text-sm py-4 col-span-full">No messages available.</p>
          ) : (
            recentMessages.map(msg => (
            <div
              key={msg.id}
              onClick={() => navigate('/admin/messages')}
              className={`flex flex-col p-4 rounded-xl transition-all cursor-pointer border hover:-translate-y-1 ${msg.isRead ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-primary/20 bg-primary/10 hover:bg-primary/20 shadow-[0_4px_20px_-10px_rgba(124,107,255,0.2)]'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${msg.isRead ? 'bg-white/10' : 'bg-gradient-to-br from-primary to-accent-2'}`}>
                    {msg.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-bold leading-tight ${msg.isRead ? 'text-white/80' : 'text-white'}`}>{msg.name}</p>
                    <p className="text-[11px] text-[--text-muted]">{msg.email}</p>
                  </div>
                </div>
                {!msg.isRead && <span className="w-2 h-2 bg-accent-2 rounded-full shadow-[0_0_8px_rgba(94,234,212,0.8)]" />}
              </div>
              <p className="text-[--text-muted] text-xs leading-relaxed line-clamp-2">
                "{msg.message}"
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-medium text-[--text-muted]">{msg.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
                <span className={`text-[10px] font-semibold ${msg.isRead ? 'text-white/40' : 'text-primary'}`}>{msg.isRead ? 'Read' : 'New'}</span>
              </div>
            </div>
          ))
          )}
        </div>
      </motion.div>

      {/* Recent Projects */}
      <motion.div variants={stagger.item} className={`${card} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-white font-bold text-base">Recent Projects</p>
          <button
            onClick={() => navigate('/admin/projects')}
            className="text-primary text-xs font-semibold hover:underline"
          >
            Manage projects
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recentProjects.length === 0 ? (
            <p className="text-[--text-muted] text-sm py-4 col-span-full">No projects available.</p>
          ) : (
            recentProjects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate('/admin/projects')}
              className="group flex flex-col p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white truncate">{project.title}</h4>
              <p className="text-[11px] text-[--text-muted] truncate mt-0.5">{project.category}</p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-white/40">{project.updatedAt?.toDate().toLocaleDateString() || project.createdAt?.toDate().toLocaleDateString() || 'Just now'}</span>
              </div>
            </div>
          ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
