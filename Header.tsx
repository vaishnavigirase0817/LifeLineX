/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLocation } from 'react-router-dom';
import { 
  Bell,
  User,
  Search
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/store/useStore';

export default function Header() {
  const location = useLocation();
  const { user } = useStore();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Welcome';
    if (path === '/dashboard') return 'Health Dashboard';
    if (path === '/checker') return 'AI Health Analyzer';
    if (path === '/map') return 'Smart Health Maps';
    if (path === '/emergency') return 'Emergency Response';
    if (path === '/consultation') return 'Tele-Consultation';
    if (path === '/schemes') return 'Government Schemes';
    return 'LifeLineX';
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
        <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
          System Active
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer">
          <Search className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
        <div className="relative cursor-pointer group">
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-900">{user?.name || 'Guest User'}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              Health ID: {user ? 'LX-9281' : 'LX-GUEST'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400 overflow-hidden">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
