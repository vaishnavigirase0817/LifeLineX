/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Send, HeartPulse, Sparkles, Volume2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const VoiceCommandUI = () => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        handleVoiceCommand(currentTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          setAiResponse("Microphone access was denied. Please enable it in your browser settings to use voice commands.");
        } else {
          setAiResponse("I encountered an error with speech recognition. Please try again.");
        }
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = async (text: string) => {
    if (!text) return;
    
    setIsLoading(true);
    setAiResponse('');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user said: "${text}". As an AI healthcare assistant for LifeLineX, provide a very concise (max 2 sentences), supportive, and professional response. If it's a medical emergency (like mention of heart attack, stroke, etc.), strongly advise triggering the RED ALERT / SOS button immediately.`,
      });

      const resultText = response.text || "I'm here to help. Could you please repeat that?";
      setAiResponse(resultText);
      speakResponse(resultText);
    } catch (error) {
      console.error("Gemini Error:", error);
      setAiResponse("I'm sorry, I'm having trouble connecting to my brain right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setAiResponse('');
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Speech Recognition is not supported in your browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-6 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-bold tracking-tight">LifeLineX AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsActive(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 relative">
              {isListening ? (
                <div className="flex gap-1 items-center h-12">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [12, 48, 24, 36, 12] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.8, 
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  ))}
                </div>
              ) : (
                <motion.div 
                  animate={isLoading ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl border border-blue-50"
                >
                  {isLoading ? (
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  ) : (
                    <MicOff className="w-8 h-8 opacity-20" />
                  )}
                </motion.div>
              )}
              
              <p className={cn(
                "text-center text-sm font-bold transition-all duration-300 px-4",
                isListening ? "text-blue-600" : "text-slate-400"
              )}>
                {isListening ? "Listening..." : isLoading ? "AI is processing..." : "Tap to speak your symptoms"}
              </p>
            </div>

            <div className="space-y-4">
              {transcript && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 self-start max-w-[90%]"
                >
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block mb-1">You</span>
                  "{transcript}"
                </motion.div>
              )}

              {aiResponse && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-blue-600 rounded-2xl text-sm text-white self-end ml-auto max-w-[90%] shadow-lg shadow-blue-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-200 block">AI Assistant</span>
                  </div>
                  {aiResponse}
                </motion.div>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-xl",
                  isLoading 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : isListening
                      ? "bg-red-500 text-white shadow-red-200 hover:bg-red-600"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                )}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isListening ? "Stop" : "Activate Voice"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-red-500 bg-red-50 py-3 rounded-xl border border-red-100 uppercase tracking-widest text-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Say "Emergency" for Immediate SOS
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsActive(!isActive)}
        className={cn(
          "w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-2xl group relative",
          isActive ? "bg-white text-slate-600" : "bg-blue-600 text-white scale-110 rotate-0 hover:rotate-12"
        )}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="mic"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Mic className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-4 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

