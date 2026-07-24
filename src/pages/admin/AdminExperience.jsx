import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, CheckCircle, Briefcase } from 'lucide-react';
import { getExperienceData, saveExperienceData } from '../../services/experienceApi';

const EMPTY_EXP = {
  position: '',
  organization: '',
  duration: '',
  description: ''
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminExperience = () => {
  const [experienceList, setExperienceList] = useState(() => getExperienceData() || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_EXP);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.position.trim()) e.position = 'Position is required';
    if (!form.organization.trim()) e.organization = 'Organization is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setForm(EMPTY_EXP);
    setErrors({});
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    let updated;
    if (editingId) {
      updated = experienceList.map(item => item.id === editingId ? { ...item, ...form } : item);
    } else {
      updated = [...experienceList, { id: Date.now().toString(), ...form }];
    }
    setExperienceList(updated);
    saveExperienceData(updated);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_EXP);
  };

  const handleDelete = (id) => {
    const updated = experienceList.filter(item => item.id !== id);
    setExperienceList(updated);
    saveExperienceData(updated);
    setDeleteId(null);
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    saveExperienceData(experienceList);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_EXP);
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Experience Management</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage your professional experience.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <Plus className="w-4 h-4" /> Add Experience
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

      {/* Grid or Empty State */}
      {!showForm && (
        experienceList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
            <Briefcase className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No experience records added yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experienceList.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-5 hover:border-white/15 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-semibold">{item.position}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-primary text-sm font-medium mb-1">{item.organization}</p>
                <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-white/50 text-xs mb-3">{item.duration}</span>
                <p className="text-[--text-muted] text-xs line-clamp-3">{item.description}</p>
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
              <h2 className="text-white font-semibold text-lg">{editingId ? 'Edit Experience' : 'Add New Experience'}</h2>
              <button onClick={handleCancel} className="p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Position / Title *</label>
                  <input type="text" name="position" value={form.position} onChange={handleChange} className={`${inputClass} ${errors.position ? 'border-red-500/50' : ''}`} placeholder="e.g. Frontend Developer" />
                  {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position}</p>}
                </div>
                <div>
                  <label className={labelClass}>Organization *</label>
                  <input type="text" name="organization" value={form.organization} onChange={handleChange} className={`${inputClass} ${errors.organization ? 'border-red-500/50' : ''}`} placeholder="e.g. Google" />
                  {errors.organization && <p className="text-red-400 text-xs mt-1">{errors.organization}</p>}
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <input type="text" name="duration" value={form.duration} onChange={handleChange} className={inputClass} placeholder="e.g. Jan 2023 - Present" />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} placeholder="Details about your responsibilities, achievements, etc." />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
              <button onClick={handleCancel} className="px-5 py-2 rounded-xl text-sm text-[--text-muted] bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> {editingId ? 'Update Experience' : 'Add Experience'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0f1e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-white font-semibold mb-2">Delete Experience?</h3>
              <p className="text-[--text-muted] text-sm mb-6">This will permanently remove the record.</p>
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
            <span className="text-sm font-medium">Experience saved successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 text-green-400/60 hover:text-green-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExperience;
