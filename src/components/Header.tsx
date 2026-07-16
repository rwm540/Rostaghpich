import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Home, Package, Table, Mail, 
  Phone, Download, ShieldCheck, Cpu, Settings, ExternalLink 
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
}

export default function Header({ onOpenAdmin }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('#home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll Spy to detect current active section
      const sections = ['home', 'products', 'standards', 'inquiry'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    { name: 'صفحه اصلی', icon: Home, link: '#home' },
    { name: 'کاتالوگ محصولات', icon: Package, link: '#products' },
    { name: 'جدول استانداردها', icon: Table, link: '#standards' },
    { name: 'استعلام قیمت هوشمند', icon: Mail, link: '#inquiry' },
  ];

  const bottomMenuItems = [
    { name: 'خانه', icon: Home, link: '#home', action: null },
    { name: 'محصولات', icon: Package, link: '#products', action: null },
    { name: 'استانداردها', icon: Table, link: '#standards', action: null },
    { name: 'استعلام', icon: Mail, link: '#inquiry', action: null },
    { name: 'مدیریت', icon: Settings, link: '#', action: onOpenAdmin },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-950/95 backdrop-blur-xl border-b border-primary/15 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-gradient-to-b from-gray-950/90 to-transparent py-6'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary-glow/40">
              <span className="font-mono text-xl font-black text-black">R</span>
              <div className="absolute inset-0 rounded-xl border border-white/20 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">رستاق <span className="text-primary">پیچ نوین</span></span>
              <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">Industrial Fasteners</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="relative text-sm text-gray-300 hover:text-white transition-colors duration-300 group py-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon size={16} className="text-primary/70 group-hover:text-primary transition-colors" />
                  {item.name}
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right rounded"></span>
              </a>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onOpenAdmin}
              className="px-4 py-2.5 bg-gray-900 hover:bg-gray-850 text-gray-300 hover:text-primary rounded-xl text-xs font-bold transition-all duration-300 border border-gray-800 flex items-center gap-2 cursor-pointer"
            >
              <Settings size={14} className="text-primary" />
              پنل کاربری
            </button>
            <a 
              href="#inquiry" 
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-hover hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-lg shadow-primary-glow/50 border border-primary/30 flex items-center gap-2"
            >
              <Cpu size={14} />
              استعلام قیمت آنلاین
            </a>
          </div>

          {/* Android Mobile Phone Contact Action */}
          <a 
            href="tel:+982112345678" 
            className="md:hidden flex items-center justify-center p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-primary hover:text-white active:scale-95 transition-all shadow-md shadow-black/30"
            title="تماس مستقیم با واحد فروش"
          >
            <Phone size={18} />
          </a>
        </nav>
      </header>

      {/* Android Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-5 left-5 right-5 z-50 bg-gray-950/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl px-3 py-2.5 flex justify-around items-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        {bottomMenuItems.map((item, index) => {
          const isActive = item.action ? false : activeTab === item.link;
          const Icon = item.icon;
          
          return (
            <a
              key={index}
              href={item.link}
              onClick={(e) => {
                if (item.action) {
                  e.preventDefault();
                  item.action();
                } else {
                  setActiveTab(item.link);
                }
              }}
              className="flex flex-col items-center gap-1 py-1.5 px-1 rounded-2xl transition-all duration-300 relative group select-none cursor-pointer flex-1"
            >
              <div className={`p-1 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-gray-500 group-hover:text-gray-300'
              }`}>
                <Icon size={18} />
              </div>
              <span className={`text-[9px] font-bold tracking-tight transition-all duration-300 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 group-hover:text-gray-300'
              }`}>
                {item.name}
              </span>
              
              {/* Active Glow Accent under icon */}
              {isActive && (
                <motion.div 
                  layoutId="bottom-active-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-gradient-to-r from-primary to-primary-hover rounded-full shadow-[0_0_8px_var(--primary-glow)]"
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </>
  );
}
