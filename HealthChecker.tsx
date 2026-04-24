/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Card, Button } from '@/src/components/UI';
import { useStore } from '@/src/store/useStore';
import { Activity, Search, AlertCircle, CheckCircle2, ChevronRight, Sparkles, Wand2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function HealthChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setHealthScore = useStore(state => state.setHealthScore);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a professional medical assistant part of the LifeLineX ecosystem. 
        Analyze the following symptoms provided by the user: "${symptoms}"
        
        Provide:
        1. A brief summary of potential issues.
        2. Risk Level (Low, Medium, High).
        3. Suggested immediate actions.
        4. Disclaimer that this is not a professional medical diagnosis.
        
        Answer in clear Markdown format with emojis.`,
      });

      const text = response.text;
      if (text) {
        setResult(text);
        // Simulate updating health score based on analysis
        const scoreMatch = text.match(/High/i) ? 45 : text.match(/Medium/i) ? 65 : 85;
        setHealthScore(scoreMatch);
      } else {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to LifeLineX AI. Please try again later or seek immediate help if it's an emergency.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-indigo-200">
          <Sparkles className="w-3 h-3" />
          AI Diagnostics Interface
        </div>
        <h1 className="text-4xl font-black text-slate-900">Health Sentry AI</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Describe your symptoms in natural language. Our neural health engine will evaluate risks and suggest next steps.
        </p>
      </div>

      <Card className="p-8 shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Describe Symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: I have a persistent dry cough, slight fever, and mild chest discomfort for 2 days..."
              className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all resize-none outline-none"
            />
          </div>

          <Button 
            onClick={analyzeSymptoms}
            className="w-full h-14 text-lg" 
            isLoading={isLoading}
            disabled={!symptoms.trim()}
          >
            <Wand2 className="w-5 h-5" />
            Analyze with AI
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest pl-4">
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              AI Analysis Result
            </div>
            
            <Card className="bg-white border-blue-100 prose prose-slate prose-sm max-w-none">
              <div className="p-4">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-wrap gap-4 items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase">Next Recommended Actions:</p>
                <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                  Nearest Hospital <ChevronRight className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline">
                  Consult Doctor <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </Card>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 text-blue-800 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p>Your Health Index has been updated based on this conversation. You can view progress in the Dashboard.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety Disclaimer */}
      <p className="text-[10px] text-center text-slate-400 max-w-xl mx-auto leading-relaxed">
        <strong>DISCLAIMER:</strong> This AI tool is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
      </p>
    </div>
  );
}
