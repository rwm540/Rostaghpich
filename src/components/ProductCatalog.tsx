import { motion } from 'motion/react';
import { Shield, Sparkles, ChevronLeft, Target, Award, Anchor, Settings, Disc } from 'lucide-react';
import { SiteData } from '../lib/siteData';

interface ProductCatalogProps {
  productsData?: SiteData['products'];
}

export default function ProductCatalog({ productsData }: ProductCatalogProps) {
  const defaultProducts = [
    {
      id: "prod-1",
      title: 'پیچ‌های شش‌گوش (Hex Bolts)',
      subtitle: 'استاندارد DIN 931 / DIN 933 / ISO 4014',
      desc: 'پرکاربردترین پیچ‌های مهندسی با دوام عالی در سازه‌های سنگین فلزی، صنایع نفتی و نیروگاهی.',
      specs: ['سایز دایره‌ای: M6 تا M100', 'کلاس مقاومتی: 8.8 / 10.9 / 12.9', 'پوشش: گالوانیزه گرم، داکرومات، زینک زرد'],
      accentColor: 'from-orange-500/10 to-orange-600/5',
      badge: 'مقاومت کششی بالا',
    },
    {
      id: "prod-2",
      title: 'پیچ‌های آلن صنعتی (Allen Bolts)',
      subtitle: 'استاندارد DIN 912 / ISO 4762',
      desc: 'طراحی پیشرفته گل پیچ با قابلیت اعمال گشتاور بالا، ایده‌آل برای ماشین‌آلات سنگین و فضاهای بسیار محدود.',
      specs: ['سایز دایره‌ای: M3 تا M48', 'کلاس مقاومتی: 12.9 فوق مقاوم فولادی', 'کاربرد: قطعات تحت ارتعاش بالا'],
      accentColor: 'from-blue-500/10 to-blue-600/5',
      badge: 'دقت عالی ساخت',
    },
    {
      id: "prod-3",
      title: 'استاد بولت دو سر دنده (Stud Bolts)',
      subtitle: 'استاندارد ASTM A193 B7 / B7M / L7 / L7M',
      desc: 'پیچ‌های تمام‌دنده مخصوص فلنج‌های خطوط لوله پرفشار پتروشیمی و اتصالات نفت و گاز.',
      specs: ['سایز اینچی: 1/2" تا 4"', 'آلیاژ ساخت: کروم مولیبدن، استنلس استیل ۳۱۶', 'تحمل دمایی: ضد حرارت بالا تا ۵۵۰ درجه'],
      accentColor: 'from-emerald-500/10 to-emerald-600/5',
      badge: 'تحمل فشار بحرانی',
    },
    {
      id: "prod-4",
      title: 'مهره‌ها و واشرهای صنعتی (Nuts & Washers)',
      subtitle: 'استاندارد DIN 934 / ASTM A194 2H',
      desc: 'سیستم‌های تکمیلی مهره سنگین و واشرهای تخت و فنری برای تضمین پایداری کامل تحت شدیدترین شوک‌های فیزیکی.',
      specs: ['سایز دایره‌ای: همگام با استانداردهای اتصالات', 'کلاس مقاومتی: G8 / G10 / 2H', 'پوشش تخصصی: فسفاته، روی‌انداود'],
      accentColor: 'from-purple-500/10 to-purple-600/5',
      badge: 'تضمین پایداری سیستم',
    },
  ];

  const activeProducts = productsData && productsData.length > 0 ? productsData : defaultProducts;

  const icons = [Settings, Anchor, Award, Disc];
  const accentColors = [
    'from-orange-500/10 to-orange-600/5',
    'from-blue-500/10 to-blue-600/5',
    'from-emerald-500/10 to-emerald-600/5',
    'from-purple-500/10 to-purple-600/5'
  ];

  return (
    <section id="products" className="py-24 px-6 bg-gradient-to-b from-gray-950 to-gray-900 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--primary-glow),transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Title and Metadata */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-xs text-primary font-bold mb-4"
          >
            <Sparkles size={14} />
            برند بین‌المللی با کیفیت تایید شده
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">کاتالوگ جامع محصولات صنعتی</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            تولید و تأمین طیف وسیعی از پیچ، مهره، واشر و اقلام جانبی صنعتی با گریدها و پوشش‌های تخصصی ضدخوردگی.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeProducts.map((p, i) => {
            const IconComponent = icons[i % icons.length];
            const activeAccent = accentColors[i % accentColors.length];
            return (
              <motion.div
                key={p.id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: 'spring', stiffness: 70, damping: 15, delay: i * 0.1 }}
                className="group relative rounded-3xl bg-gray-900/40 backdrop-blur-xl border border-gray-800/60 hover:border-primary/30 p-8 md:p-10 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Glow ambient background effect */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${activeAccent} rounded-full blur-[90px] group-hover:scale-125 transition-transform duration-700 pointer-events-none`}></div>
                
                <div>
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <span className="bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-xl text-xs font-bold text-primary">
                      {p.badge}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary/20 transition-all">
                      <IconComponent size={20} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-primary transition-colors duration-300 relative z-10">{p.title}</h3>
                  <span className="block text-xs text-gray-500 font-mono mb-4 tracking-wider uppercase relative z-10">{p.subtitle}</span>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">{p.desc}</p>
                  
                  {/* Technical details specs */}
                  <div className="flex flex-col gap-2.5 mb-8 relative z-10">
                    {p.specs.map((spec, index) => (
                      <div key={index} className="flex items-center gap-3 text-xs text-gray-300 bg-gray-950/60 rounded-xl px-4 py-2.5 border border-gray-900 font-sans">
                        <Shield size={12} className="text-primary" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer specs details link */}
                <div className="pt-5 border-t border-gray-800/60 flex items-center justify-between relative z-10">
                  <span className="text-xs text-gray-500">منطبق بر استانداردهای بین‌المللی</span>
                  <a 
                    href="#standards" 
                    className="flex items-center gap-1 text-xs text-primary font-bold hover:brightness-110 transition-colors"
                  >
                    جدول استانداردهای فنی <ChevronLeft size={16} className="group-hover:translate-x-[-3px] transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
