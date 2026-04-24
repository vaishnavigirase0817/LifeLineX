/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useStore } from '@/src/store/useStore';

export default function AnimatedBackground() {
  const isRuralMode = useStore((state) => state.isRuralMode);

  if (isRuralMode) return <div className="fixed inset-0 bg-slate-50 -z-10" />;

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-slate-50">
      {/* Gradient Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/2 -right-24 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-24 left-1/3 w-64 h-64 bg-red-100/30 rounded-full blur-3xl"
      />

      {/* ECG Line (SVG Path Animation) */}
      <div className="absolute inset-x-0 bottom-0 h-32 opacity-10">
        <svg viewBox="0 0 1000 100" className="w-full h-full preserve-3d">
          <motion.path
            d="M 0 50 L 100 50 L 110 50 L 120 20 L 130 80 L 140 50 L 300 50 L 310 50 L 320 10 L 330 90 L 340 50 L 500 50 L 510 50 L 520 25 L 530 75 L 540 50 L 700 50 L 710 50 L 720 5 L 730 95 L 740 50 L 900 50 L 910 50 L 920 30 L 930 70 L 940 50 L 1000 50"
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth="2"
            animate={{
              pathLength: [0, 1],
              pathOffset: [0, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>
      </div>
    </div>
  );
}
