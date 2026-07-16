import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, CheckCircle2, Calculator, Info, HelpCircle } from 'lucide-react';

interface InquiryFormProps {
  onAddInquiry?: (inquiry: {
    name: string;
    phone: string;
    company: string;
    productType: string;
    desc: string;
  }) => void;
}

export default function InquiryForm({ onAddInquiry }: InquiryFormProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'پیچ شش‌گوش',
    diameter: '12',
    length: '50',
    quantity: '1000',
    details: '',
  });

  const productTypes = ['پیچ شش‌گوش', 'پیچ آلن', 'استاد بولت', 'مهره صنعتی'];

  // Smart Fastener Weight Estimation Math
  const calculateWeight = () => {
    const d = parseFloat(formData.diameter) || 0;
    const l = parseFloat(formData.length) || 0;
    const qty = parseFloat(formData.quantity) || 0;
    
    if (d <= 0 || qty <= 0) return 0;
    
    // Approximation formula for cylinder weight: Volume * Steel Density (7.85 g/cm3)
    const radiusCm = d / 20; // convert mm to cm
    const lengthCm = (l > 0 ? l : d * 2.5) / 10; // estimate length if empty
    const volume = Math.PI * Math.pow(radiusCm, 2) * lengthCm;
    const weightPerUnit = volume * 7.85; // grams
    const totalKg = (weightPerUnit * qty) / 1000;
    
    return isNaN(totalKg) ? 0 : Math.round(totalKg * 10) / 10;
  };

  const estimatedWeight = calculateWeight();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('لطفاً نام و تلفن تماس خود را برای ثبت هماهنگی نهایی وارد نمایید.');
      return;
    }
    setErrorMsg('');
    
    if (onAddInquiry) {
      onAddInquiry({
        name: formData.name,
        phone: formData.phone,
        company: 'نامشخص / شخصی',
        productType: `${formData.type} (قطر: ${formData.diameter}mm، طول: ${formData.length}mm، تعداد: ${formData.quantity} عدد)`,
        desc: formData.details || `سفارش استعلام قیمت به وزن تقریبی ${estimatedWeight} کیلوگرم.`
      });
    }

    setSubmitted(true);
  };

  return (
    <section id="inquiry" className="py-24 px-6 bg-gradient-to-b from-gray-900 to-gray-950 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--primary-glow),transparent_50%)] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">سامانه استعلام قیمت پیشرفته</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            درخواست پیش‌فاکتور دقیق به همراه ابزار محاسباتی وزن مرسوله صنعتی برای تسریع در سفارش‌گذاری شما.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form (Glassmorphic Container) */}
          <div className="lg:col-span-7 bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6 text-right"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400">نام و نام خانوادگی / شرکت خریدار</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="جناب آقای مهندس احمدی" 
                        className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors text-sm" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400">تلفن تماس / موبایل</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹" 
                        className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors text-sm text-left" 
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Fastener Category Selector chips */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-xs font-bold text-gray-400">دسته‌بندی قطعه صنعتی</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {productTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                            formData.type === type
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight calculation parameters */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400">قطر (میلی‌متر)</label>
                      <select 
                        value={formData.diameter}
                        onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
                        className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:border-primary/50 focus:outline-none text-xs font-mono"
                      >
                        {['6', '8', '10', '12', '16', '20', '24', '30'].map(d => (
                          <option key={d} value={d}>M{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400">طول (میلی‌متر)</label>
                      <input 
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        placeholder="مثال: ۵۰"
                        className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:border-primary/50 focus:outline-none text-xs font-mono text-center" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-400">تعداد درخواستی</label>
                      <input 
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="مثال: ۱۰۰۰"
                        className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:border-primary/50 focus:outline-none text-xs font-mono text-center" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400">توضیحات و نیازمندی‌های خاص (گرید، پوشش و پوشش‌دهی)</label>
                    <textarea 
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="توضیحات تکمیلی مثل گرید درخواستی یا آبکاری داکرومات را در این بخش یادداشت کنید..." 
                      className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors h-32 text-sm leading-relaxed"
                    ></textarea>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl text-center">
                      {errorMsg}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-primary text-black rounded-xl font-bold hover:bg-primary-hover hover:scale-[1.01] transition-all shadow-xl shadow-primary-glow/20 flex items-center justify-center gap-2"
                  >
                    <Mail size={16} />
                    ارسال استعلام قیمت رسمی
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center gap-4"
                >
                  <CheckCircle2 size={64} className="text-emerald-500 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white">استعلام شما با موفقیت ثبت شد</h3>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    درخواست شما برای پیش‌فاکتور پیچ و مهره {formData.type}M{formData.diameter} بررسی و واحد فنی رستاق پیچ به‌زودی با شما تماس خواهند گرفت.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-xl border border-gray-700 transition-colors"
                  >
                    ثبت استعلام جدید
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar calculations info panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary-hover/10 border border-primary/20 rounded-3xl p-6 md:p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-primary">
                <Calculator size={20} />
                <h3 className="text-lg font-bold">محاسبه‌گر وزن اتصالات صنعتی</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                وزن نهایی مرسوله صنعتی یکی از فاکتورهای کلیدی در باربری و محاسبات بار است. وزن تقریبی درخواست شما در زیر با چگالی استاندارد فولاد آلیاژی محاسبه شده است.
              </p>

              <div className="bg-gray-950/80 border border-gray-800 rounded-2xl p-6 text-center mt-2 relative overflow-hidden">
                <span className="block text-[11px] text-gray-500 font-bold mb-1">تخمین وزن مرسوله فولادی</span>
                <span className="text-5xl font-black text-white font-mono">{estimatedWeight} <span className="text-xs text-primary">کیلوگرم</span></span>
                <span className="block text-[10px] text-emerald-500 font-mono mt-2 flex items-center justify-center gap-1">
                  <Info size={10} /> حجم فولادی تقریب کلی است
                </span>
              </div>
            </div>

            <div className="bg-gray-900/20 border border-gray-800 rounded-3xl p-6 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-500" />
                چرا رستاق پیچ نوین؟
              </h4>
              <ul className="flex flex-col gap-3 text-xs text-gray-400 leading-relaxed list-disc pr-4">
                <li>دارای تاییدیه رسمی تست کشش و سختی‌سنجی از آزمایشگاه‌های معتبر متالورژی ایران.</li>
                <li>تولید انحصاری پیچ‌های گرید ۱۲.۹ فولادی و استاد بولت‌های مقاوم در دمای زیر صفر و بالای ۵۰۰ درجه.</li>
                <li>بسته‌بندی پالتایز ضد آب صادراتی برای انتقال ایمن به محل پروژه خریداران.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
