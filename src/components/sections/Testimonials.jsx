import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, Star, Loader2 } from 'lucide-react';
import { subscribeToTestimonials } from '../../services/testimonialsService';



const TestimonialCard = ({ testimonial }) => (
  <div className="w-[85vw] max-w-[350px] sm:max-w-[400px] flex-shrink-0 glass p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 mx-3 sm:mx-4 whitespace-normal flex flex-col h-full">
    <div className="flex justify-between items-start mb-6 gap-2">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img 
          src={testimonial.profileImage} 
          alt={testimonial.name} 
          loading="lazy"
          decoding="async"
          className="w-14 h-14 rounded-full object-cover border-2 border-primary/50 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold break-words">{testimonial.name}</h4>
          <p className="text-xs text-text-muted break-words">
            {testimonial.role} {testimonial.organization && `at ${testimonial.organization}`}
          </p>
        </div>
      </div>
      <MessageSquareQuote className="w-8 h-8 text-primary/30 flex-shrink-0" />
    </div>
    <p className="text-white/70 text-sm leading-relaxed mb-6 italic flex-grow break-words">
      "{testimonial.message}"
    </p>
    <div className="flex gap-1 mt-auto flex-shrink-0">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
        />
      ))}
    </div>
  </div>
);

const Testimonials = React.memo(() => {
  const [testimonials, setTestimonials] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = subscribeToTestimonials((data) => {
      const activeTestimonials = data
        .filter(t => t.isActive !== false)
        .sort((a, b) => {
          const orderA = a.displayOrder || 0;
          const orderB = b.displayOrder || 0;
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });
      setTestimonials(activeTestimonials);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg"
          >
            <MessageSquareQuote className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary-2 uppercase tracking-widest font-semibold">
              Client Reviews
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight"
          >
            What People <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-2">Say</span>
          </motion.h2>
        </div>

      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-white/40 text-sm">No testimonials available yet.</p>
        </div>
      ) : (
        <div className="relative w-full flex overflow-hidden">
          {/* Gradient Masks for fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#030308] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#030308] to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            className="flex items-stretch whitespace-nowrap py-4 will-change-transform"
            style={{ width: "fit-content" }}
          >
            {/* Duplicate the array to create seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      )}

    </section>
  );
});

export default Testimonials;
