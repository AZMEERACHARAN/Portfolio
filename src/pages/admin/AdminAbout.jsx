import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Upload, X, CheckCircle, MapPin, Mail, Phone, Image as ImageIcon } from 'lucide-react';
import { getAboutData, saveAboutData } from '../../services/aboutApi';

const INITIAL_DATA = {
  biography: '',
  careerObjective: '',
  interests: '',
  location: '',
  email: '',
  phone: '',
  image: ''
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminAbout = () => {
  const [formData, setFormData] = useState(() => getAboutData() || INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.biography.trim()) newErrors.biography = 'Biography is required';
    if (!formData.careerObjective.trim()) newErrors.careerObjective = 'Career Objective is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    saveAboutData(formData);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">About Section</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage your biography and contact information.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[--text-muted] bg-white/5 hover:bg-white/10 hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSaving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Editor Form (Left 3 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Main Content */}
          <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs">01</span>
              About Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Biography</label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} resize-none ${errors.biography ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="Tell your story..."
                />
                {errors.biography && <p className="text-red-400 text-xs mt-1.5">{errors.biography}</p>}
              </div>
              
              <div>
                <label className={labelClass}>Career Objective</label>
                <textarea
                  name="careerObjective"
                  value={formData.careerObjective}
                  onChange={handleChange}
                  rows={2}
                  className={`${inputClass} resize-none ${errors.careerObjective ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="Your professional goals..."
                />
                {errors.careerObjective && <p className="text-red-400 text-xs mt-1.5">{errors.careerObjective}</p>}
              </div>

              <div>
                <label className={labelClass}>Interests (comma separated)</label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="React, AI, Design, Open Source..."
                />
              </div>
            </div>
          </div>

          {/* Media & Contact */}
          <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent-2/20 text-accent-2 flex items-center justify-center text-xs">02</span>
              Media & Contact
            </h2>
            <div className="space-y-6">
              {/* Profile Image */}
              <div>
                <label className={labelClass}>About Image</label>
                <div className="mt-2 flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0 bg-[#0f1123]">
                    {formData.image ? (
                      <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[--text-muted]">
                        <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                        <span className="text-[10px]">No Img</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input 
                        type="file" 
                        id="aboutImageUpload" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="aboutImageUpload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Choose new image
                      </label>
                    </div>
                    <p className="text-[--text-muted] text-xs mt-2">Recommended: Portrait or square image. Max size 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t border-white/10 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" /> Location
                  </label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="New York, USA" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="hello@example.com" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+1 234 567 890" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Preview (Right 2 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <h3 className="text-white font-semibold text-sm px-1">Live Preview</h3>
          <div className="sticky top-24 bg-[#050711] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="h-8 border-b border-white/5 bg-[#0a0d1c] flex items-center px-3 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            
            <div className="p-6 relative overflow-hidden min-h-[400px] flex flex-col">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
              
              <div className="relative z-10 flex flex-col gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
                )}
                
                <h4 className="text-lg font-bold text-white">Who I Am</h4>
                <p className="text-xs text-[--text-muted] leading-relaxed line-clamp-4">
                  {formData.biography || 'Your biography will appear here...'}
                </p>

                {formData.careerObjective && (
                  <div className="p-3 mt-2 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-white/90 italic">"{formData.careerObjective}"</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.split(',').filter(i => i.trim()).slice(0, 3).map((interest, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md bg-primary/20 text-primary text-[10px] font-medium">
                      {interest.trim()}
                    </span>
                  ))}
                  {formData.interests.split(',').filter(i => i.trim()).length > 3 && (
                    <span className="px-2 py-1 rounded-md bg-white/5 text-white/50 text-[10px] font-medium">
                      +{formData.interests.split(',').filter(i => i.trim()).length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                  {formData.location && <p className="text-[10px] text-[--text-muted] flex items-center gap-2"><MapPin className="w-3 h-3"/> {formData.location}</p>}
                  {formData.email && <p className="text-[10px] text-[--text-muted] flex items-center gap-2"><Mail className="w-3 h-3"/> {formData.email}</p>}
                  {formData.phone && <p className="text-[10px] text-[--text-muted] flex items-center gap-2"><Phone className="w-3 h-3"/> {formData.phone}</p>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
            <span className="text-sm font-medium">Changes saved successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 text-green-400/60 hover:text-green-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAbout;
