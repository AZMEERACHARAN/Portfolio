import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, CheckCircle, Trophy, FolderGit2, Cpu, GitBranch, Code2, Award, Clock, Star, Target } from 'lucide-react';
import { getData, saveData } from '../../services/dataService';
import { subscribeToAchievements, addAchievement, updateAchievement, deleteAchievement, migrateAchievementsToFirestore } from '../../services/achievementsService';
import { uploadImage } from '../../services/storageService';

const ICON_MAP = {
  FolderGit2: <FolderGit2 className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  GitBranch: <GitBranch className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />
};

const EMPTY_ACH = {
  title: '',
  value: '',
  suffix: '+',
  icon: 'Trophy',
  description: '',
  category: '',
  organization: '',
  achievementDate: '',
  imageUrl: '',
  certificateUrl: '',
  displayOrder: 0,
  isFeatured: false,
  isActive: true
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_ACH);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  React.useEffect(() => {
    const init = async () => {
      await migrateAchievementsToFirestore();
      const unsubscribe = subscribeToAchievements((data) => {
        setAchievements(data);
      });
      return () => unsubscribe();
    };
    init();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.value.toString().trim()) e.value = 'Value is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, imageUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleCertUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, certificateUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_ACH, displayOrder: achievements.length });
    setErrors({});
    setImageFile(null);
    setCertFile(null);
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setErrors({});
    setImageFile(null);
    setCertFile(null);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    
    try {
      let finalImageUrl = form.imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, 'achievements');
      }

      let finalCertUrl = form.certificateUrl;
      if (certFile) {
        finalCertUrl = await uploadImage(certFile, 'certificates');
      }

      const finalData = { ...form, imageUrl: finalImageUrl, certificateUrl: finalCertUrl };

      if (editingId) {
        await updateAchievement(editingId, finalData);
      } else {
        await addAchievement(finalData);
      }
      
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_ACH);
      setImageFile(null);
      setCertFile(null);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error saving achievement:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAchievement(id);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements Management</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage your stats and counters.</p>
        </div>
        <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {!showForm && (
        achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0a0d1c]/50 rounded-2xl border border-white/6">
            <Trophy className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No achievements added yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-5 hover:border-white/15 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0">
                  {ICON_MAP[item.icon] || <Trophy className="w-5 h-5" />}
                </div>
                <div className="flex-grow">
                  <h3 className="text-white font-bold text-xl">{item.value}{item.suffix}</h3>
                  <p className="text-[--text-muted] text-xs uppercase tracking-wider">{item.title}</p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-white/50 hover:text-primary hover:bg-primary/10 transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
              <h2 className="text-white font-semibold text-lg">{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-white/5 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Title (e.g. Projects Completed) *</label>
                  <input type="text" name="title" value={form.title} onChange={handleChange} className={`${inputClass} ${errors.title ? 'border-red-500/50' : ''}`} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Value (Number) *</label>
                    <input type="number" name="value" value={form.value} onChange={handleChange} className={`${inputClass} ${errors.value ? 'border-red-500/50' : ''}`} />
                    {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Suffix (e.g. +, %)</label>
                    <input type="text" name="suffix" value={form.suffix} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Detailed description..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <input type="text" name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="e.g. Award" />
                  </div>
                  <div>
                    <label className={labelClass}>Organization</label>
                    <input type="text" name="organization" value={form.organization} onChange={handleChange} className={inputClass} placeholder="e.g. Google" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" name="achievementDate" value={form.achievementDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Display Order</label>
                    <input type="number" min="0" name="displayOrder" value={form.displayOrder} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <span className="text-sm font-medium text-[--text-muted] group-hover:text-white transition-colors">Visible</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-2"></div>
                    </div>
                    <span className="text-sm font-medium text-[--text-muted] group-hover:text-white transition-colors">Featured</span>
                  </label>
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
                
                <div className="pt-4 border-t border-white/5">
                  <label className={labelClass}>Achievement Image</label>
                  <div className="mt-2 flex items-center gap-4">
                    {form.imageUrl && (
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#0f1123] border border-white/10 shrink-0">
                        <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <input type="file" id="achImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <label htmlFor="achImage" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors">
                        Upload Image
                      </label>
                      {form.imageUrl && (
                        <button onClick={() => { setForm(p => ({ ...p, imageUrl: '' })); setImageFile(null); }} className="block mt-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <label className={labelClass}>Certificate / Proof</label>
                  <div className="mt-2 flex items-center gap-4">
                    {form.certificateUrl && (
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#0f1123] border border-white/10 shrink-0">
                        <img src={form.certificateUrl} alt="cert preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <input type="file" id="achCert" accept="image/*" onChange={handleCertUpload} className="hidden" />
                      <label htmlFor="achCert" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors">
                        Upload Certificate
                      </label>
                      {form.certificateUrl && (
                        <button onClick={() => { setForm(p => ({ ...p, certificateUrl: '' })); setCertFile(null); }} className="block mt-2 text-xs text-red-400 hover:text-red-300 transition-colors">
                          Remove Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/5">
              <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm text-[--text-muted] bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none">
                {isSaving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save'}
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

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(34,197,94,0.2)] text-green-400"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Achievement saved successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 text-green-400/60 hover:text-green-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAchievements;
