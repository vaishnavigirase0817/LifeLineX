/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { VoiceCommandUI } from './VoiceCommandUI';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';
  const isLanding = location.pathname === '/';

  if (isAuth || isLanding) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 italic-none relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <VoiceCommandUI />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          
          <VoiceCommandUI />
        </main>
      </div>

      <footer className="hidden md:flex h-8 border-t border-slate-200 bg-white/50 items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
        © 2026 LifeLineX Public Health Ecosystem • Predict. Prevent. Protect.
      </footer>
    </div>
  );
}
