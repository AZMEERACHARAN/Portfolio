import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { FolderGit2, Code2, Award, Mail, Briefcase, GraduationCap, Layout, Settings } from 'lucide-react';

export const subscribeToDashboardData = (callback, onError) => {
  const collections = ['projects', 'skills', 'education', 'experience', 'certificates', 'messages'];
  const unsubscribes = [];
  
  let data = {
    stats: {
      projects: 0,
      skills: 0,
      education: 0,
      experience: 0,
      certificates: 0,
      messages: 0,
      unreadMessages: 0,
    },
    recentMessages: [],
    recentProjects: [],
    activityTimeline: [],
    lastUpdated: null,
    isInitialLoadComplete: false
  };

  const loadedState = {
    projects: false,
    skills: false,
    education: false,
    experience: false,
    certificates: false,
    messages: false
  };

  const allDocuments = {
    projects: [],
    skills: [],
    education: [],
    experience: [],
    certificates: [],
    messages: []
  };

  const processAggregatedData = () => {
    // Check if all collections have loaded their initial snapshot
    const allLoaded = Object.values(loadedState).every(status => status);
    
    // Compute Recent Projects (already sorted if we used query, but we fetched all for counts)
    const sortedProjects = [...allDocuments.projects]
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    data.recentProjects = sortedProjects.slice(0, 5);

    // Compute Recent Messages
    const sortedMessages = [...allDocuments.messages]
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    data.recentMessages = sortedMessages.slice(0, 5);
    data.stats.unreadMessages = allDocuments.messages.filter(m => !m.isRead).length;

    // Combine all documents for activity timeline
    let timeline = [];
    
    allDocuments.projects.forEach(p => timeline.push({
      id: `proj-${p.id}`,
      action: 'Updated',
      item: `Project: ${p.title || 'Untitled'}`,
      timestamp: p.updatedAt?.toMillis() || p.createdAt?.toMillis() || 0,
      icon: FolderGit2,
      color: 'text-accent-2',
      bg: 'bg-accent-2/10'
    }));

    allDocuments.skills.forEach(s => timeline.push({
      id: `skill-${s.id}`,
      action: 'Updated',
      item: `Skill: ${s.name || 'Unknown'}`,
      timestamp: s.updatedAt?.toMillis() || s.createdAt?.toMillis() || 0,
      icon: Code2,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    }));

    allDocuments.certificates.forEach(c => timeline.push({
      id: `cert-${c.id}`,
      action: 'Added',
      item: `Certificate: ${c.title || 'Unknown'}`,
      timestamp: c.updatedAt?.toMillis() || c.createdAt?.toMillis() || 0,
      icon: Award,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    }));

    allDocuments.messages.forEach(m => timeline.push({
      id: `msg-${m.id}`,
      action: 'Received',
      item: `Message from ${m.name || 'Someone'}`,
      timestamp: m.createdAt?.toMillis() || 0,
      icon: Mail,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10'
    }));

    allDocuments.education.forEach(e => timeline.push({
      id: `edu-${e.id}`,
      action: 'Updated',
      item: `Education: ${e.institutionName || 'Unknown'}`,
      timestamp: e.updatedAt?.toMillis() || e.createdAt?.toMillis() || 0,
      icon: GraduationCap,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    }));

    allDocuments.experience.forEach(e => timeline.push({
      id: `exp-${e.id}`,
      action: 'Updated',
      item: `Experience at ${e.company || 'Unknown'}`,
      timestamp: e.updatedAt?.toMillis() || e.createdAt?.toMillis() || 0,
      icon: Briefcase,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    }));

    // Sort timeline
    timeline.sort((a, b) => b.timestamp - a.timestamp);
    data.activityTimeline = timeline.slice(0, 8); // Top 8 recent activities

    // Overall last updated
    if (timeline.length > 0) {
      data.lastUpdated = timeline[0].timestamp;
    }

    if (allLoaded) {
      data.isInitialLoadComplete = true;
    }

    // Only fire callback when all collections have returned their first snapshot to avoid layout thrashing
    if (data.isInitialLoadComplete) {
      callback({ ...data });
    }
  };

  // Set up listeners for each collection
  collections.forEach(colName => {
    const q = query(collection(db, colName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      allDocuments[colName] = docs;
      data.stats[colName] = docs.length;
      loadedState[colName] = true;
      processAggregatedData();
    }, (error) => {
      console.error(`Error fetching ${colName} for dashboard:`, error);
      if (onError) onError(error);
    });
    unsubscribes.push(unsubscribe);
  });

  // Return a function that unsubscribes from all listeners
  return () => {
    unsubscribes.forEach(unsub => unsub());
  };
};
