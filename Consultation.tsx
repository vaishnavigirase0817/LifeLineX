/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button } from '@/src/components/UI';
import { 
  Stethoscope, 
  Search, 
  Send, 
  Video, 
  Phone, 
  MoreVertical, 
  CheckCheck, 
  Paperclip,
  Smile,
  ShieldCheck,
  Star,
  Clock,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  status: 'online' | 'busy' | 'offline';
  image: string;
}

const docs: Doctor[] = [
  { id: 1, name: "Dr. Sarah Mitchell", specialty: "Cardiologist", rating: 4.9, status: 'online', image: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "Dr. James Wilson", specialty: "Dermatologist", rating: 4.7, status: 'online', image: "https://i.pravatar.cc/150?u=james" },
  { id: 3, name: "Dr. Elena Rodriguez", specialty: "Pediatrician", rating: 4.8, status: 'busy', image: "https://i.pravatar.cc/150?u=elena" },
];

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'doctor';
  timestamp: string;
}

export default function Consultation() {
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(docs[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: 'doctor', timestamp: "10:00 AM" }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate doctor reply
    setTimeout(() => {
      const reply: Message = {
        id: messages.length + 2,
        text: "I've received your note. Please tell me more about when these symptoms started.",
        sender: 'doctor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Sidebar - Doctor List */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="w-full bg-white border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 border-r border-slate-100 lg:border-0">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Active Specialists</p>
          {docs.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all",
                selectedDoc?.id === doc.id ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" : "bg-white border border-slate-100 hover:border-blue-200"
              )}
            >
              <div className="relative">
                <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white",
                  doc.status === 'online' ? "bg-green-500" : doc.status === 'busy' ? "bg-orange-500" : "bg-slate-300"
                )} />
              </div>
              <div className="text-left overflow-hidden">
                <h4 className="font-bold text-sm truncate">{doc.name}</h4>
                <p className={cn("text-[10px] uppercase font-black opacity-70", selectedDoc?.id === doc.id ? "text-white" : "text-slate-400")}>
                  {doc.specialty}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-2.5 h-2.5 fill-current text-yellow-400" />
                  <span className="text-[10px] font-bold">{doc.rating}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Card className="p-4 bg-indigo-50 border-indigo-100 hidden lg:block">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h5 className="text-xs font-black text-indigo-900 uppercase">Secure Link</h5>
          </div>
          <p className="text-[10px] text-indigo-700 leading-tight">All consultations are end-to-end encrypted and medical grade compliant.</p>
        </Card>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        {selectedDoc ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={selectedDoc.image} alt={selectedDoc.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm leading-none mb-1">{selectedDoc.name}</h3>
                  <div className="flex items-center gap-2">
                     <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                        <Clock className="w-2.5 h-2.5" /> Response time: ~5m
                     </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Video className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.sender === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm font-medium shadow-sm",
                    msg.sender === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-900 rounded-tl-none border border-slate-100"
                  )}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] font-bold text-slate-400">{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center gap-4 bg-slate-50 rounded-2xl px-4 py-2 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <button className="text-slate-400 hover:text-slate-600"><Paperclip className="w-5 h-5" /></button>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your health concern here..."
                  className="flex-1 bg-transparent border-0 outline-none py-2 text-sm text-slate-900 placeholder:text-slate-400"
                />
                <button className="text-slate-400 hover:text-slate-600"><Smile className="w-5 h-5" /></button>
                <button 
                  onClick={sendMessage}
                  className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <MessageCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Start a Consultation</h3>
            <p className="text-sm text-slate-500 max-w-xs">Select a verified medical specialist from the sidebar to begin your private consultation.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
