import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Upload, X, CheckCircle, MapPin, Mail, Phone, Image as ImageIcon } from 'lucide-react';
import { getData, saveData } from '../../services/dataService';

const INITIAL_DATA = {
  biography: '',
  careerObjective: '',
  interests: '',
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminAbout = () => {
  const [formData, setFormData] = useState(() => {
    const data = getData('aboutData');
    return data ? { ...INITIAL_DATA, ...data } : INITIAL_DATA;
  });
  const [settings] = useState(() => getData('websiteSettings') || {});
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



  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSaving(true);
    const existingData = getData('aboutData') || {};
    saveData('aboutData', { ...existingData, ...formData });
    
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

                {settings.profileImage && (
                  <img src={settings.profileImage} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
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
                  {settings.location && <p className="text-[10px] text-[--text-muted] flex items-center gap-2"><MapPin className="w-3 h-3"/> {settings.location}</p>}
                  {settings.contactEmail && <p className="text-[10px] text-[--text-muted] flex items-center gap-2"><Mail className="w-3 h-3"/> {settings.contactEmail}</p>}
                  {settings.contactPhone && <p className="text-[10px] text-[--text-muted] flex items-center gap-2"><Phone className="w-3 h-3"/> {settings.contactPhone}</p>}
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
