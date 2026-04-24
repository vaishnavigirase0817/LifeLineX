/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/store/useStore';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, className, hover = true, ...props }: CardProps) {
  const isRuralMode = useStore(state => state.isRuralMode);
  return (
    <div 
      className={cn(
        "bg-white border border-slate-200 rounded-xl p-6 shadow-sm",
        hover && "hover:shadow-md transition-all duration-300",
        isRuralMode && "rounded-lg border-2 border-slate-400 p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading,
  ...props 
}: ButtonProps) {
  const isRuralMode = useStore(state => state.isRuralMode);

  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700",
    secondary: "bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700",
    outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-red-500 text-white shadow-lg shadow-red-100 hover:bg-red-600",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    dark: "bg-slate-900 text-white hover:bg-slate-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-5 py-2.5 text-sm font-semibold",
    lg: "px-8 py-3 text-base font-bold",
    xl: "px-10 py-5 text-lg font-black uppercase tracking-wider"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 active:scale-95",
        variants[variant],
        sizes[isRuralMode ? 'lg' : size],
        isRuralMode && "rounded-lg border-b-4 border-slate-700",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
