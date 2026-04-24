/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/src/components/UI';
import { useStore } from '@/src/store/useStore';

export const AIInsights = () => {
  const { healthScore } = useStore();
  const [insight, setInsight] = useState<string>('Analyzing your health data for personalized insights...');
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsight = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a personalized health AI assistant. 
        The user's current LifeLineX Health Reliability Score is ${healthScore}/100.
        
        Provide a concise, 2-sentence health insight or tip based on this score. 
        If the score is high, focus on maintenance. 
        If it's medium, focus on common improvements (sleep, hydration, light exercise). 
        If it's low, suggest immediate checkup or rest.
        
        Keep it professional yet encouraging.`,
      });
      setInsight(response.text || 'Ensure you stay hydrated and get 7-8 hours of sleep for optimal recovery.');
    } catch (err) {
      console.error(err);
      setInsight('AI engine is busy. Remember: regular movement and hydration are key to a high health score.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [healthScore]);

  return (
    <Card className="p-6 bg-blue-900 text-white relative overflow-hidden group border-blue-800">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-12 h-12" />
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-200" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">AI Daily Insight</span>
          </div>
          <button 
            onClick={fetchInsight}
            disabled={isLoading}
            className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-blue-300", isLoading && "animate-spin")} />
          </button>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 w-full bg-blue-800/50 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-blue-800/50 rounded animate-pulse" />
            </div>
          ) : (
            <p className="text-sm font-medium leading-relaxed text-blue-50">
              {insight}
            </p>
          )}
        </div>

        {healthScore < 60 && (
          <div className="mt-4 p-2 bg-red-400/20 border border-red-400/30 rounded-lg flex items-center gap-2 text-[10px] font-bold text-red-200">
            <AlertCircle className="w-3 h-3" />
            Action Recommended: Consult a physician.
          </div>
        )}
      </div>
    </Card>
  );
};

// Supporting component for cn if needed, but I'll use it directly
import { cn } from '@/src/lib/utils';
