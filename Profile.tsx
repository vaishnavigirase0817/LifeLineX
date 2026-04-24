/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity, 
  MapPin, 
  Phone, 
  Edit2, 
  Camera, 
  Plus, 
  ArrowRight,
  TrendingUp,
  History,
  ShieldCheck,
  Smartphone,
  Users
} from 'lucide-react';
import { Card, Button } from '@/src/components/UI';
import { useStore } from '@/src/store/useStore';
import { cn } from '@/src/lib/utils';

export default function Profile() {
  const { user, updateUser } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || 28,
    gender: user?.gender || 'Male',
    email: user?.email || '',
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const healthHistory = [
    { date: 'Oct 12, 2023', type: 'Fever check', score: 82, status: 'Clear' },
    { date: 'Sep 24, 2023', type: 'Routine scan', score: 75, status: 'Follow-up' },
    { date: 'Aug 05, 2023', type: 'Cardiac analysis', score: 91, status: 'Perfect' },
  ];

  const familyMembers = [
    { name: 'Arjun', relation: 'Brother', score: 88, age: 31 },
    { name: 'Sunita', relation: 'Wife', score: 94, age: 26 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-20 -mb-20 blur-3xl" />
        </div>
      </div>

      <div className="px-8 -mt-24 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details Card */}
        <Card className="lg:col-span-2 p-8 shadow-2xl relative overflow-hidden backdrop-blur-md bg-white/90 border-white">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-200 border-4 border-white overflow-hidden">
                {user?.avatar ? (
                  <motion.img 
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.05 }}
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  user?.name?.[0] || 'U'
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all text-slate-600">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                  <p className="text-slate-500 font-medium">{user?.email}</p>
                </div>
                {!isEditing ? (
                  <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Gender</span>
                  {isEditing ? (
                    <select 
                      value={formData.gender} 
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="mt-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  ) : (
                    <span className="mt-1 font-bold text-slate-900">{user?.gender || 'Male'}</span>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Age</span>
                  {isEditing ? (
                    <input 
                      type="number"
                      value={formData.age} 
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                      className="mt-1 w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="mt-1 font-bold text-slate-900">{user?.age || 28} Years</span>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Height</span>
                  <span className="mt-1 font-bold text-slate-900">178 cm</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Weight</span>
                  <span className="mt-1 font-bold text-slate-900">72 kg</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Health Score Summary Card */}
        <Card className="p-8 shadow-2xl relative overflow-hidden bg-slate-900 text-white border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Health Overview</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-black text-white">{user?.healthScore}</p>
                <p className="text-xs font-bold text-blue-400 mt-1 uppercase tracking-wider">Reliability Score</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex items-center justify-center">
                <span className="text-[10px] font-black">TOP 5%</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold">Vaccination Status</span>
                </div>
                <span className="text-[10px] font-black text-green-400">Up to date</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold">Last Analysis</span>
                </div>
                <span className="text-[10px] font-black text-slate-400">3 Days ago</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Health History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h2>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All Trends</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {healthHistory.map((item, idx) => (
              <Card key={idx} className="p-5 hover:shadow-lg transition-all border-slate-100 group">
                <div className="flex flex-col h-full justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</p>
                    <p className="text-sm font-bold text-slate-900">{item.type}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="px-2 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 border border-slate-100">
                      Score: {item.score}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      item.status === 'Perfect' ? "text-green-500" : "text-amber-500"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Family Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Family Members</h2>
            </div>
            <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {familyMembers.map((member, idx) => (
              <Card key={idx} className="p-4 flex items-center justify-between border-slate-100 hover:bg-slate-50 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-black">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="text-[10px] font-medium text-slate-400 capitalize">{member.relation} • {member.age} Yrs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-blue-600">{member.score}</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Score</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
