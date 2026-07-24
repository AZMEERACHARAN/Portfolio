import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, CheckCircle, Code2, Smartphone, Layout, Palette, Briefcase, Zap, Globe, Server, Database } from 'lucide-react';
import { getServicesData, saveServicesData } from '../../services/servicesApi';

const ICON_MAP = {
  Code2: <Code2 className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />
};

const EMPTY_SRV = {
  title: '',
  description: '',
  icon: 'Code2'
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminServices = () => {
  const [services, setServices] = useState(() => getServicesData() || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_SRV);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
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
    setForm(EMPTY_SRV);
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
      updated = services.map(item => item.id === editingId ? { ...item, ...form } : item);
    } else {
      updated = [...services, { id: Date.now().toString(), ...form }];
    }
    setServices(updated);
    saveServicesData(updated);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = services.filter(item => item.id !== id);
    setServices(updated);
    saveServicesData(updated);
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Services Management</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage what you offer.</p>
        </div>
        <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {!showForm && (
        services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
            <Zap className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No services added yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item) => (
              <motion.div
                key={item.id}
                className="group bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6 hover:border-white/15 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-lg">
                    {ICON_MAP[item.icon] || <Zap className="w-5 h-5" />}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-[--text-muted] text-sm line-clamp-3">{item.description}</p>
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
              <h2 className="text-white font-semibold text-lg">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Service Name *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} className={`${inputClass} ${errors.title ? 'border-red-500/50' : ''}`} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Icon Selection</label>
                  <div className="grid grid-cols-5 gap-3 mt-2">
                    {Object.keys(ICON_MAP).map(iconName => (
                      <button
                        key={iconName}
                        onClick={() => setForm(p => ({ ...p, icon: iconName }))}
                        className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${
                          form.icon === iconName 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'bg-[#0f1123] border-white/10 text-[--text-muted] hover:border-white/30 hover:text-white'
                        }`}
                        title={iconName}
                      >
                        {ICON_MAP[iconName]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-[--text-muted] bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b0f1e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-white font-semibold mb-2">Delete?</h3>
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
    </div>
  );
};

export default AdminServices;
