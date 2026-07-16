import { motion } from 'motion/react';
import { ShieldCheck, Zap, Factory, Award, ArrowDown, ChevronLeft } from 'lucide-react';
import { SiteData } from '../lib/siteData';

interface HeroProps {
  heroData?: SiteData['hero'];
  statsData?: SiteData['stats'];
}

export default function Hero({ heroData, statsData }: HeroProps) {
  const defaultHero = {
    badge: "بزرگترین مرکز تخصصی تولید پیچ و مهره‌های سنگین در کشور",
    title: "رستاق پیچ نوین",
    subtitle: "«ستون فقرات صنایع سنگین ایران»",
    desc: "تأمین‌کننده معتبر اتصالات فوق‌امنیتی پروژه‌های نفت، گاز، پتروشیمی، سدسازی و سازه‌های فلزی مرتفع با بهره‌گیری از تکنولوژی روز و تست‌های تضمین کیفیت متالورژی."
  };

  const activeHero = heroData || defaultHero;

  const statIcons = [Factory, Zap, ShieldCheck, Award];

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white pt-28 pb-16 px-6 text-center overflow-hidden">
      {/* Absolute Ambient Lighting Effects */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-12 right-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-primary to-primary-hover rounded-full blur-[140px] animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-12 left-1/4 w-[450px] h-[450px] bg-gradient-to-bl from-blue-900 to-transparent rounded-full blur-[140px]"></div>
      </div>

      {/* Cyber Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-25"></div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        {/* Upper Micro-Badge */}
        {activeHero.badge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-full text-xs text-gray-300 font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            {activeHero.badge}
          </motion.div>
        )}

        {/* Hero Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
            {activeHero.title.includes("پیچ") ? (
              <>
                {activeHero.title.split("پیچ")[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-hover to-primary">پیچ</span>
                {activeHero.title.split("پیچ")[1]}
              </>
            ) : (
              activeHero.title
            )}
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-gray-400 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
            {activeHero.subtitle}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-12">
            {activeHero.desc}
          </p>

          {/* Interactive Modern Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24 w-full max-w-md mx-auto">
            <a 
              href="#products" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-hover hover:brightness-110 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.03] shadow-xl shadow-primary-glow text-sm flex items-center justify-center gap-2 group"
            >
              مشاهده محصولات صنعتی
              <ChevronLeft size={16} className="group-hover:translate-x-[-4px] transition-transform" />
            </a>
            <a 
              href="#inquiry" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-900/80 hover:bg-gray-850 border border-gray-800 text-gray-300 hover:text-white rounded-2xl font-bold transition-all transform hover:scale-[1.03] text-sm flex items-center justify-center gap-2"
            >
              استعلام قیمت و پیش‌فاکتور
            </a>
          </div>
        </motion.div>

        {/* Real-time Statistics Cards */}
        {statsData && statsData.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-gray-800/60">
            {statsData.map((stat, i) => {
              const IconComp = statIcons[i % statIcons.length];
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl bg-gray-900/20 backdrop-blur-md border border-gray-800/40 hover:border-primary/20 hover:bg-gray-900/40 transition-all group flex items-center gap-4 text-right"
                >
                  <div className={`p-3.5 rounded-xl bg-gray-900 border border-gray-800 group-hover:scale-110 transition-transform ${stat.color ? 'text-primary' : 'text-primary'}`}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <span className="block text-2xl md:text-3xl font-black text-white font-mono leading-none mb-1">{stat.value}</span>
                    <span className="text-xs text-gray-500 font-semibold">{stat.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bounce Arrow to scroll down */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:block">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="p-2 rounded-full bg-gray-900 border border-gray-800 text-gray-400"
        >
          <ArrowDown size={16} />
        </motion.div>
      </div>
    </section>
  );
}
