import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            type: "spring", 
            stiffness: 50, 
            damping: 20 
          }
        }
      }}
      className="group p-8 bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
    >
      {/* Hover Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="mb-6 text-slate-400 group-hover:text-brand-neon transition-colors">
        <Icon className="w-10 h-10" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 group-hover:translate-x-2 transition-transform duration-300">
        {service.title}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
        {service.description}
      </p>
      
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-neon group-hover:w-full transition-all duration-500 ease-out"></div>
    </motion.div>
  );
};

export default ServiceCard;