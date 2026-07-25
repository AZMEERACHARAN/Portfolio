import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, CheckCircle, Check, Code2 } from 'lucide-react';
import { subscribeToSkills, addSkill, updateSkill, deleteSkill, migrateSkillsToFirestore } from '../../services/skillsService';
const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Language', 'Design', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const LEVEL_COLORS = {
  Beginner: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
  Intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  Advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  Expert: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
};

const CAT_COLORS = {
  Frontend: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Backend: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Database: 'bg-green-500/10 text-green-400 border-green-500/20',
  DevOps: 'bg-red-500/10 text-red-400 border-red-500/20',
  Tools: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Language: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Design: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Other: 'bg-white/5 text-white/50 border-white/10',
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";

const EmptySkillForm = { name: '', category: 'Frontend', level: 'Intermediate', about: '', projects: '', status: '', imageUrl: '' };

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EmptySkillForm);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Skill name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  React.useEffect(() => {
    // Run migration one time if needed, then subscribe
    const init = async () => {
      await migrateSkillsToFirestore();
      
      const unsubscribe = subscribeToSkills((data) => {
        // Map Firestore schema back to UI expectation (title -> name, proficiency -> level)
        const mappedSkills = data.map(skill => ({
          ...skill,
          name: skill.title || skill.name,
          level: skill.proficiency || skill.level
        }));
        setSkills(mappedSkills);
        setIsLoading(false);
      }, (err) => {
        setErrorToast(err.message || "Failed to load skills");
        setIsLoading(false);
      });

      return () => unsubscribe();
    };
    
    init();
  }, []);

  const handleSaveAll = () => {
    // In Firestore mode, changes auto-save immediately. We just show a toast for UX.
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleAddOrUpdate = async () => {
    if (!validate()) return;
    
    setIsSaving(true); // Re-using isSaving for button state if we want, or add another state
    try {
      if (editingId) {
        await updateSkill(editingId, form);
      } else {
        await addSkill({ ...form, displayOrder: skills.length });
      }
      setEditingId(null);
      setForm(EmptySkillForm);
      setShowForm(false);
      setErrors({});
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Failed to save skill", error);
      setErrorToast(error.message || "Failed to save skill.");
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setForm({ 
      name: skill.name, 
      category: skill.category, 
      level: skill.level,
      about: skill.about || '',
      projects: skill.projects || '',
      status: skill.status || '',
      imageUrl: skill.imageUrl || ''
    });
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete skill", error);
      setErrorToast(error.message || "Failed to delete skill.");
      setTimeout(() => setErrorToast(null), 5000);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EmptySkillForm);
    setErrors({});
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = skills.filter(s => s.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills Management</h1>
          <p className="text-[--text-muted] text-sm mt-1">Add, edit, and manage your skill set. {skills.length} skills total.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(EmptySkillForm); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Skill
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

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-[#0a0d1c]/70 backdrop-blur-xl border border-primary/20 rounded-2xl p-6"
          >
            <h2 className="text-white font-semibold mb-4">{editingId ? 'Edit Skill' : 'Add New Skill'}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">Skill Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => { setForm(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({...p, name: null})); }}
                  className={`${inputClass} ${errors.name ? 'border-red-500/50' : ''}`}
                  placeholder="e.g. React.js"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">Experience Level</label>
                <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} className={inputClass}>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">About</label>
                <textarea
                  value={form.about}
                  onChange={e => setForm(p => ({ ...p, about: e.target.value }))}
                  className={`${inputClass} min-h-[80px] resize-y`}
                  placeholder='e.g. "A collaborative web application for interface design."'
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">Projects</label>
                  <input
                    type="text"
                    value={form.projects}
                    onChange={e => setForm(p => ({ ...p, projects: e.target.value }))}
                    className={inputClass}
                    placeholder='e.g. "Portfolio Design, App Mockups"'
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">Status</label>
                  <input
                    type="text"
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className={inputClass}
                    placeholder='e.g. "Creating design systems"'
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">Skill Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                className={inputClass}
                placeholder='e.g. "https://example.com/react-logo.png"'
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleCancel} className="px-4 py-2 rounded-xl text-sm text-[--text-muted] bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleAddOrUpdate} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/80 transition-all flex items-center gap-2">
                <Check className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills Display — Grouped by Category */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-4" />
          <p className="text-white/40 text-sm">Loading skills from database...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
          <Code2 className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-white/40 text-sm">No skills added yet. Click "Add Skill" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 inline-flex items-center px-3 py-1 rounded-full border ${CAT_COLORS[cat] || CAT_COLORS.Other}`}>
                {cat}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {items.map(skill => (
                  <div key={skill.id} className="group flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{skill.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border mt-1 inline-block ${LEVEL_COLORS[skill.level] || ''}`}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => handleEdit(skill)} className="p-1.5 rounded-lg text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(skill.id)} className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Skills not in grouped (Uncategorized) */}
          {skills.filter(s => !CATEGORIES.includes(s.category)).length > 0 && (
            <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-white/40">Other</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {skills.filter(s => !CATEGORIES.includes(s.category)).map(skill => (
                  <div key={skill.id} className="group flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                    <p className="text-sm font-medium text-white truncate">{skill.name}</p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(skill)} className="p-1.5 rounded-lg text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(skill.id)} className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0f1e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-white font-semibold mb-2">Delete Skill?</h3>
              <p className="text-[--text-muted] text-sm mb-6">This action cannot be undone. The skill will be removed permanently.</p>
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
            <span className="text-sm font-medium">Skills saved successfully!</span>
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

export default AdminSkills;
