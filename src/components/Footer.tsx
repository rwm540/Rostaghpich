import { MapPin, Phone, Mail, ArrowUp, ShieldCheck, HelpCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-900/80 py-16 px-6 relative overflow-hidden">
      {/* Visual Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-400 relative z-10 text-right">
        {/* Brand Information */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-mono text-lg font-black text-black shadow-lg shadow-primary-glow/20">
              R
            </div>
            <span className="text-xl font-black text-white">رستاق <span className="text-primary">پیچ نوین</span></span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            مجموعه دانش‌بنیان رستاق پیچ نوین با سال‌ها تجربه درخشان، تولیدکننده و تأمین‌کننده طراز اول انواع اتصالات فوق‌امنیتی و مقاوم در برابر لرزش و خوردگی برای ابرپروژه‌های عمرانی کشور است.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl w-fit font-bold">
            <ShieldCheck size={14} />
            <span>سیستم تضمین کیفیت دارای استاندارد ملی</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-base border-r-2 border-primary pr-3">دسترسی سریع</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href="#home" className="hover:text-primary transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                صفحه اصلی و معرفی
              </a>
            </li>
            <li>
              <a href="#products" className="hover:text-primary transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                کاتالوگ و محصولات
              </a>
            </li>
            <li>
              <a href="#standards" className="hover:text-primary transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                جدول فنی استانداردها
              </a>
            </li>
            <li>
              <a href="#inquiry" className="hover:text-primary transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                استعلام قیمت هوشمند
              </a>
            </li>
          </ul>
        </div>

        {/* Resources / Certifications */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-base border-r-2 border-primary pr-3">مستندات و استانداردها</h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <FileText size={14} className="text-gray-500" />
              <span className="text-xs text-gray-400">گواهی کیفیت متالورژی محصول (MTC)</span>
            </li>
            <li className="flex items-center gap-2">
              <FileText size={14} className="text-gray-500" />
              <span className="text-xs text-gray-400">انطباق کامل با گواهی بازرسی ثالت (SGS)</span>
            </li>
            <li className="flex items-center gap-2">
              <HelpCircle size={14} className="text-gray-500" />
              <span className="text-xs text-gray-400">راهنمای گشتاور بستن پیچ‌های سنگین</span>
            </li>
          </ul>
        </div>

        {/* Contacts & Map representation */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-base border-r-2 border-primary pr-3">اطلاعات تماس و آدرس دفتر</h4>
          <div className="flex flex-col gap-3.5 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed text-gray-400">
                تهران، بازار آهن شادآباد، بهاران ۲، بلوک ۲۷، پلاک ۴۲، مجموعه صنعتی رستاق پیچ
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-primary shrink-0" />
              <a href="tel:+982166666666" className="text-xs font-mono hover:text-white transition-colors" dir="ltr">
                +۹۸ (۲۱) ۶۶۶۶-۶۶۶۶
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-primary shrink-0" />
              <a href="mailto:info@rostaghpich.com" className="text-xs font-mono hover:text-white transition-colors" dir="ltr">
                info@rostaghpich.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar with copy & scroll button */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
        <span>تمامی حقوق مادی و معنوی متعلق به شرکت رستاق پیچ نوین می‌باشد. © ۲۰۲۶</span>
        
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl hover:text-white hover:border-primary/20 transition-all text-gray-400"
        >
          <span>برگشت به بالا</span>
          <ArrowUp size={12} />
        </button>
      </div>
    </footer>
  );
}
