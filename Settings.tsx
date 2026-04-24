/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon, 
  Leaf, 
  Bell, 
  Globe, 
  Shield, 
  Lock, 
  ChevronRight,
  Eye,
  Smartphone,
  MessageSquare
} from 'lucide-react';
import { Card, Button } from '@/src/components/UI';
import { useStore } from '@/src/store/useStore';
import { cn } from '@/src/lib/utils';
import { translations } from '@/src/constants/translations';

export default function Settings() {
  const { isRuralMode, toggleRuralMode, language, setLanguage } = useStore();
  const t = translations[language];

  const sections = [
    {
      title: t.preferences,
      items: [
        { 
          label: t.ruralMode, 
          desc: "Low-data interface for low connectivity areas", 
          icon: Leaf,
          control: (
            <button 
              onClick={toggleRuralMode}
              className={cn(
                "w-10 h-5 rounded-full relative transition-colors",
                isRuralMode ? "bg-blue-600" : "bg-slate-200"
              )}
            >
              <motion.div 
                animate={{ x: isRuralMode ? 22 : 4 }}
                className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
              />
            </button>
          )
        },
        { 
          label: t.language, 
          desc: t.languageDesc, 
          icon: Globe,
          control: (
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-xs font-bold text-blue-600 bg-blue-50 border-none rounded-lg px-2 py-1 outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          )
        }
      ]
    },
    {
      title: t.notifications,
      items: [
        { label: "SMS Alerts", desc: "For critical health scores and appointments", icon: Smartphone, toggle: true },
        { label: "App Reminders", desc: "Hydration and daily symptom check reminders", icon: Bell, toggle: true },
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        { label: "Data Sharing", desc: "Manage how your data is shared with local doctors", icon: Shield, arrow: true },
        { label: "Security Lock", desc: "Enable biometric or PIN lock for the app", icon: Lock, arrow: true },
        { label: "Active Sessions", desc: "See devices currently logged into your account", icon: Eye, arrow: true },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.appSettings}</h1>
          <p className="text-sm font-medium text-slate-500">{t.customizeExperience}</p>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">{section.title}</h3>
            <Card className="divide-y divide-slate-100 border-slate-200 overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.label}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  
                  {item.control && <div>{item.control}</div>}
                  {item.toggle && (
                     <button className="w-10 h-5 bg-blue-600 rounded-full relative">
                        <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
                     </button>
                  )}
                  {item.arrow && <ChevronRight className="w-4 h-4 text-slate-300" />}
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      <Card className="p-6 bg-red-50 border-red-100 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold text-red-900">Danger Zone</p>
          <p className="text-xs text-red-600">Permanently delete your account and all health data.</p>
        </div>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-100">Delete Account</Button>
      </Card>
    </div>
  );
}
