/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  History, 
  LayoutDashboard, 
  ShieldAlert, 
  MapPin, 
  Stethoscope, 
  FileText,
  User,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/store/useStore';
import { translations } from '@/src/constants/translations';

import { Logo } from '@/src/components/Logo';

export default function Sidebar() {
  const location = useLocation();
  const { user, isRuralMode, toggleRuralMode, logout, language } = useStore();
  const t = translations[language];

  const navItems = [
    { label: t.dashboard, path: '/dashboard', icon: LayoutDashboard },
    { label: t.map, path: '/map', icon: MapPin },
    { label: t.doctors, path: '/consultation', icon: Users },
    { label: t.health, path: '/checker', icon: Stethoscope },
    { label: t.schemes, path: '/schemes', icon: FileText },
    { label: t.profile, path: '/profile', icon: User },
    { label: t.settings, path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full sticky top-0 hidden lg:flex">
      <div className="p-6 flex items-center gap-2">
        <Logo className="w-10 h-10 shadow-lg shadow-blue-100" />
        <span className="text-xl font-bold tracking-tight text-slate-900">
          LifeLine<span className="text-blue-600">X</span>
        </span>
      </div>
      
      <div className="flex-1 px-4 space-y-8 overflow-y-auto pt-4">
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Main Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group",
                location.pathname === item.path 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Support</p>
          <Link
            to="/emergency"
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-3 rounded-xl font-bold transition-all bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
            )}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5" />
              {t.emergency}
            </div>
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          </Link>
        </nav>
      </div>

      <div className="p-4 space-y-4">
        {/* User Card */}
        {user && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                {user.name[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">Lvl 4 Health</p>
              </div>
            </div>
            <button onClick={() => logout()} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-slate-400">
               <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{t.ruralMode}</span>
            </div>
            <button 
              onClick={toggleRuralMode}
              className={cn(
                "w-10 h-5 rounded-full relative transition-colors",
                isRuralMode ? "bg-blue-600" : "bg-slate-700"
              )}
            >
              <motion.div 
                animate={{ x: isRuralMode ? 22 : 4 }}
                className="absolute top-1 w-3 h-3 bg-white rounded-full" 
              />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Optimize UI for slow connections and voice accessibility.</p>
        </div>
      </div>
    </aside>
  );
}
