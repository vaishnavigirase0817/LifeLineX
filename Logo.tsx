/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Outer Circle Ring */}
        <circle cx="50" cy="50" r="48" stroke="#1E40AF" strokeWidth="4" />
        
        {/* Stylized Circular Background split */}
        <rect x="0" y="0" width="100" height="100" fill="white" />
        
        {/* Cross Segments */}
        {/* Blue Segment */}
        <path d="M40 25H60V75H40V25Z" fill="#1E40AF" />
        <path d="M25 40H75V60H25V40Z" fill="#1E40AF" />
        
        {/* Red Overlay for segments to mimic the split look */}
        <path d="M50 25H60V50H50V25Z" fill="#DC2626" />
        <path d="M50 50H75V60H50V50Z" fill="#DC2626" />
        <path d="M25 50H50V60H25V50Z" fill="#1E40AF" />
        <path d="M40 50H50V75H40V50Z" fill="#1E40AF" />
        
        {/* Heartbeat pulse line through the center */}
        <path 
           d="M20 50H35L42 30L58 70L65 50H80" 
           stroke="white" 
           strokeWidth="6" 
           strokeLinecap="round" 
           strokeLinejoin="round" 
           className="drop-shadow-sm"
        />
        
        {/* Inner glow effect for the cross */}
        <path 
           d="M20 50H35L42 30L58 70L65 50H80" 
           stroke="rgba(255,255,255,0.3)" 
           strokeWidth="2" 
           strokeLinecap="round" 
           strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
