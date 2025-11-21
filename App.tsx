import React, { useState } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { Code2, Smartphone, Palette, Database, Rocket, Globe, Mail, Github, ExternalLink, CheckCircle, ArrowDown, Cpu, Zap, Loader2, Send } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import ServiceCard from './components/ServiceCard';
import { Service, Project } from './types';

const services: Service[] = [
  {
    title: 'Web Development',
    description: 'React, Next.js, Three.js. High-performance animated interfaces that convert visitors into customers.',
    icon: Globe,
  },
  {
    title: 'Mobile Apps',
    description: 'Native & Cross-platform iOS/Android solutions using Flutter & React Native. Seamless performance.',
    icon: Smartphone,
  },
  {
    title: 'UI/UX Design',
    description: 'Award-winning aesthetics. We design user flows that feel intuitive and look futuristic.',
    icon: Palette,
  },
  {
    title: 'Backend Architecture',
    description: 'Scalable microservices, high-load systems. Python, Go, Node.js. Secure and fast.',
    icon: Database,
  },
  {
    title: 'AI & Automation',
    description: 'Integration of LLMs, Telegram bots, and business process automation.',
    icon: Cpu,
  },
  {
    title: 'MVP Launch',
    description: 'From concept to market in weeks. Agile development for startups needing speed.',
    icon: Rocket,
  },
];

const projects: Project[] = [
  { id: 1, title: 'CyberTrade Pro', category: 'Fintech', image: 'https://picsum.photos/800/600?random=1' },
  { id: 2, title: 'Neon Market', category: 'E-commerce', image: 'https://picsum.photos/800/600?random=2' },
  { id: 3, title: 'FitAI System', category: 'Health Tech', image: 'https://picsum.photos/800/600?random=3' },
  { id: 4, title: 'Quantum Portfolio', category: 'WebGL', image: 'https://picsum.photos/800/600?random=4' },
];

// --- Animation Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const App: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    details: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  // Moves the background down at 50% of the scroll speed (creating a depth effect)
  const heroBackgroundY = useTransform(scrollY, [0, 1000], [0, 500]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:3001/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Network error');

      setStatus('success');
      setFormData({ name: '', contact: '', details: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-brand-neon/30 selection:text-brand-neon">
      <ThreeBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        
        {/* Parallax Background Layer */}
        <motion.div 
          style={{ y: heroBackgroundY }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none z-0"
        ></motion.div>

        <div className="z-10 text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-brand-neon/50"></div>
            <span className="text-brand-neon font-mono text-sm tracking-[0.3em] uppercase">The Future of Digital</span>
            <div className="h-[1px] w-12 bg-brand-neon/50"></div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9] mb-8 mix-blend-screen"
          >
            SANE4KA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-neon via-white to-brand-purple bg-300% animate-glow">
              PRO TEAM
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-light"
          >
            We craft <span className="text-white font-medium">immersive web experiences</span> and <span className="text-white font-medium">high-load systems</span> for ambitious brands.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <a 
              href="#contact" 
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-none text-lg overflow-hidden transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-brand-neon translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 group-hover:text-black transition-colors">Start Project</span>
            </a>
            <a 
              href="#portfolio" 
              className="group px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-none text-lg transition-all hover:border-brand-neon hover:text-brand-neon"
            >
              View Work
            </a>
          </motion.div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 z-10"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Scroll to Explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-brand-neon to-transparent relative overflow-hidden">
             <motion.div 
               animate={{ y: [-64, 64] }}
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               className="absolute top-0 left-0 w-full h-1/2 bg-white blur-[1px]"
             />
          </div>
        </motion.div>
      </section>

      {/* Statistics Strip */}
      <section className="py-12 border-y border-white/10 bg-black/40 backdrop-blur-md relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
        >
          {[
            { num: '5+', label: 'Years Experience' },
            { num: '120+', label: 'Projects Shipped' },
            { num: '99%', label: 'Client Success' },
            { num: '24/7', label: 'Support' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={fadeInUp}
              className="group cursor-default"
            >
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 group-hover:to-brand-neon transition-all duration-500">{stat.num}</div>
              <div className="text-xs text-brand-500 uppercase tracking-widest font-bold mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-20 border-l-4 border-brand-neon pl-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-2">
              OUR EXPERTISE
            </h2>
            <p className="text-xl text-slate-400">Engineering digital perfection.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32 relative z-10">
        <div className="absolute inset-0 bg-black/80 -z-10 backdrop-blur-sm"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
               <h2 className="text-5xl md:text-7xl font-bold text-white mb-2">SELECTED WORKS</h2>
               <p className="text-brand-purple font-mono tracking-wider">/// SHOWCASE 2024-2025</p>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all"
            >
              All Projects <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={scaleIn}
                className="group relative aspect-[4/3] overflow-hidden bg-slate-900 cursor-pointer"
              >
                {/* Image */}
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-neon group-hover:border-brand-neon group-hover:text-black transition-all duration-300">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-brand-neon font-mono text-xs tracking-widest mb-2 block">
                      {String(index + 1).padStart(2, '0')} / {project.category.toUpperCase()}
                    </span>
                    <h3 className="text-4xl font-bold text-white group-hover:text-brand-neon transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>
                
                {/* Hover Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-neon/50 transition-colors duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black/60 border border-white/10 backdrop-blur-2xl p-8 md:p-16 text-center relative overflow-hidden"
          >
             {/* Decorative Elements */}
             <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-brand-neon/50"></div>
             <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-brand-neon/50"></div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">READY TO SCALE?</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              Leave your details. Our lead developers will analyze your request and provide a technical breakdown within 24 hours.
            </p>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-500/30 p-8 rounded-lg flex flex-col items-center gap-4"
              >
                <CheckCircle className="w-16 h-16 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Request Received</h3>
                <p className="text-green-200">We have sent the data to our team. Check your Telegram shortly.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-sm underline text-slate-400 hover:text-white">Send another</button>
              </motion.div>
            ) : (
              <form className="space-y-4 max-w-md mx-auto relative z-10" onSubmit={handleSubmit}>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <motion.div variants={fadeInUp} className="relative group mb-4">
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-brand-neon focus:bg-white/10 transition-all placeholder:text-slate-600" 
                      placeholder="Name" 
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-neon group-hover:w-full transition-all duration-500"></div>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp} className="relative group mb-4">
                    <input 
                      type="text" 
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-brand-neon focus:bg-white/10 transition-all placeholder:text-slate-600" 
                      placeholder="Telegram / WhatsApp / Email" 
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-neon group-hover:w-full transition-all duration-500"></div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="relative group mb-4">
                    <textarea 
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white focus:outline-none focus:border-brand-neon focus:bg-white/10 transition-all placeholder:text-slate-600 resize-none" 
                      placeholder="Project Details (Optional)" 
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-neon group-hover:w-full transition-all duration-500"></div>
                  </motion.div>
                  
                  <motion.button 
                    variants={fadeInUp}
                    disabled={status === 'loading'}
                    className="w-full py-5 bg-white text-black font-bold tracking-widest hover:bg-brand-neon transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        INITIATE PROTOCOL <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
                {status === 'error' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2">
                    Server connection failed. Make sure backend is running.
                  </motion.p>
                )}
              </form>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex justify-center gap-12 hover:opacity-100 transition-opacity"
            >
               <Github className="w-8 h-8 hover:text-brand-neon cursor-pointer" />
               <Mail className="w-8 h-8 hover:text-brand-neon cursor-pointer" />
               <Zap className="w-8 h-8 hover:text-brand-neon cursor-pointer" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 bg-black text-center text-slate-600 text-xs font-mono border-t border-white/5 relative z-10">
        <p>SYSTEM: ONLINE &nbsp;|&nbsp; SANE4KA PRO &copy; {new Date