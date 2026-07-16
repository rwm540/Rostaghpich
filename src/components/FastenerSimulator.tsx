import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Play, CheckCircle2, RotateCcw, Info, Sliders, Shield } from 'lucide-react';

interface BoltSpec {
  size: string;
  diameterMm: number;
  pitchMm: number;
  stressAreaMm2: number;
}

const BOLT_SIZES: BoltSpec[] = [
  { size: 'M8', diameterMm: 8, pitchMm: 1.25, stressAreaMm2: 36.6 },
  { size: 'M12', diameterMm: 12, pitchMm: 1.75, stressAreaMm2: 84.3 },
  { size: 'M16', diameterMm: 16, pitchMm: 2.0, stressAreaMm2: 157 },
  { size: 'M20', diameterMm: 20, pitchMm: 2.5, stressAreaMm2: 245 },
  { size: 'M24', diameterMm: 24, pitchMm: 3.0, stressAreaMm2: 353 },
  { size: 'M30', diameterMm: 30, pitchMm: 3.5, stressAreaMm2: 561 },
  { size: 'M36', diameterMm: 36, pitchMm: 4.0, stressAreaMm2: 817 },
  { size: 'M48', diameterMm: 48, pitchMm: 5.0, stressAreaMm2: 1470 },
  { size: 'M64', diameterMm: 64, pitchMm: 6.0, stressAreaMm2: 2680 },
];

const GRADES = [
  { id: '8.8', name: 'گرید ۸.۸ (فولاد متوسط)', yieldStrengthMpa: 640, tensileStrengthMpa: 800, factorK: 0.20 },
  { id: '10.9', name: 'گرید ۱۰.۹ (فولاد سخت)', yieldStrengthMpa: 940, tensileStrengthMpa: 1040, factorK: 0.18 },
  { id: '12.9', name: 'گرید ۱۲.۹ (فولاد فوق سخت)', yieldStrengthMpa: 1100, tensileStrengthMpa: 1220, factorK: 0.17 },
  { id: 'B7', name: 'گرید ASTM A193 B7 (کروم مولی)', yieldStrengthMpa: 720, tensileStrengthMpa: 860, factorK: 0.19 },
];

const COATINGS = [
  { id: 'none', name: 'بدون پوشش (فسفاته و روغن)', colorClass: 'bg-gray-800 border-gray-700', factorMultiplier: 1.0, desc: 'روغن صنعتی تیره ضد زنگ موقت' },
  { id: 'hdg', name: 'گالوانیزه گرم (HDG)', colorClass: 'bg-zinc-400 border-zinc-500', factorMultiplier: 1.15, desc: 'پوشش غوطه‌وری روی با ضخامت بالا و مقاوم به رطوبت شدید' },
  { id: 'dacromet', name: 'داکرومات زینک فلیک', colorClass: 'bg-slate-300 border-slate-400', factorMultiplier: 0.95, desc: 'مقاومت عالی در برابر خوردگی نمکی بدون شکنندگی هیدروژنی' },
  { id: 'cadmium', name: 'آبکاری زینک کرومات زرد', colorClass: 'bg-yellow-600/90 border-yellow-700', factorMultiplier: 0.9, desc: 'پوشش ضد سایش با گشتاور بستن روان و طلایی‌رنگ' }
];

export default function FastenerSimulator() {
  const [selectedSize, setSelectedSize] = useState<BoltSpec>(BOLT_SIZES[2]); // Default M16
  const [selectedGrade, setSelectedGrade] = useState(GRADES[1]); // Default 10.9
  const [selectedCoating, setSelectedCoating] = useState(COATINGS[0]); // Default black
  const [boltLength, setBoltLength] = useState(100); // 100mm
  
  // Animation play states
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0); // 0 to 100

  // Standard engineering calculations
  const [torque, setTorque] = useState(0);
  const [clampingForce, setClampingForce] = useState(0);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    // 1. Clamping force (Preload) = Proof load limit = 75% of Yield Strength * Tensile Stress Area
    // Force in Newtons = 0.75 * yieldStrengthMpa * stressAreaMm2
    const forceN = 0.75 * selectedGrade.yieldStrengthMpa * selectedSize.stressAreaMm2;
    const forceKn = forceN / 1000;
    setClampingForce(parseFloat(forceKn.toFixed(1)));

    // 2. Torque (Nm) T = K * d * F
    // K = friction factor (factorK) adjusted by coating multiplier
    // d = nominal diameter in meters (diameterMm / 1000)
    // F = clamping force in Newtons
    const K = selectedGrade.factorK * selectedCoating.factorMultiplier;
    const d = selectedSize.diameterMm / 1000;
    const torqueNm = K * d * forceN;
    setTorque(parseFloat(torqueNm.toFixed(0)));

    // 3. Approximate Weight in Kg
    // Weight = (Density of steel 7.85 g/cm3) * (Volume of bolt head + shank + nut)
    // Shank volume = pi * r^2 * length
    // Head volume = roughly 1.5 * hex size head volume
    const radiusCm = selectedSize.diameterMm / 2 / 10;
    const lengthCm = boltLength / 10;
    const shankVolume = Math.PI * Math.pow(radiusCm, 2) * lengthCm;
    
    // Head and Nut volume approximate approximation
    const headVolume = Math.PI * Math.pow(radiusCm * 1.6, 2) * (selectedSize.diameterMm * 0.8 / 10);
    const totalVolumeCm3 = shankVolume + headVolume;
    const weightGrams = totalVolumeCm3 * 7.85;
    const weightKg = weightGrams / 1000;
    setWeight(parseFloat(weightKg.toFixed(3)));

  }, [selectedSize, selectedGrade, selectedCoating, boltLength]);

  // Run the animated assembly demo
  const handleSimulate = () => {
    if (isAssembling) return;
    setIsAssembling(true);
    setAssemblyProgress(0);

    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds assembly

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAssemblyProgress(progress * 100);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setTimeout(() => {
          setIsAssembling(false);
        }, 1200);
      }
    };

    requestAnimationFrame(update);
  };

  return (
    <section id="simulator" className="py-20 px-6 bg-gray-950 border-t border-gray-900/50 relative overflow-hidden">
      {/* Glow ambient circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-glow/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title with Badge */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-4">
            ماژول تعاملی مهندسی
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            شبیه‌ساز سه‌بعدی و محاسب فنی اتصالات
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            کلاس آلیاژی، گرید مقاومتی، طول رزوه و پوشش قطعه را به صورت زنده پیکربندی کنید تا نیروهای کششی، گشتاور مجاز بستن پیچ و وزن تقریبی را بلافاصله دریافت نمایید.
          </p>
        </div>

        {/* Dynamic Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Configurator Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-gray-900/30 backdrop-blur-md border border-gray-900 rounded-3xl p-6 md:p-8 flex flex-col gap-6 text-right">
            <div className="flex items-center gap-2 border-b border-gray-900 pb-4">
              <Sliders className="text-primary shrink-0" size={18} />
              <h3 className="text-lg font-bold text-white">پیکربندی هوشمند قطعه</h3>
            </div>

            {/* Step 1: Nominal Diameter Size */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-gray-400 flex justify-between">
                <span>سایز قطر نامی (پیچ استاندارد)</span>
                <span className="text-primary font-mono text-[10px] bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">{selectedSize.size}</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BOLT_SIZES.map((spec) => (
                  <button
                    key={spec.size}
                    onClick={() => setSelectedSize(spec)}
                    className={`py-2 text-center rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                      selectedSize.size === spec.size
                        ? 'bg-primary text-black border-primary font-black shadow-lg shadow-primary/20'
                        : 'bg-gray-950 border-gray-900 text-gray-400 hover:border-gray-800'
                    }`}
                  >
                    {spec.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Yield & Tensile Grade */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-gray-400 flex justify-between">
                <span>رده مقاومتی و کلاس آلیاژی (Grade / Class)</span>
                <span className="text-primary font-mono text-[10px] bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">{selectedGrade.id}</span>
              </label>
              <select
                value={selectedGrade.id}
                onChange={(e) => {
                  const found = GRADES.find(g => g.id === e.target.value);
                  if (found) setSelectedGrade(found);
                }}
                className="w-full bg-gray-950 border border-gray-900 rounded-xl px-4 py-3 text-xs font-bold text-gray-300 outline-none focus:border-primary/50 transition-colors"
              >
                {GRADES.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Step 3: Coating Surface treatment */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-gray-400 flex justify-between">
                <span>پوشش آبکاری سطحی (Finish)</span>
                <span className="text-[10px] text-gray-500">ضریب سایش دینامیک</span>
              </label>
              <div className="flex flex-col gap-2">
                {COATINGS.map((coating) => {
                  const isSel = selectedCoating.id === coating.id;
                  return (
                    <button
                      key={coating.id}
                      onClick={() => setSelectedCoating(coating)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                        isSel
                          ? 'bg-primary/5 border-primary/40 text-white'
                          : 'bg-gray-950 border-gray-900 text-gray-400 hover:bg-gray-900/50 hover:text-gray-300'
                      }`}
                    >
                      {/* Coating Color Pill */}
                      <div className={`w-4 h-4 rounded-full ${coating.colorClass} border shrink-0`} />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold">{coating.name}</span>
                        <span className="text-[10px] text-gray-500">{coating.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Slider for Bolt Length */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                <span>طول آزاد پیچ (Shank Length)</span>
                <span className="text-primary font-mono">{boltLength} میلی‌متر</span>
              </div>
              <input
                type="range"
                min="40"
                max="300"
                step="10"
                value={boltLength}
                onChange={(e) => setBoltLength(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-950 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>40mm</span>
                <span>150mm</span>
                <span>300mm</span>
              </div>
            </div>

          </div>

          {/* Column 2: Interactive Animated Visualizer & Live Calculations (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
            
            {/* Visual Assembly Canvas Card */}
            <div className="flex-1 bg-gray-900/20 backdrop-blur-md border border-gray-900 rounded-3xl p-6 flex flex-col justify-between items-center relative overflow-hidden min-h-[350px]">
              
              {/* Background blueprints lines */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40"></div>
              
              {/* Top info indicators */}
              <div className="w-full flex justify-between items-center z-10 border-b border-gray-900 pb-3">
                <span className="text-[10px] font-mono text-gray-500 tracking-wider flex items-center gap-1.5">
                  <Shield size={12} className="text-primary animate-pulse" />
                  استاندارد مرجع آزمایش متالورژی: ASTM / ISO
                </span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-400 font-bold rounded-lg">
                  پیکربندی موفق قطعه
                </span>
              </div>

              {/* Dynamic Schematic Graphic Container */}
              <div className="w-full h-44 flex items-center justify-center relative">
                
                {/* Visualizing the active Bolt */}
                <div className="flex items-center" dir="ltr">
                  
                  {/* Hex Head */}
                  <motion.div 
                    animate={{ scale: isAssembling ? [1, 1.03, 1] : 1 }}
                    className={`h-16 w-10 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 rounded-lg relative flex items-center justify-center border-y border-l border-white/10 shrink-0 shadow-lg ${
                      selectedCoating.id === 'hdg' ? 'brightness-125 saturate-50' : 
                      selectedCoating.id === 'cadmium' ? 'brightness-90 sepia hue-rotate-15 saturate-150' : ''
                    }`}
                  >
                    <span className="text-[10px] font-black text-gray-400 font-mono tracking-tighter select-none rotate-90">{selectedSize.size}</span>
                    {/* Grade stamp */}
                    <div className="absolute top-1 right-1 text-[8px] font-mono text-gray-400">{selectedGrade.id}</div>
                  </motion.div>

                  {/* Smooth Shaft part (Plain Shank) */}
                  <div 
                    style={{ width: `${boltLength * 0.4}px` }} 
                    className={`h-9 bg-gradient-to-b from-gray-600 via-gray-500 to-gray-700 border-y border-white/5 shadow-inner transition-all duration-300 ${
                      selectedCoating.id === 'hdg' ? 'brightness-125 saturate-50' : 
                      selectedCoating.id === 'cadmium' ? 'brightness-90 sepia hue-rotate-15 saturate-150' : ''
                    }`}
                  />

                  {/* Threaded Shaft (Rerouted dynamic width) */}
                  <div 
                    style={{ width: `${boltLength * 0.7}px` }} 
                    className={`h-9 bg-[linear-gradient(90deg,transparent_4px,#4b5563_5px,#4b5563_6px,transparent_7px)] bg-[size:10px_100%] border-y border-r border-white/10 relative transition-all duration-300 ${
                      selectedCoating.id === 'hdg' ? 'brightness-125 saturate-50' : 
                      selectedCoating.id === 'cadmium' ? 'brightness-90 sepia hue-rotate-15 saturate-150' : ''
                    }`}
                  >
                    {/* Nut sliding and threading animation */}
                    <motion.div 
                      style={{ 
                        left: `${assemblyProgress}%`,
                      }}
                      className="absolute top-1/2 -translate-y-1/2 w-8 h-12 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-700 border border-white/15 rounded-md flex items-center justify-center shadow-2xl"
                    >
                      <span className="text-[8px] text-gray-400 font-bold tracking-widest select-none uppercase -rotate-90">NUT</span>
                    </motion.div>
                  </div>

                </div>

              </div>

              {/* Assembly trigger controller bar */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-gray-950/80 border border-gray-900 rounded-2xl p-3.5 z-10">
                <div className="text-right">
                  <span className="block text-xs font-bold text-gray-200">پیش‌نمایش سناریوی بستن بست</span>
                  <span className="text-[10px] text-gray-500 leading-normal">درصد کامل بستن گشتاور هیدرولیک</span>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Progress Percent Bar */}
                  <div className="flex-1 sm:w-32 bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                    <div 
                      className="h-full bg-primary transition-all duration-75 shadow-[0_0_8px_var(--primary)]" 
                      style={{ width: `${assemblyProgress}%` }}
                    />
                  </div>

                  <button
                    onClick={handleSimulate}
                    disabled={isAssembling}
                    className="px-5 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-black font-bold text-xs rounded-xl flex items-center gap-1.5 border border-primary/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Play size={12} className={isAssembling ? 'animate-spin' : ''} />
                    <span>{isAssembling ? 'در حال رزوه...' : 'شبیه‌سازی بستن'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Real-time Dynamic Engineering Output Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
              
              {/* Metric 1: Tightening Torque */}
              <div className="p-4 bg-gray-900/40 border border-gray-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 font-bold mb-1 block">گشتاور پیشنهادی بستن</span>
                <div>
                  <span className="text-2xl font-black text-white font-mono">{torque}</span>
                  <span className="text-[10px] text-gray-400 mr-1.5 font-bold">Nm</span>
                </div>
                <div className="text-[9px] text-primary mt-2 border-t border-gray-950 pt-2 font-medium">
                  گشتاور سفت‌کاری مطمئن
                </div>
              </div>

              {/* Metric 2: Clamping Preload Force */}
              <div className="p-4 bg-gray-900/40 border border-gray-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 font-bold mb-1 block">نیروی پیش‌بار ایمن</span>
                <div>
                  <span className="text-2xl font-black text-white font-mono">{clampingForce}</span>
                  <span className="text-[10px] text-gray-400 mr-1.5 font-bold">kN</span>
                </div>
                <div className="text-[9px] text-gray-500 mt-2 border-t border-gray-950 pt-2 font-medium">
                  ۷۵ درصد استحکام تسلیم
                </div>
              </div>

              {/* Metric 3: Yield Strength of alloy */}
              <div className="p-4 bg-gray-900/40 border border-gray-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 font-bold mb-1 block">استحکام تسلیم کششی</span>
                <div>
                  <span className="text-2xl font-black text-white font-mono">{selectedGrade.yieldStrengthMpa}</span>
                  <span className="text-[10px] text-gray-400 mr-1.5 font-bold">MPa</span>
                </div>
                <div className="text-[9px] text-emerald-500 mt-2 border-t border-gray-950 pt-2 font-medium">
                  محدوده الاستیک فولاد
                </div>
              </div>

              {/* Metric 4: Approximate weight */}
              <div className="p-4 bg-gray-900/40 border border-gray-900 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] text-gray-500 font-bold mb-1 block">وزن تقریبی واحد</span>
                <div>
                  <span className="text-2xl font-black text-white font-mono">{weight}</span>
                  <span className="text-[10px] text-gray-400 mr-1.5 font-bold">کیلوگرم</span>
                </div>
                <div className="text-[9px] text-yellow-500 mt-2 border-t border-gray-950 pt-2 font-medium">
                  محاسبه برمبنای چگالی فولاد
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
