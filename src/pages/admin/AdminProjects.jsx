import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Plus, Trash2, Edit2, X, CheckCircle,
  ExternalLink, GitBranch, FolderGit2, Upload, Star, StarOff, Image as ImageIcon
} from 'lucide-react';
import { subscribeToProjects, addProject, updateProject, deleteProject, migrateProjectsToFirestore } from '../../services/projectsService';

const STATUSES = ['Completed', 'Ongoing', 'Planned'];

const EMPTY_PROJECT = {
  title: '',
  description: '',
  overview: '',
  projectGoal: '',
  technologies: '',
  github: '',
  demo: '',
  image: '',
  featured: false,
  status: 'Completed',
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const STATUS_COLORS = {
  Completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Ongoing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Planned: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };


  React.useEffect(() => {
    const init = async () => {
      await migrateProjectsToFirestore();
      
      const unsubscribe = subscribeToProjects((data) => {
        setProjects(data);
        setIsLoading(false);
      }, (err) => {
        setErrorToast(err.message || "Failed to load projects");
        setIsLoading(false);
      });

      return () => unsubscribe();
    };
    
    init();
  }, []);

  const handleOpenNew = () => {
    setEditingProject(null);
    setForm(EMPTY_PROJECT);
    setErrors({});
    setShowForm(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project.id);
    setForm({
      ...project,
      overview: project.overview || '',
      projectGoal: project.projectGoal || ''
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject, form);
      } else {
        await addProject(form);
      }
      setShowForm(false);
      setEditingProject(null);
      setForm(EMPTY_PROJECT);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Failed to save project", error);
      setErrorToast(error.message || "Failed to save project.");
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete project", error);
      setErrorToast(error.message || "Failed to delete project.");
      setTimeout(() => setErrorToast(null), 5000);
    }
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    setForm(EMPTY_PROJECT);
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects Management</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage your portfolio projects. {projects.length} project{projects.length !== 1 ? 's' : ''} total.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <Plus className="w-4 h-4" /> Add Project
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSaving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-4" />
          <p className="text-white/40 text-sm">Loading projects from database...</p>
        </div>
      ) : !showForm && (
        projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
            <FolderGit2 className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No projects yet. Click "Add Project" to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl overflow-hidden hover:border-white/15 transition-all"
              >
                {/* Image */}
                <div className="h-40 bg-[#0f1123] border-b border-white/5 flex items-center justify-center overflow-hidden relative">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/20">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold">
                      <Star className="w-3 h-3" /> Featured
                    </div>
                  )}
                  <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[project.status] || STATUS_COLORS.Planned}`}>
                    {project.status}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-white font-semibold mb-1 truncate">{project.title}</h3>
                  <p className="text-[--text-muted] text-xs line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.split(',').filter(t => t.trim()).slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[10px] font-medium">{tech.trim()}</span>
                    ))}
                    {project.technologies.split(',').filter(t => t.trim()).length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px]">+{project.technologies.split(',').filter(t => t.trim()).length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex gap-2">
                      {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"><GitBranch className="w-4 h-4" /></a>}
                      {project.demo && <a href={project.demo} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"><ExternalLink className="w-4 h-4" /></a>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(project)} className="p-1.5 rounded-lg text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(project.id)} className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Add / Edit Form Panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-primary/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={handleCancel} className="p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Project Title *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} className={`${inputClass} ${errors.title ? 'border-red-500/50' : ''}`} placeholder="e.g. My Portfolio" />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className={labelClass}>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={`${inputClass} resize-y ${errors.description ? 'border-red-500/50' : ''}`} placeholder="Main Header Description..." />
                  {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className={labelClass}>Overview</label>
                  <textarea name="overview" value={form.overview} onChange={handleChange} rows={3} className={`${inputClass} resize-y`} placeholder="Detailed overview..." />
                </div>

                <div>
                  <label className={labelClass}>Project Goal</label>
                  <textarea name="projectGoal" value={form.projectGoal} onChange={handleChange} rows={3} className={`${inputClass} resize-y`} placeholder="Project goal..." />
                </div>

                <div>
                  <label className={labelClass}>Technologies (comma separated)</label>
                  <input type="text" name="technologies" value={form.technologies} onChange={handleChange} className={inputClass} placeholder="React, Node.js, MongoDB..." />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>GitHub URL</label>
                    <input type="url" name="github" value={form.github} onChange={handleChange} className={inputClass} placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className={labelClass}>Live Demo URL</label>
                    <input type="url" name="demo" value={form.demo} onChange={handleChange} className={inputClass} placeholder="https://example.com" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Image Upload */}
                <div>
                  <label className={labelClass}>Project Image URL</label>
                  <div className="mt-1 flex gap-4 items-start">
                    <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#0f1123] border border-white/10 shrink-0 flex items-center justify-center">
                      {form.image ? (
                        <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-white/20">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[10px]">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="url" 
                        name="image" 
                        value={form.image} 
                        onChange={handleChange} 
                        className={inputClass} 
                        placeholder="https://example.com/project-image.jpg" 
                      />
                      {form.image && (
                        <button onClick={() => setForm(p => ({ ...p, image: '' }))} className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                          <X className="w-3 h-3" /> Clear URL
                        </button>
                      )}
                      <p className="text-[--text-muted] text-xs mt-2">Paste a direct image URL (e.g. from imgur). Recommended: 16:9 aspect ratio.</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className={labelClass}>Status</label>
                  <div className="flex gap-3 flex-wrap mt-1">
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, status: s }))}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${form.status === s ? STATUS_COLORS[s] : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured Toggle */}
                <div>
                  <label className={labelClass}>Featured</label>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${form.featured ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'}`}
                  >
                    {form.featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    {form.featured ? 'Featured Project' : 'Mark as Featured'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
              <button onClick={handleCancel} className="px-5 py-2 rounded-xl text-sm text-[--text-muted] bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> {editingProject ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0f1e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-white font-semibold mb-2">Delete Project?</h3>
              <p className="text-[--text-muted] text-sm mb-6">This will permanently remove the project. This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl text-sm text-[--text-muted] bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(34,197,94,0.2)] text-green-400"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Projects saved successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 text-green-400/60 hover:text-green-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(239,68,68,0.2)] text-red-400"
          >
            <X className="w-5 h-5" />
            <span className="text-sm font-medium">{errorToast}</span>
            <button onClick={() => setErrorToast(null)} className="ml-2 text-red-400/60 hover:text-red-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjects;
