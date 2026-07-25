import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Code, Sparkles, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

// Magnetic Button Component
const MagneticButton = ({ children, className, onClick, type = "button" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const ADMIN_EMAIL    = 'admin@azmeera.dev';
const ADMIN_PASSWORD = 'admin123';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [authError, setAuthError]       = useState('');
  const emailRef    = React.useRef(null);
  const passwordRef = React.useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  // Dynamic Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Mouse Spotlight Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Admin login — checks credentials
  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    const email = emailRef.current?.value?.trim();
    const pass  = passwordRef.current?.value;
    
    if (!email || !pass) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setTimeout(() => navigate('/admin/dashboard'), 900);
    } catch (error) {
      setLoading(false);
      setAuthError('Invalid credentials or login failed. Please try again.');
    }
  };



  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030308] overflow-hidden text-text selection:bg-primary/30">
      
      {/* Spotlight Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 107, 255, 0.05), transparent 40%)`
        }}
      />

      {/* Animated Aurora & Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/40 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -100, 0], y: [0, 100, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-accent/40 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], x: [0, 50, 0], y: [0, 50, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-primary-2/30 rounded-full blur-[150px]"
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ["100vh", "-10vh"],
              x: Math.sin(i) * 100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
            className="absolute bottom-0 w-1 h-1 bg-white/40 rounded-full blur-[1px]"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center space-y-8 z-30 relative"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-t-2 border-primary border-r-2 border-r-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent-2 animate-pulse" />
              </div>
            </div>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm tracking-[0.3em] text-white/70 font-mono uppercase"
            >
              Authenticating
            </motion.p>
          </motion.div>
        ) : (
          <div key="login" className="container max-w-7xl mx-auto px-6 z-30 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[700px]">
            
            {/* Left Side: Branding */}
            <motion.div 
              initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex flex-col justify-center space-y-10"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:bg-white/10 transition-colors"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-2 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-2"></span>
                </span>
                <span className="text-xs font-mono text-white/80 uppercase tracking-widest">{greeting}</span>
              </motion.div>
              
              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight"
                >
                  Welcome Back, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-2 to-accent animate-gradient bg-[length:200%_auto]">
                    Azmeera Charan
                  </span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-text-muted max-w-lg leading-relaxed font-light"
                >
                  Building beautiful digital experiences through creativity and code.
                </motion.p>
              </div>

              {/* Social Icons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center gap-4 pt-4"
              >
                {[
                  { icon: GithubIcon, label: "GitHub" },
                  { icon: LinkedinIcon, label: "LinkedIn" },
                  { icon: TwitterIcon, label: "Twitter" }
                ].map((social, idx) => {
                  const IconComponent = social.icon;
                  return (
                    <MagneticButton 
                      key={idx}
                      className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors group relative overflow-hidden"
                    >
                      <IconComponent className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
                    </MagneticButton>
                  );
                })}
                <div className="ml-4 h-px w-12 bg-white/10" />
                <span className="text-xs font-mono text-text-muted uppercase tracking-widest ml-4">Follow My Journey</span>
              </motion.div>
            </motion.div>

            {/* Right Side: Login Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[460px] mx-auto relative group"
            >
              {/* Animated Gradient Border Wrapper */}
              <motion.div 
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-transparent to-accent-2/30 opacity-50 blur-xl group-hover:opacity-100 transition-opacity duration-700"
              />
              
              <motion.div 
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-surface/30 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[2.5rem] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                {/* Card Top Inner Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                <div className="lg:hidden text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md mb-6">
                    <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">{greeting}</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold mb-2 tracking-tight">Welcome Back</h2>
                  <p className="text-sm text-text-muted">Azmeera Charan</p>
                </div>

                <div className="mb-10 hidden lg:block">
                  <h3 className="text-2xl font-semibold mb-2 tracking-tight">Sign In</h3>
                  <p className="text-sm text-text-muted font-light">Login to manage your personal portfolio</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-medium text-white/60 ml-1 tracking-wide uppercase font-mono">Email Address</label>
                    <div className="relative group/input">
                      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${focusedInput === 'email' ? 'opacity-100' : 'opacity-0'} bg-gradient-to-r from-primary/20 to-accent-2/20 blur-md`} />
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10 ${focusedInput === 'email' ? 'text-primary-2' : 'text-white/40 group-hover/input:text-white/60'}`} />
                      <input
                        ref={emailRef}
                        type="email"
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="admin@azmeera.dev"
                        className="relative w-full bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-all duration-300 shadow-inner z-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-medium text-white/60 ml-1 tracking-wide uppercase font-mono">Password</label>
                    <div className="relative group/input">
                      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${focusedInput === 'password' ? 'opacity-100' : 'opacity-0'} bg-gradient-to-r from-primary/20 to-accent-2/20 blur-md`} />
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 z-10 ${focusedInput === 'password' ? 'text-primary-2' : 'text-white/40 group-hover/input:text-white/60'}`} />
                      <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="••••••••"
                        className="relative w-full bg-[#0a0a0f]/60 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-all duration-300 shadow-inner z-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10 p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Auth error */}
                  {authError && (
                    <p className="text-red-400 text-xs text-center px-2 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                      {authError}
                    </p>
                  )}

                  {/* Helpers */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer text-text-muted hover:text-white transition-colors group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-4 h-4 rounded-[4px] border border-white/20 bg-black/20 checked:bg-primary checked:border-primary transition-all cursor-pointer shadow-inner" />
                        <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      Remember Me
                    </label>
                    <button type="button" className="text-text-muted hover:text-white transition-colors font-medium">
                      Forgot Password?
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 space-y-4">
                    <MagneticButton
                      type="submit"
                      className="group/btn relative w-full py-4 rounded-2xl font-semibold text-white overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(124,107,255,0.2)] hover:shadow-[0_0_30px_rgba(124,107,255,0.4)] transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent-2 transition-transform duration-500 group-hover/btn:scale-[1.05]" />
                      <div className="relative flex items-center justify-center gap-2">
                        Sign In <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </MagneticButton>


                  </div>
                </form>

                <div className="mt-10 text-center">
                  <div className="inline-flex items-center gap-4 w-full mb-4">
                    <div className="h-px w-full bg-gradient-to-r from-transparent to-white/10" />
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest whitespace-nowrap">Demo Credentials</span>
                    <div className="h-px w-full bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                  <p className="text-[11px] text-text-muted/70 font-mono">user: admin@azmeera.dev &nbsp;|&nbsp; pass: admin123</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
