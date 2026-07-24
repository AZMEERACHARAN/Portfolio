import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, CheckCircle, Award, Upload, Image as ImageIcon } from 'lucide-react';
import { getCertificatesData, saveCertificatesData } from '../../services/certificatesApi';

const EMPTY_CERT = {
  name: '',
  organization: '',
  date: '',
  link: '',
  image: ''
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState(() => getCertificatesData() || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_CERT);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.organization.trim()) e.organization = 'Organization is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setForm(EMPTY_CERT);
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
      updated = certificates.map(item => item.id === editingId ? { ...item, ...form } : item);
    } else {
      updated = [...certificates, { id: Date.now().toString(), ...form }];
    }
    setCertificates(updated);
    saveCertificatesData(updated);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_CERT);
  };

  const handleDelete = (id) => {
    const updated = certificates.filter(item => item.id !== id);
    setCertificates(updated);
    saveCertificatesData(updated);
    setDeleteId(null);
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    saveCertificatesData(certificates);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_CERT);
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Certificates Management</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage your certificates and licenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            <Plus className="w-4 h-4" /> Add Certificate
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
        certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
            <Award className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No certificates added yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl overflow-hidden hover:border-white/15 transition-all"
              >
                <div className="h-32 bg-[#0f1123] border-b border-white/5 flex items-center justify-center overflow-hidden relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/20">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold truncate">{item.name}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-primary text-sm font-medium mb-1">{item.organization}</p>
                  <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-white/50 text-xs">{item.date}</span>
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
              <h2 className="text-white font-semibold text-lg">{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h2>
              <button onClick={handleCancel} className="p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Certificate Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className={`${inputClass} ${errors.name ? 'border-red-500/50' : ''}`} placeholder="e.g. AWS Certified Solutions Architect" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass}>Organization *</label>
                  <input type="text" name="organization" value={form.organization} onChange={handleChange} className={`${inputClass} ${errors.organization ? 'border-red-500/50' : ''}`} placeholder="e.g. Amazon Web Services" />
                  {errors.organization && <p className="text-red-400 text-xs mt-1">{errors.organization}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input type="text" name="date" value={form.date} onChange={handleChange} className={inputClass} placeholder="e.g. Aug 2023" />
                  </div>
                  <div>
                    <label className={labelClass}>Certificate Link</label>
                    <input type="url" name="link" value={form.link} onChange={handleChange} className={inputClass} placeholder="https://..." />
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Certificate Image</label>
                  <div className="mt-1 flex gap-4 items-start">
                    <div className="w-32 h-24 rounded-xl overflow-hidden bg-[#0f1123] border border-white/10 shrink-0 flex items-center justify-center">
                      {form.image ? (
                        <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-white/20">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[10px]">No image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input type="file" id="certImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <label htmlFor="certImage" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" /> Choose Image
                      </label>
                      {form.image && (
                        <button onClick={() => setForm(p => ({ ...p, image: '' }))} className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                          <X className="w-3 h-3" /> Remove
                        </button>
                      )}
                      <p className="text-[--text-muted] text-xs mt-2">Max 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
              <button onClick={handleCancel} className="px-5 py-2 rounded-xl text-sm text-[--text-muted] bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> {editingId ? 'Update Certificate' : 'Add Certificate'}
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
              <h3 className="text-white font-semibold mb-2">Delete Certificate?</h3>
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
            <span className="text-sm font-medium">Certificates saved successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 text-green-400/60 hover:text-green-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;
