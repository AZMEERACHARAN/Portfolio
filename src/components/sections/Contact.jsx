import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MapPin, CheckCircle2 } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const socialLinks = [
  { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/', color: 'hover:text-[#2dba4e] hover:bg-[#2dba4e]/10 border-transparent hover:border-[#2dba4e]/50' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://linkedin.com/', color: 'hover:text-[#0077b5] hover:bg-[#0077b5]/10 border-transparent hover:border-[#0077b5]/50' },
  { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com/', color: 'hover:text-[#1da1f2] hover:bg-[#1da1f2]/10 border-transparent hover:border-[#1da1f2]/50' },
  { name: 'Instagram', icon: InstagramIcon, url: 'https://instagram.com/', color: 'hover:text-[#e1306c] hover:bg-[#e1306c]/10 border-transparent hover:border-[#e1306c]/50' }
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 relative min-h-screen flex items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
          >
            <Send className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary-2 uppercase tracking-widest font-semibold">
              Get In Touch
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight"
          >
            Let's Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2">Together</span>
          </motion.h2>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info & Socials */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col gap-8 bg-[#0b0f1e]/80">
              <h3 className="text-2xl font-bold text-white mb-2">Contact Information</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                I'm currently available for freelance work and full-time opportunities. If you have a project that needs some creative touch, I'd love to hear about it.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:scale-110 group-hover:text-primary-2 transition-all duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Email Me At</p>
                    <p className="text-sm sm:text-base font-medium text-white group-hover:text-primary-2 transition-colors">hello@azmeera.dev</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-2 group-hover:bg-accent-2/20 group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Location</p>
                    <p className="text-sm sm:text-base font-medium text-white group-hover:text-accent-2 transition-colors">Hyderabad, India</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-4">
                <p className="text-xs uppercase tracking-wider text-text-muted mb-4 font-mono">Follow Me</p>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                    <a 
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-12 h-12 rounded-xl bg-white/5 border flex items-center justify-center text-white/70 transition-all duration-300 ${social.color} hover:scale-110 hover:-translate-y-1 shadow-lg`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative"
          >
            <div className="glass p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#0b0f1e]/80 hover:bg-[#0b0f1e]/90 transition-colors shadow-2xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-text-muted ml-1 font-mono">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe" 
                      className="w-full py-4 px-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary/60 focus:bg-white/10 transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-text-muted ml-1 font-mono">Your Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com" 
                      className="w-full py-4 px-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary/60 focus:bg-white/10 transition-all" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-text-muted ml-1 font-mono">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Project Inquiry" 
                    className="w-full py-4 px-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary/60 focus:bg-white/10 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-text-muted ml-1 font-mono">Your Message</label>
                  <textarea 
                    rows="5" 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Hello Charan, I'd like to discuss..." 
                    className="w-full py-4 px-5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-primary/60 focus:bg-white/10 transition-all resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(124,107,255,0.3)] hover:shadow-[0_0_30px_rgba(124,107,255,0.5)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending Message...</span>
                  ) : (
                    <>Send Message <Send className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>

            {/* Success Popup overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-[#0b0f1e]/95 backdrop-blur-md border border-emerald-500/30"
                >
                  <div className="text-center p-8 flex flex-col items-center">
                    <motion.div 
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-emerald-200/70">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
