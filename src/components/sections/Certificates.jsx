import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, X, Calendar, Building2 } from 'lucide-react';
import { getCertificatesData } from '../../services/certificatesApi';

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const loadCertificates = () => {
      const data = getCertificatesData();
      setCertificates(data || []);
    };
    loadCertificates();
    window.addEventListener('storage', loadCertificates);
    return () => window.removeEventListener('storage', loadCertificates);
  }, []);

  return (
    <section id="certificates" className="py-32 relative">
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
          >
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary-2 uppercase tracking-widest font-semibold">
              Qualifications
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight"
          >
            Licenses & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2">Certifications</span>
          </motion.h2>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            No certificates added yet. Add them in the admin panel.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(124,107,255,0.15)] flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-black cursor-pointer" onClick={() => setSelectedCert(cert)}>
                  {cert.image ? (
                    <img 
                      src={cert.image} 
                      alt={cert.name} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/20">
                      <Award className="w-12 h-12 mb-2" />
                      <span className="text-xs">No image provided</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80`} />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg`}>
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors" onClick={(e) => e.stopPropagation()}>
                        Verify <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-2 transition-colors">
                    {cert.name}
                  </h3>
                  <div className="mt-auto space-y-2 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" /> {cert.organization}
                    </div>
                    {cert.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" /> {cert.date}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
              onClick={() => setSelectedCert(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0b0f1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-2 sm:p-4">
                <div className="relative aspect-[1.4/1] w-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
                  {selectedCert.image ? (
                    <img 
                      src={selectedCert.image} 
                      alt={selectedCert.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-white/40">
                      <Award className="w-16 h-16 mb-4" />
                      <p>No preview available</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-2xl font-bold text-white">{selectedCert.name}</h3>
                    <p className="text-white/70">{selectedCert.organization} {selectedCert.date ? `• ${selectedCert.date}` : ''}</p>
                    {selectedCert.link && (
                      <a href={selectedCert.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:text-primary-2 transition-colors">
                        View Official Certificate <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
