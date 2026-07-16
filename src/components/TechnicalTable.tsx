import { useState } from 'react';
import { Search, Filter, ShieldCheck, Database, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteData } from '../lib/siteData';

interface TechnicalTableProps {
  standardsData?: SiteData['standards'];
}

export default function TechnicalTable({ standardsData }: TechnicalTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const defaultStandards = [
    { id: 'std-1', std: 'DIN 931', type: 'پیچ شش‌گوش نیم‌دنده', category: 'DIN', size: 'M12 - M64', material: 'فولاد آلیاژی گرید ۱۰.۹', app: 'ماشین‌سازی سنگین' },
    { id: 'std-2', std: 'DIN 933', type: 'پیچ شش‌گوش تمام‌دنده', category: 'DIN', size: 'M6 - M100', material: 'فولاد کربنی گرید ۸.۸', app: 'صنایع عمومی و ساختمانی' },
    { id: 'std-3', std: 'DIN 912', type: 'پیچ آلن سر استوانه‌ای', category: 'DIN', size: 'M3 - M48', material: 'گرید ۱۲.۹ فولادی فوق سخت', app: 'قالب‌سازی و خودرو' },
    { id: 'std-4', std: 'ISO 4014', type: 'پیچ شش‌گوش گل درشت نیم‌دنده', category: 'ISO', size: 'M8 - M36', material: 'استنلس استیل ۳۱۶', app: 'محیط‌های خورنده اسیدی' },
    { id: 'std-5', std: 'ISO 4017', type: 'پیچ شش‌گوش تمام‌دنده کلاسیک', category: 'ISO', size: 'M5 - M52', material: 'آهن گرید ۵.۶', app: 'سازه‌های فلزی سبک' },
    { id: 'std-6', std: 'ASTM A193 B7', type: 'استاد بولت دما و فشار بالا', category: 'ASTM', size: '1/2" - 4"', material: 'آلیاژ کروم مولیبدن', app: 'فلنج‌های نفت، گاز و پتروشیمی' },
    { id: 'std-7', std: 'ASTM A194 2H', type: 'مهره سنگین فشار بالا', category: 'ASTM', size: '1/2" - 4"', material: 'کربن استیل عملیات حرارتی', app: 'خطوط انتقال سیالات سنگین' },
  ];

  const activeStandards = standardsData && standardsData.length > 0 ? standardsData : defaultStandards;

  const categories = ['ALL', 'DIN', 'ISO', 'ASTM'];

  const filteredData = activeStandards.filter((item) => {
    const matchesSearch = 
      item.std.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.app.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="standards" className="py-24 px-6 bg-gray-950 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs text-blue-400 font-bold mb-4">
              <Database size={12} />
              بانک اطلاعات فنی استانداردها
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-3">داشبورد استانداردهای فنی</h2>
            <p className="text-gray-400 max-w-xl">
              جدول استانداردها و مشخصات ابعادی و آلیاژی پیچ و مهره‌ها منطبق با استانداردهای DIN آلمان، ISO جهانی و ASTM آمریکا.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-primary border-primary text-black shadow-lg shadow-primary-glow'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {cat === 'ALL' ? 'همه استانداردها' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در استاندارد، نام فارسی یا صنعت..."
            className="w-full pr-12 pl-4 py-3.5 bg-gray-900/60 border border-gray-800 rounded-2xl text-white placeholder-gray-500 text-sm focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Responsive Dashboard Table Container */}
        <div className="overflow-x-auto bg-gray-900/30 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
          <table className="w-full text-right border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-gray-900/50 text-gray-400 text-xs tracking-wider font-semibold">
                <th className="py-5 px-6">استاندارد</th>
                <th className="py-5 px-6">نوع محصول</th>
                <th className="py-5 px-6">دامنه سایز</th>
                <th className="py-5 px-6">متریال / گرید</th>
                <th className="py-5 px-6">صنعت هدف</th>
                <th className="py-5 px-6 text-center">تاییدیه مهندسی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <motion.tr
                    key={row.std}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15, delay: i * 0.04 }}
                    className="hover:bg-white/2 transition-colors duration-200"
                  >
                    <td className="py-5 px-6">
                      <span className="font-mono text-base font-black text-primary tracking-tight bg-primary/10 px-3 py-1 rounded-lg">
                        {row.std}
                      </span>
                    </td>
                    <td className="py-5 px-6 font-medium text-white">{row.type}</td>
                    <td className="py-5 px-6 text-gray-400 font-mono text-xs">{row.size}</td>
                    <td className="py-5 px-6 text-gray-300 font-medium">{row.material}</td>
                    <td className="py-5 px-6">
                      <span className="text-gray-400 text-xs bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
                        {row.app}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                        <ShieldCheck size={12} />
                        <span>انطباق کامل</span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <HelpCircle size={32} className="text-gray-600" />
                      <p className="text-base font-semibold">موردی یافت نشد</p>
                      <p className="text-xs">عبارت دیگری را جستجو کنید یا فیلترها را تغییر دهید.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
