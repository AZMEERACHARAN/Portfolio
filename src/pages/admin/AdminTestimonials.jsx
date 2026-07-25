import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, MessageSquareQuote, Upload, User } from 'lucide-react';
import { getData, saveData } from '../../services/dataService';

const EMPTY_TEST = {
  name: '',
  role: '',
  review: '',
  rating: 5,
  photo: ''
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState(() => getData('testimonialsData') || []);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_TEST);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.review.trim()) e.review = 'Review is required';
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
      reader.onloadend = () => setForm(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setForm(EMPTY_TEST);
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
      updated = testimonials.map(item => item.id === editingId ? { ...item, ...form } : item);
    } else {
      updated = [...testimonials, { id: Date.now().toString(), ...form }];
    }
    setTestimonials(updated);
    saveData('testimonialsData', updated);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = testimonials.filter(item => item.id !== id);
    setTestimonials(updated);
    saveData('testimonialsData', updated);
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials Management</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage client reviews and feedback.</p>
        </div>
        <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {!showForm && (
        testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
            <MessageSquareQuote className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No testimonials added yet.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <motion.div
                key={item.id}
                className="group bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6 hover:border-white/15 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                      {item.photo ? <img src={item.photo} alt={item.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-white/40" />}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{item.name}</h3>
                      <p className="text-[--text-muted] text-xs">{item.role}</p>
                    </div>
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
                <p className="text-[--text-muted] text-sm italic">"{item.review}"</p>
                <div className="mt-4 text-yellow-400 text-xs">
                  {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
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
              <h2 className="text-white font-semibold text-lg">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className={`${inputClass} ${errors.name ? 'border-red-500/50' : ''}`} />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass}>Role / Title</label>
                  <input type="text" name="role" value={form.role} onChange={handleChange} className={inputClass} placeholder="e.g. CEO of Company" />
                </div>
                <div>
                  <label className={labelClass}>Rating (1-5)</label>
                  <input type="number" min="1" max="5" name="rating" value={form.rating} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Review *</label>
                  <textarea name="review" value={form.review} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} />
                  {errors.review && <p className="text-red-400 text-xs mt-1">{errors.review}</p>}
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Photo</label>
                  <div className="mt-1 flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#0f1123] border border-white/10 shrink-0 flex items-center justify-center">
                      {form.photo ? (
                        <img src={form.photo} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-white/20" />
                      )}
                    </div>
                    <div>
                      <input type="file" id="testPhoto" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <label htmlFor="testPhoto" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" /> Choose Image
                      </label>
                      {form.photo && (
                        <button onClick={() => setForm(p => ({ ...p, photo: '' }))} className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                          <X className="w-3 h-3" /> Remove
                        </button>
                      )}
                    </div>
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

export default AdminTestimonials;
