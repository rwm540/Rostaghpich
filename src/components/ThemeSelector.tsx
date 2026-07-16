import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, Sparkles } from 'lucide-react';

export interface ThemeConfig {
  id: string;
  name: string;
  desc: string;
  primary: string;
  hover: string;
  glow: string;
  bgGradient: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'orange',
    name: 'نارنجی فولاد کوره',
    desc: 'احساس گرما، انرژی و صنایع فولاد سنگین',
    primary: '#f97316',
    hover: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.25)',
    bgGradient: 'from-orange-600 to-orange-400'
  },
  {
    id: 'blue',
    name: 'آبی سازه مهندسی',
    desc: 'نماد دقت، صنایع هوایی و توربین‌های دقیق',
    primary: '#0284c7',
    hover: '#0369a1',
    glow: 'rgba(2, 132, 199, 0.25)',
    bgGradient: 'from-sky-600 to-sky-400'
  },
  {
    id: 'teal',
    name: 'سبز پتروشیمی ایمن',
    desc: 'مناسب صنایع خط لوله، فلنج و نفت و گاز',
    primary: '#0d9488',
    hover: '#0f766e',
    glow: 'rgba(13, 148, 136, 0.25)',
    bgGradient: 'from-teal-600 to-teal-400'
  },
  {
    id: 'bronze',
    name: 'برنز متالورژی',
    desc: 'پوشش‌های برنجی، ضدخوردگی و آبکاری روی',
    primary: '#d97706',
    hover: '#b45309',
    glow: 'rgba(217, 119, 6, 0.25)',
    bgGradient: 'from-amber-600 to-amber-500'
  }
];

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState('orange');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('rostaghpich_active_theme') || 'orange';
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    setActiveTheme(themeId);
    localStorage.setItem('rostaghpich_active_theme', themeId);

    // Apply CSS Variables to root element
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-hover', theme.hover);
    root.style.setProperty('--primary-glow', theme.glow);
  };

  return (
    <div className="fixed left-6 bottom-24 md:bottom-6 z-50">
      {/* Floating Action Dial */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 text-primary flex items-center justify-center shadow-lg shadow-black/80 hover:scale-110 active:scale-95 transition-all cursor-pointer relative group"
          whileHover={{ rotate: 15 }}
        >
          <Palette size={20} />
          {/* Badge indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-[8px] font-black text-black">
            4
          </span>
        </motion.button>

        {/* Droplist Container */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backing scrim to auto-close */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15, x: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15, x: 10 }}
                className="absolute left-0 bottom-14 w-72 bg-gray-950/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 shadow-2xl z-50 text-right flex flex-col gap-3"
              >
                <div className="flex items-center justify-between border-b border-gray-900 pb-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" />
                    رنگ‌آمیزی‌های پیشنهادی
                  </span>
                  <span className="text-[10px] text-gray-500">انتخاب زنده قالب</span>
                </div>

                <div className="flex flex-col gap-2">
                  {THEMES.map((theme) => {
                    const isActive = activeTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          applyTheme(theme.id);
                        }}
                        className={`flex items-start gap-3 p-2.5 rounded-xl text-right border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-primary/10 border-primary/40'
                            : 'bg-gray-900/30 border-transparent hover:bg-gray-900/60'
                        }`}
                      >
                        {/* Swatch color bubble */}
                        <div className={`w-8 h-8 rounded-lg shrink-0 bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center shadow-md`}>
                          {isActive && <Check size={14} className="text-black stroke-[3]" />}
                        </div>

                        {/* Title and details */}
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <span className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-gray-200'}`}>
                            {theme.name}
                          </span>
                          <span className="text-[10px] text-gray-500 truncate">
                            {theme.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
