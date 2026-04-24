/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button } from '@/src/components/UI';
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  Award,
  Globe2,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Schemes() {
  const [filters, setFilters] = useState({ gender: '', age: '', income: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);

  const schemes = [
    {
      title: "Ayushman Bharat PM-JAY",
      tag: "Health Cover",
      desc: "Provides health coverage of up to INR 5 Lakh per family per year for secondary and tertiary care hospitalization.",
      eligibility: "Lower income households, SECC database listed.",
      benefits: ["Cashless treatment", "All pre-existing conditions covered", "Portable across India"]
    },
    {
      title: "Pradhan Mantri Suraksha Bima Yojana",
      tag: "Insurance",
      desc: "Accident insurance scheme offering one year cover, renewable from year to year.",
      eligibility: "Aged 18-70 with a savings bank account.",
      benefits: ["Death benefit of 2 Lakh", "Partial disability cover of 1 Lakh"]
    },
    {
      title: "Janani Suraksha Yojana (JSY)",
      tag: "Maternal",
      desc: "Safe motherhood intervention to reduce maternal and neonatal mortality by promoting institutional delivery.",
      eligibility: "Pregnant women from BPL/SC/ST households.",
      benefits: ["Cash assistance for delivery", "Post-natal care support"]
    }
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setResultsShown(true);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-green-200">
          <Globe2 className="w-3 h-3" />
          National Welfare Portal
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Government Scheme Sentry</h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Find public health schemes and subsidies you are eligible for. We bridge the gap between policy and people.
        </p>
      </div>

      <Card className="p-8 border-slate-100 shadow-2xl">
        <div className="grid md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Age Group</label>
            <select 
              value={filters.age}
              onChange={(e) => setFilters({...filters, age: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            >
              <option value="">Select Age</option>
              <option value="0-18">Child (0-18)</option>
              <option value="19-59">Adult (19-59)</option>
              <option value="60+">Senior (60+)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Gender</label>
            <select 
              value={filters.gender}
              onChange={(e) => setFilters({...filters, gender: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Annual Income</label>
            <select 
              value={filters.income}
              onChange={(e) => setFilters({...filters, income: e.target.value})}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            >
              <option value="">Select Income</option>
              <option value="low">Below 2.5 LPA</option>
              <option value="mid">2.5 - 8 LPA</option>
              <option value="high">Above 8 LPA</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto h-12 px-12"
            isLoading={isSearching}
          >
            Check Eligibility
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {resultsShown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                < Award className="w-5 h-5 text-yellow-500" />
                Matching Schemes <span className="text-sm font-normal text-slate-400">({schemes.length})</span>
              </h2>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><Filter className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><Search className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {schemes.map((scheme, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col p-8 hover:border-blue-200 group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {scheme.tag}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600"><Share2 className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-blue-600"><Download className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {scheme.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                      {scheme.desc}
                    </p>

                    <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-2 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Benefits</p>
                      <ul className="space-y-1">
                        {scheme.benefits.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-600">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold">Likely Eligible</span>
                      </div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 text-blue-600">
                        Apply Now <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-600 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 mt-12 overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black">Missing a document?</h3>
                <p className="text-blue-100 max-w-sm">Our AI can help you generate applications or guide you to the nearest E-Mitra center.</p>
                <Button variant="outline" className="bg-white border-white text-blue-600 shadow-none hover:bg-blue-50">
                  <HelpCircle className="w-4 h-4" /> Get Help
                </Button>
              </div>
              <div className="relative z-10 flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-blue-600 bg-white p-1">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Advisor" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
