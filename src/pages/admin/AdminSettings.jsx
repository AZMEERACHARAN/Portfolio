import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Image as ImageIcon, Upload, Globe, Palette, User, Link, Phone, Search, FileText, Lock, CheckCircle, X } from 'lucide-react';
import { getData } from '../../services/dataService';
import { subscribeToSettings, updateSettings, migrateSettingsToFirestore } from '../../services/settingsService';
import { subscribeToContact, updateContact, migrateContactToFirestore } from '../../services/contactService';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'social', label: 'Social Links', icon: Link },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'footer', label: 'Footer', icon: FileText },
  { id: 'security', label: 'Security', icon: Lock }
];

const inputClass = "w-full bg-[#0f1123] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";
const labelClass = "block text-xs font-medium text-[--text-muted] mb-1.5 uppercase tracking-wider";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    websiteTitle: '', websiteDescription: '', ownerName: '', tagline: '',
    logoUrl: '', faviconUrl: '', resumeUrl: '', profileImageUrl: '',
    email: '', phone: '', location: '', github: '', linkedin: '',
    instagram: '', twitter: '', portfolioUrl: '', theme: 'dark',
    primaryColor: '#7c6bff', accentColor: '#5eead4', copyrightText: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const init = async () => {
      await migrateSettingsToFirestore();
      await migrateContactToFirestore();
      
      let currentSettings = {};
      let currentContact = {};

      const unsubSettings = subscribeToSettings((data) => {
        if (data) {
          currentSettings = data;
          setFormData(prev => ({ ...prev, ...data, ...currentContact }));
        }
        setIsLoading(false);
      });

      const unsubContact = subscribeToContact((data) => {
        if (data) {
          currentContact = data;
          setFormData(prev => ({ ...prev, ...currentSettings, ...data }));
        }
      });

      return () => {
        unsubSettings();
        unsubContact();
      };
    };
    init();
  }, []);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleNestedChange = (category, field, value) => {
    // Legacy support not needed for flat schema, just update the flat property directly
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.websiteTitle?.trim()) newErrors.websiteTitle = 'Website Title is required';
    if (!formData.ownerName?.trim()) newErrors.ownerName = 'Owner Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Contact Email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      showToastMsg('Please fix the validation errors.', 'error');
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updateSettings(formData);
      
      const contactData = {
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        linkedin: formData.linkedin,
        github: formData.github,
        instagram: formData.instagram,
        twitter: formData.twitter,
        website: formData.portfolioUrl
      };
      await updateContact(contactData);
      
      showToastMsg('Settings and contact info saved successfully!');
    } catch (error) {
      showToastMsg('Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const data = getData('websiteSettings');
    if (data) {
      setFormData(data);
      setErrors({});
      showToastMsg('Changes reset to last saved state.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Tabs */}
      <div className="md:w-64 shrink-0">
        <div className="sticky top-24 bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-4 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_15px_rgba(124,107,255,0.1)]' 
                    : 'text-[--text-muted] hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {TABS.find(t => t.id === activeTab)?.label} Settings
            </h1>
            <p className="text-[--text-muted] text-sm mt-1">
              Manage your global {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
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
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-[#0a0d1c]/70 backdrop-blur-xl border border-white/6 rounded-2xl p-6 min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-4" />
              <p className="text-white/40 text-sm">Loading settings...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
              
              {/* --- GENERAL TAB --- */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Website Title</label>
                    <input
                      type="text"
                      name="websiteTitle"
                      value={formData.websiteTitle || ''}
                      onChange={handleChange}
                      className={`${inputClass} ${errors.websiteTitle ? 'border-red-500/50 focus:border-red-500' : ''}`}
                      placeholder="My Portfolio"
                    />
                    {errors.websiteTitle && <p className="text-red-400 text-xs mt-1.5">{errors.websiteTitle}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Website Description</label>
                    <textarea
                      name="websiteDescription"
                      value={formData.websiteDescription || ''}
                      onChange={handleChange}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="Brief description of the website..."
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                    <div>
                      <label className={labelClass}>Logo URL</label>
                      <input type="url" name="logoUrl" value={formData.logoUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
                      <div className="mt-2 w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {formData.logoUrl ? (
                          <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <span className="text-xs text-[--text-muted]">No Logo</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Favicon URL</label>
                      <input type="url" name="faviconUrl" value={formData.faviconUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
                      <div className="mt-2 w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        {formData.faviconUrl ? (
                          <img src={formData.faviconUrl} alt="Favicon" className="w-full h-full object-contain p-2" />
                        ) : (
                          <span className="text-xs text-[--text-muted]">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PROFILE TAB --- */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Full Name / Owner Name</label>
                      <input type="text" name="ownerName" value={formData.ownerName || ''} onChange={handleChange} className={`${inputClass} ${errors.ownerName ? 'border-red-500/50' : ''}`} placeholder="e.g. Jane Doe" />
                      {errors.ownerName && <p className="text-red-400 text-xs mt-1.5">{errors.ownerName}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Professional Title / Tagline</label>
                      <input type="text" name="tagline" value={formData.tagline || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Frontend Developer" />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Primary Email</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputClass} placeholder="hello@example.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className={inputClass} placeholder="+1 234 567 890" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Location</label>
                      <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className={inputClass} placeholder="e.g. New York, USA" />
                    </div>
                    <div>
                      <label className={labelClass}>Resume/CV URL</label>
                      <input type="url" name="resumeUrl" value={formData.resumeUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <label className={labelClass}>Profile Image URL</label>
                    <input type="url" name="profileImageUrl" value={formData.profileImageUrl || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
                    <div className="mt-4 w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-[#0f1123]">
                      {formData.profileImageUrl ? (
                        <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[--text-muted]">No Img</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- SOCIAL LINKS TAB --- */}
              {activeTab === 'social' && (
                <div className="space-y-5">
                  {Object.entries({
                    github: 'GitHub URL',
                    linkedin: 'LinkedIn URL',
                    twitter: 'X (Twitter) URL',
                    instagram: 'Instagram URL',
                    portfolioUrl: 'Other Portfolio URL'
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      <input 
                        type="url" 
                        name={key}
                        value={formData[key] || ''} 
                        onChange={handleChange} 
                        className={inputClass} 
                        placeholder="https://..." 
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* --- APPEARANCE TAB --- */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Theme Mode</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="theme" value="dark" checked={formData.theme === 'dark' || !formData.theme} onChange={handleChange} className="accent-primary" />
                        <span className="text-white text-sm">Dark Theme</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="theme" value="light" checked={formData.theme === 'light'} onChange={handleChange} className="accent-primary" />
                        <span className="text-white text-sm">Light Theme</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
                    <div>
                      <label className={labelClass}>Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" name="primaryColor" value={formData.primaryColor || '#7c6bff'} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <input type="text" name="primaryColor" value={formData.primaryColor || '#7c6bff'} onChange={handleChange} className={`${inputClass} flex-1`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" name="secondaryColor" value={formData.secondaryColor || '#22d3ee'} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <input type="text" name="secondaryColor" value={formData.secondaryColor || '#22d3ee'} onChange={handleChange} className={`${inputClass} flex-1`} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" name="accentColor" value={formData.accentColor || '#5eead4'} onChange={handleChange} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <input type="text" name="accentColor" value={formData.accentColor || '#5eead4'} onChange={handleChange} className={`${inputClass} flex-1`} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="animationToggle" checked={formData.animationToggle ?? true} onChange={handleChange} className="sr-only" />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${formData.animationToggle !== false ? 'bg-primary' : 'bg-white/10'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.animationToggle !== false ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Enable Animations</p>
                        <p className="text-xs text-[--text-muted]">Toggle heavy particle and scroll animations.</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* --- CONTACT TAB --- */}
              {activeTab === 'contact' && (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className={`${inputClass} ${errors.email ? 'border-red-500/50' : ''}`} placeholder="contact@example.com" />
                      {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className={inputClass} placeholder="+1 234 567 890" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Location / Address</label>
                    <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className={inputClass} placeholder="e.g. New York, USA" />
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 space-y-5">
                    <h3 className="text-white font-semibold text-sm">Social Media Links</h3>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>LinkedIn URL</label>
                        <input type="url" name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className={inputClass} placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div>
                        <label className={labelClass}>GitHub URL</label>
                        <input type="url" name="github" value={formData.github || ''} onChange={handleChange} className={inputClass} placeholder="https://github.com/..." />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Instagram URL</label>
                        <input type="url" name="instagram" value={formData.instagram || ''} onChange={handleChange} className={inputClass} placeholder="https://instagram.com/..." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SEO TAB --- */}
              {activeTab === 'seo' && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Meta Title</label>
                    <input type="text" name="metaTitle" value={formData.metaTitle || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Jane Doe - Portfolio" />
                  </div>
                  <div>
                    <label className={labelClass}>Meta Description</label>
                    <textarea name="metaDescription" value={formData.metaDescription || ''} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Brief summary for search engines..." />
                  </div>
                  <div>
                    <label className={labelClass}>Meta Keywords (Comma separated)</label>
                    <input type="text" name="metaKeywords" value={formData.metaKeywords || ''} onChange={handleChange} className={inputClass} placeholder="react, developer, portfolio..." />
                  </div>
                  <div>
                    <label className={labelClass}>Open Graph Image (Social Share Preview)</label>
                    <div className="mt-2 flex flex-col gap-3">
                      {formData.openGraphImage && (
                        <img src={formData.openGraphImage} alt="OG Preview" className="w-full max-w-[300px] aspect-video object-cover rounded-xl border border-white/10" />
                      )}
                      <input type="file" id="ogImageUpload" accept="image/*" onChange={(e) => handleImageUpload(e, 'openGraphImage')} className="hidden" />
                      <label htmlFor="ogImageUpload" className="w-fit px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white cursor-pointer transition-colors inline-block">
                        Upload OG Image
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* --- FOOTER TAB --- */}
              {activeTab === 'footer' && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Copyright Text</label>
                    <input type="text" name="copyrightText" value={formData.copyrightText || ''} onChange={handleChange} className={inputClass} placeholder="© 2026 Your Name. All rights reserved." />
                  </div>
                  <div>
                    <label className={labelClass}>Footer Description</label>
                    <textarea name="footerDescription" value={formData.footerDescription || ''} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Short blurb in the footer..." />
                  </div>
                </div>
              )}

              {/* --- SECURITY TAB --- */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3 text-orange-200">
                    <Lock className="w-5 h-5 shrink-0 text-orange-400 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-orange-400 mb-1">Security Settings</p>
                      <p className="opacity-80 leading-relaxed">
                        The authentication system is currently a frontend mock. Changing the password here will not securely protect your site in a production environment unless a backend is integrated.
                      </p>
                    </div>
                  </div>
                  
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className={labelClass}>Current Password</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>New Password</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                    <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all">
                      Update Password
                    </button>
                  </div>
                </div>
              )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 border backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
              toast.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}
          >
            {toast.type === 'error' ? <X className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminSettings;
