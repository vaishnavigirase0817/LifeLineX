/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button } from '@/src/components/UI';
import { ShieldAlert, MapPin, PhoneCall, Radio, Send, CheckCircle2, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Emergency() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [pulse, setPulse] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    // Pulse animation for the button
    const interval = setInterval(() => setPulse(p => !p), 1000);
    
    // Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

    return () => clearInterval(interval);
  }, []);

  const handleSOS = () => {
    setStatus('sending');
    // Simulate real-time dispatch
    setTimeout(() => {
      setStatus('sent');
    }, 3000);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Emergency Hub</h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto">
          LifeLineX responders are always on standby. Tap below or say "HELP" to trigger an immediate multi-channel alert.
        </p>
      </div>

      <div className="relative">
        {/* Glow Effects */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ 
                scale: pulse ? 1.5 : 1,
                opacity: pulse ? 0 : 0.5
              }}
              className="absolute inset-0 bg-red-400 rounded-full -z-10"
            />
          )}
        </AnimatePresence>

        <button
          onClick={handleSOS}
          disabled={status !== 'idle'}
          className={cn(
            "relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 transform active:scale-95 shadow-2xl",
            status === 'idle' && "bg-red-600 hover:bg-red-700 shadow-red-500/40",
            status === 'sending' && "bg-orange-500 animate-pulse outline outline-8 outline-orange-100",
            status === 'sent' && "bg-green-600 shadow-green-500/40"
          )}
        >
          {status === 'idle' && (
            <>
              <ShieldAlert className="w-20 h-20 text-white mb-2" />
              <span className="text-2xl font-black text-white tracking-widest uppercase">SOS</span>
              <span className="text-[10px] font-bold text-white/70 uppercase mt-2">Tap to trigger</span>
            </>
          )}

          {status === 'sending' && (
            <>
              <Radio className="w-16 h-16 text-white mb-4 animate-bounce" />
              <span className="text-xl font-black text-white tracking-widest uppercase">Sending...</span>
              <div className="mt-4 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                    className="w-2 h-2 bg-white rounded-full" 
                  />
                ))}
              </div>
            </>
          )}

          {status === 'sent' && (
            <>
              <CheckCircle2 className="w-20 h-20 text-white mb-2" />
              <span className="text-xl font-black text-white tracking-widest uppercase">HELP ON WAY</span>
              <span className="text-[10px] font-bold text-white/70 uppercase mt-2">Estimated Arrival: 8m</span>
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full">
        <Card className="flex items-center gap-6 p-6">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
            isListening ? "bg-green-600 animate-pulse" : "bg-slate-100"
          )}>
            {isListening ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-slate-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Voice Activation</h3>
            <p className="text-xs text-slate-500">Listen for "Help" trigger</p>
          </div>
          <button 
            onClick={toggleVoice}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              isListening ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"
            )}
          >
            {isListening ? "Listening..." : "Enable Voice"}
          </button>
        </Card>

        <Card className="flex items-center gap-6 p-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Live Location</h3>
            <p className="text-xs text-slate-500 truncate">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Detecting..."}
            </p>
          </div>
          <div className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-[10px] font-black uppercase">
            Accurate
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {status === 'sent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
          >
            <div className="p-6 bg-green-50 border border-green-100 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  <h4 className="font-bold text-green-900 uppercase text-xs tracking-widest">Protocol Active</h4>
                </div>
                <span className="text-[10px] font-black text-green-600 uppercase">Alert ID: LX-9482</span>
              </div>
              <ul className="grid grid-cols-2 gap-4 text-xs font-bold text-green-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Nearby Hospitals Notified</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Local Police Informed</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Emergency Contacts Alerted</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> GPS Live Streaming</li>
              </ul>
              <Button variant="danger" className="w-full">
                <PhoneCall className="w-4 h-4" />
                Speak to Emergency Operator
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-slate-400 text-[10px] font-bold uppercase">
              <AlertTriangle className="w-3 h-3" />
              Accidental trigger? Hold to cancel response (15s remaining)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
