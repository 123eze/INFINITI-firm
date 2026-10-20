import React, { useState } from 'react';
import { X, Copy, Check, Code2, Sparkles, Box, Sliders } from 'lucide-react';

interface StylingBreakdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StylingBreakdownDrawer: React.FC<StylingBreakdownDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sections = [
    {
      id: 'liquid-glass',
      title: '1. Liquid Glass (Glassmorphism) Recipe',
      description: 'Translucent frosted glass with multi-layered depth, top hairline specular reflection, and rich backdrop blur.',
      tailwindClasses:
        'backdrop-blur-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-[#080b14]/90 border border-white/10 rounded-2xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.65)]',
      explanation: [
        'backdrop-blur-2xl: Produces the ultra-dense optical refraction of high-end frosted silica.',
        'from-white/[0.08] via-white/[0.03] to-[#080b14]/90: Simulates ambient directional downward lighting with deep obsidian depth at the base.',
        'border border-white/10: Subtle 1px hairline boundary separating card geometry from the live fluid canvas.',
        'Top Hairline: h-px bg-gradient-to-r from-transparent via-white/40 to-transparent creates realistic top-edge specular glint.',
      ],
    },
    {
      id: '3d-tilt',
      title: '2. 3D Tilt & Perspective Mechanics',
      description: 'Calculates cursor delta from card center and applies smooth 3D rotations without layout reflow.',
      tailwindClasses:
        'perspective-[1200px] transform-gpu will-change-transform transition-all duration-300 ease-out',
      explanation: [
        'perspective: 1200px (applied to parent): Sets human eye focal distance so rotation has physical optical depth.',
        'rotateX = -((mouseY - centerY) / centerY) * 12deg: Tilts along the horizontal axis in response to vertical cursor displacement.',
        'rotateY = ((mouseX - centerX) / centerX) * 12deg: Tilts along the vertical axis in response to horizontal cursor displacement.',
        'scale3d(1.035, 1.035, 1.035): Gently lifts card forward toward the viewer.',
      ],
    },
    {
      id: 'specular-glare',
      title: '3. Dynamic Specular Glare Sheen',
      description: 'Dynamic radial gradient light reflection that follows the cursor across the glass surface.',
      tailwindClasses:
        'pointer-events-none absolute inset-0 z-20 transition-opacity duration-300',
      explanation: [
        'radial-gradient(circle 320px at {glareX}% {glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 45%, transparent 75%)',
        'Moves organically with cursor coordinates, mimicking real polished crystal refractions.',
      ],
    },
    {
      id: 'neon-aura',
      title: '4. Glowing Neon Aura & Vibrancy Boost',
      description: 'Color-matched radiant neon corona and image saturation multiplier on hover.',
      tailwindClasses:
        'group-hover:scale-106 group-hover:brightness-110 group-hover:contrast-105 group-hover:saturate-120',
      explanation: [
        'box-shadow: 0 24px 60px -12px {glowRgba}, 0 0 35px 2px {glowRgba}, inset 0 0 20px rgba(255,255,255,0.08)',
        'Enhanced Vibrancy on Media: Filter transforms (saturate-120, contrast-105, brightness-110) make the celebrity portrait pop forward vividly.',
      ],
    },
    {
      id: 'grid-layout',
      title: '5. Component Layout & Responsive Grid',
      description: 'Container hierarchy and CSS grid configuration for desktop down to mobile.',
      tailwindClasses:
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      explanation: [
        'Mobile (< 640px): 1 column full-width comfortable touch cards.',
        'Tablet (640px - 1024px): 2 balanced columns with ample gutter spacing.',
        'Desktop (1024px - 1280px): 3 columns in 1200px container.',
        'Wide Desktop (> 1280px): 4 columns showcasing the entire roster simultaneously with zero scroll jank.',
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#03050a]/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full sm:max-w-xl h-full sm:h-[94vh] sm:rounded-3xl border-l sm:border border-white/15 bg-gradient-to-b from-[#0b0e1b]/98 via-[#070912]/98 to-[#04060b] backdrop-blur-3xl p-6 sm:p-8 overflow-y-auto flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                <Code2 className="w-4 h-4" />
                <span>DESIGN SYSTEM SPECIFICATION</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mt-0.5">
                Liquid Glass & 3D Tilt Breakdown
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Sections */}
          <div className="space-y-6 mt-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{section.title}</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(section.tailwindClasses, section.id)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy Tailwind Classes"
                  >
                    {copiedKey === section.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {section.description}
                </p>

                {/* Tailwind classes code snippet */}
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-cyan-300 break-all select-all">
                  {section.tailwindClasses}
                </div>

                {/* Explanation points */}
                <ul className="space-y-1 text-xs text-slate-300/90 pl-4 list-disc font-normal">
                  {section.explanation.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>INFINITI firm Component Architecture v3.2</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};
