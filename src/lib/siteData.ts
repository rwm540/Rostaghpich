export interface StatItem {
  id: string;
  value: string;
  label: string;
  color: string;
}

export interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  specs: string[];
  badge: string;
}

export interface StandardItem {
  id: string;
  std: string;
  type: string;
  category: string;
  size: string;
  material: string;
  app: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  company: string;
  productType: string;
  desc: string;
  date: string;
  status: 'PENDING' | 'CONTACTED' | 'COMPLETED';
}

export interface SiteData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    desc: string;
  };
  stats: StatItem[];
  products: ProductItem[];
  standards: StandardItem[];
  inquiries: InquiryItem[];
}

export const defaultSiteData: SiteData = {
  hero: {
    badge: "بزرگترین مرکز تخصصی تولید پیچ و مهره‌های سنگین در کشور",
    title: "رستاق پیچ نوین",
    subtitle: "«ستون فقرات صنایع سنگین ایران»",
    desc: "تأمین‌کننده معتبر اتصالات فوق‌امنیتی پروژه‌های نفت، گاز، پتروشیمی، سدسازی و سازه‌های فلزی مرتفع با بهره‌گیری از تکنولوژی روز و تست‌های تضمین کیفیت متالورژی."
  },
  stats: [
    { id: "stat-1", value: "۵,۰۰۰+", label: "تن ظرفیت تولید سالانه", color: "text-orange-500" },
    { id: "stat-2", value: "۰.۰۱", label: "میلی‌متر دقت ابعادی کنترل‌شده", color: "text-yellow-500" },
    { id: "stat-3", value: "۱۰۰٪", label: "آزمایش سختی‌سنجی و کشش", color: "text-emerald-500" },
    { id: "stat-4", value: "۱۵+", label: "سال سابقه تأمین صنایع مادر", color: "text-blue-500" },
  ],
  products: [
    {
      id: "prod-1",
      title: "پیچ‌های شش‌گوش (Hex Bolts)",
      subtitle: "استاندارد DIN 931 / DIN 933 / ISO 4014",
      desc: "پرکاربردترین پیچ‌های مهندسی با دوام عالی در سازه‌های سنگین فلزی، صنایع نفتی و نیروگاهی.",
      specs: ["سایز دایره‌ای: M6 تا M100", "کلاس مقاومتی: 8.8 / 10.9 / 12.9", "پوشش: گالوانیزه گرم، داکرومات، زینک زرد"],
      badge: "مقاومت کششی بالا"
    },
    {
      id: "prod-2",
      title: "پیچ‌های آلن صنعتی (Allen Bolts)",
      subtitle: "استاندارد DIN 912 / ISO 4762",
      desc: "طراحی پیشرفته گل پیچ با قابلیت اعمال گشتاور بالا، ایده‌آل برای ماشین‌آلات سنگین و فضاهای بسیار محدود.",
      specs: ["سایز دایره‌ای: M3 تا M48", "کلاس مقاومتی: 12.9 فوق مقاوم فولادی", "کاربرد: قطعات تحت ارتعاش بالا"],
      badge: "دقت عالی ساخت"
    },
    {
      id: "prod-3",
      title: "استاد بولت دو سر دنده (Stud Bolts)",
      subtitle: "استاندارد ASTM A193 B7 / B7M / L7 / L7M",
      desc: "پیچ‌های تمام‌دنده مخصوص فلنج‌های خطوط لوله پرفشار پتروشیمی و اتصالات نفت و گاز.",
      specs: ["سایز اینچی: 1/2\" تا 4\"", "آلیاژ ساخت: کروم مولیبدن، استنلس استیل ۳۱۶", "تحمل دمایی: ضد حرارت بالا تا ۵۵۰ درجه"],
      badge: "تحمل فشار بحرانی"
    },
    {
      id: "prod-4",
      title: "مهره‌ها و واشرهای صنعتی (Nuts & Washers)",
      subtitle: "استاندارد DIN 934 / ASTM A194 2H",
      desc: "سیستم‌های تکمیلی مهره سنگین و واشرهای تخت و فنری برای تضمین پایداری کامل تحت شدیدترین شوک‌های فیزیکی.",
      specs: ["سایز دایره‌ای: همگام با استانداردهای اتصالات", "کلاس مقاومتی: G8 / G10 / 2H", "پوشش تخصصی: فسفاته، روی‌انداود"],
      badge: "تضمین پایداری سیستم"
    }
  ],
  standards: [
    { id: "std-1", std: "DIN 931", type: "پیچ شش‌گوش نیم‌دنده", category: "DIN", size: "M12 - M64", material: "فولاد آلیاژی گرید ۱۰.۹", app: "ماشین‌سازی سنگین" },
    { id: "std-2", std: "DIN 933", type: "پیچ شش‌گوش تمام‌دنده", category: "DIN", size: "M6 - M100", material: "فولاد کربنی گرید ۸.۸", app: "صنایع عمومی و ساختمانی" },
    { id: "std-3", std: "DIN 912", type: "پیچ آلن سر استوانه‌ای", category: "DIN", size: "M3 - M48", material: "گرید ۱۲.۹ فولادی فوق سخت", app: "قالب‌سازی و خودرو" },
    { id: "std-4", std: "ISO 4014", type: "پیچ شش‌گوش گل درشت نیم‌دنده", category: "ISO", size: "M8 - M36", material: "استنلس استیل ۳۱۶", app: "محیط‌های خورنده اسیدی" },
    { id: "std-5", std: "ASTM A193", type: "استاد بولت فولادی گرید B7", category: "ASTM", size: '1/2" - 4"', material: "کروم مولیبدنوم آبکاری‌شده", app: "فلنج‌های پتروشیمی پرفشار" },
    { id: "std-6", std: "ASTM A194", type: "مهره کلاس مقاومتی سنگین 2H", category: "ASTM", size: '1/2" - 4"', material: "فولاد حرارت‌دیده آلیاژی", app: "مکمل استاد بولت‌های صنعتی" },
    { id: "std-7", std: "DIN 6921", type: "پیچ فلنج‌دار واشردار", category: "DIN", size: "M5 - M20", material: "آلیاژ کربن متوسط", app: "شاسی‌سازی و سیستم‌های تعلیق" },
  ],
  inquiries: []
};

const STORAGE_KEY = 'rostaghpich_v2_site_data';

export function getSiteData(): SiteData {
  if (typeof window === 'undefined') return defaultSiteData;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSiteData));
      return defaultSiteData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading site data from localStorage", error);
    return defaultSiteData;
  }
}

export function saveSiteData(data: SiteData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving site data to localStorage", error);
  }
}
