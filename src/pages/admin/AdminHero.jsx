import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Upload, X, CheckCircle, Globe, Briefcase, MessageCircle, Camera } from 'lucide-react';
import { getHeroData, saveHeroData } from '../../services/heroApi';

// Mock initial data
const INITIAL_DATA = {
  name: 'Azmeera Charan',
  role: 'Frontend Developer',
  description: 'Building exceptional digital experiences with modern web technologies. Passionate about UI/UX and clean code.',
  resumeLink: 'https://example.com/resume.pdf',
  image: 'https://via.placeholder.com/400x400/1e293b/ffffff?text=AC', // Mock image
  social: {
    github: 'https://github.com/azmeeracharan',
    linkedin: 'https://linkedin.com/in/azmeeracharan',
    twitter: '',
    instagram: ''
  }
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminHero = () => {
  const [formData, setFormData] = useState(() => getHeroData() || INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length > 200) newErrors.description = 'Description must be less than 200 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [name]: value }
    }));
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
    // Persist to localStorage
    saveHeroData(formData);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400); // Shorter mock delay since save is synchronous
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
          <h1 className="text-2xl font-bold text-white">Hero Section</h1>
          <p className="text-[--text-muted] text-sm mt-1">Manage your introduction and primary call to action.</p>
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
          {/* Basic Info Card */}
          <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs">01</span>
              Basic Information
            </h2>
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.name ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="e.g. Jane Doe"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass}>Job Role / Title</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`${inputClass} ${errors.role ? 'border-red-500/50 focus:border-red-500' : ''}`}
                    placeholder="e.g. Full Stack Developer"
                  />
                  {errors.role && <p className="text-red-400 text-xs mt-1.5">{errors.role}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>Short Description (Max 200 chars)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none ${errors.description ? 'border-red-500/50 focus:border-red-500' : ''}`}
                  placeholder="A brief introduction about yourself..."
                />
                <div className="flex justify-between items-center mt-1.5">
                  {errors.description ? (
                    <p className="text-red-400 text-xs">{errors.description}</p>
                  ) : (
                    <span />
                  )}
                  <p className={`text-xs ${formData.description.length > 200 ? 'text-red-400' : 'text-[--text-muted]'}`}>
                    {formData.description.length}/200
                  </p>
                </div>
              </div>
              <div>
                <label className={labelClass}>Resume/CV Link</label>
                <input
                  type="url"
                  name="resumeLink"
                  value={formData.resumeLink}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Media & Social Card */}
          <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent-2/20 text-accent-2 flex items-center justify-center text-xs">02</span>
              Media & Social
            </h2>
            <div className="space-y-6">
              {/* Profile Image */}
              <div>
                <label className={labelClass}>Profile Image</label>
                <div className="mt-2 flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shrink-0 bg-[#0f1123]">
                    {formData.image ? (
                      <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[--text-muted]">No Img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input 
                        type="file" 
                        id="imageUpload" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                      <label 
                        htmlFor="imageUpload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Choose new image
                      </label>
                    </div>
                    <p className="text-[--text-muted] text-xs mt-2">Recommended: Square image, at least 400x400px. Max size 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-white/10 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5" /> GitHub
                  </label>
                  <input type="url" name="github" value={formData.social.github} onChange={handleSocialChange} className={inputClass} placeholder="github.com/username" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">
                    <Briefcase className="w-3.5 h-3.5" /> LinkedIn
                  </label>
                  <input type="url" name="linkedin" value={formData.social.linkedin} onChange={handleSocialChange} className={inputClass} placeholder="linkedin.com/in/username" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">
                    <MessageCircle className="w-3.5 h-3.5" /> Twitter
                  </label>
                  <input type="url" name="twitter" value={formData.social.twitter} onChange={handleSocialChange} className={inputClass} placeholder="twitter.com/username" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider">
                    <Camera className="w-3.5 h-3.5" /> Instagram
                  </label>
                  <input type="url" name="instagram" value={formData.social.instagram} onChange={handleSocialChange} className={inputClass} placeholder="instagram.com/username" />
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
            {/* Mock browser header */}
            <div className="h-8 border-b border-white/5 bg-[#0a0d1c] flex items-center px-3 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            
            {/* Preview Content */}
            <div className="p-6 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
              {/* Fake gradient background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-primary to-accent-2 mb-4">
                  <img src={formData.image || INITIAL_DATA.image} alt="Preview" className="w-full h-full rounded-full object-cover border-2 border-[#050711]" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold mb-3">
                  {formData.role || 'Your Role'}
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">{formData.name || 'Your Name'}</h4>
                <p className="text-[11px] text-[--text-muted] max-w-[240px] mx-auto leading-relaxed">
                  {formData.description || 'Your description will appear here...'}
                </p>
                
                <div className="flex justify-center gap-3 mt-6">
                  {formData.social.github && <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"><Globe className="w-3.5 h-3.5 text-white/70" /></div>}
                  {formData.social.linkedin && <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"><Briefcase className="w-3.5 h-3.5 text-white/70" /></div>}
                  {formData.social.twitter && <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"><MessageCircle className="w-3.5 h-3.5 text-white/70" /></div>}
                  {formData.social.instagram && <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"><Camera className="w-3.5 h-3.5 text-white/70" /></div>}
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

export default AdminHero;
