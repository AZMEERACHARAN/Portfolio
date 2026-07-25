import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Edit2, X, CheckCircle, Code2, Smartphone, Layout, Palette, Briefcase, Zap, Globe, Server, Database } from 'lucide-react';
import { getData, saveData } from '../../services/dataService';
import { subscribeToServices, addService, updateService, deleteService, migrateServicesToFirestore } from '../../services/servicesService';
import { uploadImage } from '../../services/storageService';

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
  icon: 'Code2',
  imageUrl: '',
  technologies: '',
  displayOrder: 0,
  isFeatured: false,
  isActive: true
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_SRV);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  React.useEffect(() => {
    const init = async () => {
      await migrateServicesToFirestore();
      const unsubscribe = subscribeToServices((data) => {
        setServices(data);
      });
      return () => unsubscribe();
    };
    init();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
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

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_SRV, displayOrder: services.length });
    setErrors({});
    setImageFile(null);
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    const techString = Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.technologies || '');
    setForm({ ...item, technologies: techString });
    setErrors({});
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSaving(true);
    
    try {
      let finalImageUrl = form.imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile, 'services');
      }

      const techArray = form.technologies 
        ? form.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const finalData = { 
        ...form, 
        imageUrl: finalImageUrl,
        technologies: techArray
      };

      if (editingId) {
        await updateService(editingId, finalData);
      } else {
        await addService(finalData);
      }
      
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_SRV);
      setImageFile(null);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
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
                <div>
                  <label className={labelClass}>Technologies (comma-separated)</label>
                  <input type="text" name="technologies" value={form.technologies} onChange={handleChange} className={inputClass} placeholder="e.g. React, Node.js, Firebase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                  <label className={labelClass}>Service Image (Optional)</label>
                  <div className="mt-2 flex items-center gap-4">
                    {form.imageUrl && (
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#0f1123] border border-white/10 shrink-0">
                        <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <input type="file" id="srvImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <label htmlFor="srvImage" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors">
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
            <span className="text-sm font-medium">Service saved successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 text-green-400/60 hover:text-green-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;
