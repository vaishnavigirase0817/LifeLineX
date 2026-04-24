/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Button } from '@/src/components/UI';
import { ShieldCheck, Zap, Activity, Users, Globe, Smartphone, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/src/components/Logo';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: "AI Analysis",
      desc: "Smart health risk assessment based on symptoms and history.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: ShieldCheck,
      title: "Emergency SOS",
      desc: "Instant help trigger with real-time location and voice support.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Globe,
      title: "Health Map",
      desc: "Live tracking of nearby hospitals, clinics, and oxygen support.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Smartphone,
      title: "Rural Access",
      desc: "Optimized for low-bandwidth and offline usability in rural zones.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold border border-blue-100"
        >
          <Zap className="w-4 h-4 fill-current" />
          The Future of Public Health is Here
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
          Predict <span className="text-blue-600">→</span> Prevent <span className="text-blue-600">→</span> Protect
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
          LifeLineX is the world's most advanced AI healthcare ecosystem designed to save lives through real-time predictive analysis and emergency response coordination.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/auth', { state: { mode: 'signup' } })}>
            Get Started Free
          </Button>
          <Button variant="danger" size="lg" className="w-full sm:w-auto flex items-center gap-2" onClick={() => navigate('/emergency')}>
            <ShieldCheck className="w-5 h-5" />
            Emergency SOS
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group"
          >
            <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Hero Image / Mockup Placeholder */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 aspect-video md:aspect-[21/9]"
      >
        <img 
          src="https://picsum.photos/seed/healthcare1/1920/1080?blur=1" 
          alt="Dashboard Preview" 
          className="object-cover w-full h-full opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <Logo className="w-16 h-16 mb-6 drop-shadow-2xl" />
          <h2 className="text-4xl font-bold mb-4">Real-Time Health Monitoring</h2>
          <p className="max-w-xl text-center text-slate-300">
            Our AI models process millions of data points to predict outbreaks and individual health risks before they become emergencies.
          </p>
        </div>
      </motion.section>

      {/* Trust Badges */}
      <section className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all py-8">
        <div className="flex items-center gap-2 font-black text-2xl"><Users className="w-6 h-6" /> WHO Inspired</div>
        <div className="flex items-center gap-2 font-black text-2xl"><Globe className="w-6 h-6" /> Global Net</div>
        <div className="flex items-center gap-2 font-black text-2xl"><Search className="w-6 h-6" /> AI Audited</div>
      </section>
    </div>
  );
}
