import React, { useState, useEffect } from 'react';
import { Save, Upload, X, CheckCircle, Settings } from 'lucide-react';
import { getSettingsData, saveSettingsData } from '../../services/settingsApi';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY_SETTINGS = {
  websiteTitle: 'My Portfolio',
  footerText: '© 2026 My Portfolio. All rights reserved.',
  themeColor: '#7c6bff',
  logo: '',
  favicon: ''
};

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminSettings = () => {
  const [form, setForm] = useState(EMPTY_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const data = getSettingsData();
    if (data) setForm(data);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, [field]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    saveSettingsData(form);
    // Dispatch custom event to let App.jsx know settings changed without storage event (storage event doesn't fire on the tab that makes the change)
    window.dispatchEvent(new Event('settingsChanged'));
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-white">Global Settings</h1>
          <p className="text-[--text-muted] text-sm mt-1">Configure your website's meta data.</p>
        </div>
      </div>

      <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Website Title (Browser Tab)</label>
              <input type="text" name="websiteTitle" value={form.websiteTitle} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Footer Text</label>
              <input type="text" name="footerText" value={form.footerText} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Primary Theme Color (Meta)</label>
              <div className="flex gap-4">
                <input type="color" name="themeColor" value={form.themeColor} onChange={handleChange} className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
                <input type="text" name="themeColor" value={form.themeColor} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Logo Upload */}
            <div>
              <label className={labelClass}>Website Logo (Navbar)</label>
              <div className="mt-2 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0f1123] border border-white/10 flex items-center justify-center p-2 shrink-0">
                  {form.logo ? <img src={form.logo} alt="logo" className="w-full h-full object-contain" /> : <span className="text-xs text-white/20">None</span>}
                </div>
                <div>
                  <input type="file" id="logoUpload" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="hidden" />
                  <label htmlFor="logoUpload" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" /> Upload Logo
                  </label>
                  {form.logo && (
                    <button onClick={() => setForm(p => ({ ...p, logo: '' }))} className="mt-2 block text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
              </div>
            </div>

            {/* Favicon Upload */}
            <div>
              <label className={labelClass}>Favicon (Browser Tab Icon)</label>
              <div className="mt-2 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0f1123] border border-white/10 flex items-center justify-center shrink-0">
                  {form.favicon ? <img src={form.favicon} alt="favicon" className="w-full h-full object-contain" /> : <span className="text-[10px] text-white/20">None</span>}
                </div>
                <div>
                  <input type="file" id="favUpload" accept="image/*" onChange={(e) => handleImageUpload(e, 'favicon')} className="hidden" />
                  <label htmlFor="favUpload" className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white cursor-pointer transition-colors">
                    <Upload className="w-3 h-3" /> Upload Favicon
                  </label>
                  {form.favicon && (
                    <button onClick={() => setForm(p => ({ ...p, favicon: '' }))} className="ml-3 text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSaving ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving Settings...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(34,197,94,0.2)] text-green-400"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Settings saved successfully!</span>
            <button onClick={() => setShowToast(false)} className="ml-2 text-green-400/60 hover:text-green-400">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSettings;
