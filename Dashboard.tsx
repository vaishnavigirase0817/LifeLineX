/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Card, Button } from '@/src/components/UI';
import { useStore } from '@/src/store/useStore';
import { 
  Activity, 
  ShieldAlert, 
  MapPin, 
  Stethoscope, 
  TrendingUp, 
  Heart,
  Droplets,
  Wind,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { AIInsights } from '@/src/components/AIInsights';
import { translations } from '@/src/constants/translations';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const trendData = [
  { name: 'Mon', score: 72 },
  { name: 'Tue', score: 75 },
  { name: 'Wed', score: 74 },
  { name: 'Thu', score: 78 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 80 },
  { name: 'Sun', score: 85 },
];

export default function Dashboard() {
  const { user, healthScore, language } = useStore();
  const navigate = useNavigate();
  const t = translations[language];

  const stats = [
    { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    { label: "Oxygen", value: "98", unit: "%", icon: Wind, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Hydration", value: "85", unit: "%", icon: Droplets, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Sleep", value: "7.2", unit: "h", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t.welcome}, <span className="text-blue-600">{user?.name || 'LifeLine User'}</span>
          </h1>
          <p className="text-sm font-medium text-slate-500">{t.optimizedMessage}</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="gap-2 rounded-2xl" onClick={() => navigate('/profile')}>
              <Plus className="w-4 h-4" /> Add Record
           </Button>
           <Button className="gap-2 shadow-lg shadow-blue-200 rounded-2xl" onClick={() => navigate('/checker')}>
              <Stethoscope className="w-4 h-4" /> Comprehensive Check
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* AI Reliability Card */}
        <Card className="col-span-12 lg:col-span-4 p-8 relative overflow-hidden flex flex-col justify-between border-slate-200 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.liveHealthReliability}</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black text-slate-900 tracking-tighter">{healthScore}</span>
              <div className="flex flex-col">
                <span className="text-blue-600 font-black text-lg flex items-center">
                  <ArrowUpRight className="w-5 h-5" /> 4%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">vs last week</span>
              </div>
            </div>

            <div className="w-full">
              <AIInsights />
            </div>
          </div>
          
          <Button variant="primary" className="mt-8 w-full group py-6 rounded-2xl" onClick={() => navigate('/checker')}>
            Run AI Analysis
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>

        {/* Reliability Trend Chart */}
        <Card className="col-span-12 lg:col-span-8 p-8 flex flex-col border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Health Progression</h3>
              <p className="text-xs font-medium text-slate-500">Weekly predictive reliability score mapping</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> Live Analysis
              </span>
            </div>
          </div>

          <div className="flex-1 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide domain={[60, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '12px'
                  }}
                  cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#2563eb" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 hover:shadow-xl transition-all border-slate-100 group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.unit}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-50 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] font-black uppercase text-green-600 tracking-wide">Status: Optimal</span>
              </div>
            </Card>
          ))}
        </div>

        {/* SOS and Quick Actions */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="p-8 bg-red-600 text-white shadow-2xl shadow-red-200 border-none cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
            onClick={() => navigate('/emergency')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md ring-4 ring-white/10">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">SOS Active Alert</h3>
                <p className="text-xs text-red-100 font-medium opacity-80 uppercase tracking-widest mt-1">Ready for trigger</p>
              </div>
            </div>
            <p className="relative z-10 text-sm font-medium text-red-50 opacity-90 leading-relaxed mb-6">
              Instant GPS-linked emergency alert. Notifies nearest specialists and critical responders with your live health vitals in 3 seconds.
            </p>
            <Button variant="outline" className="relative z-10 bg-white text-red-600 border-white hover:bg-red-50 w-full py-6 font-black rounded-2xl shadow-xl">
              ACTIVATE EMERGENCY SHIELD
            </Button>
          </Card>

          <div className="space-y-6">
            <h3 className="px-2 text-xs font-black uppercase tracking-widest text-slate-400">Next Action Steps</h3>
            <div className="space-y-3">
              {[
                { title: 'Smart Maps', icon: MapPin, path: '/map', desc: 'Find nearest 24/7 ICU units', color: 'blue' },
                { title: 'Tele-Consult', icon: Users, path: '/consultation', desc: 'Active specialists: 14 online', color: 'indigo' },
                { title: 'Govt Schemes', icon: FileText, path: '/schemes', desc: '2 new eligibility alerts', color: 'green' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-blue-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={cn("p-2 rounded-xl", `bg-${action.color}-50 text-${action.color}-600`)}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none">{action.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium italic-none">{action.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notifications Sidebar */}
        <Card className="col-span-12 lg:col-span-4 p-6 border-slate-200 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{t.criticalAlerts}</h3>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          
          <div className="flex-1 space-y-4">
            {[
              { title: 'Air Quality Warning', time: '10m ago', msg: 'High AQI detected in your area. Use N95 if outdoors.', type: 'env' },
              { title: 'Hydration Target', time: '1h ago', msg: 'You are 15% behind your daily hydration goal.', type: 'health' },
              { title: 'System Sync', time: '4h ago', msg: 'Your medical ID LX-2981 is now verified globally.', type: 'system' },
            ].map((alert, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 relative group hover:bg-white transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{alert.title}</p>
                  <span className="text-[9px] font-bold text-slate-400">{alert.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{alert.msg}</p>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="mt-6 w-full text-xs font-bold text-slate-500 rounded-xl" onClick={() => navigate('/notifications')}>
            View All Notifications
          </Button>
        </Card>
      </div>
    </div>
  );
}
