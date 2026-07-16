import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Save, RotateCcw, Plus, Trash2, Edit2, 
  Settings, Database, FileText, Check, ShieldCheck, 
  HelpCircle, Eye, RefreshCw, LayoutDashboard, Layers, BarChart4, Mail, EyeOff, LogOut
} from 'lucide-react';
import { 
  SiteData, StatItem, ProductItem, StandardItem, InquiryItem, 
  getSiteData, saveSiteData, defaultSiteData 
} from '../lib/siteData';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChange: (newData: SiteData) => void;
}

export default function AdminDashboard({ isOpen, onClose, onDataChange }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'hero_stats' | 'products' | 'standards' | 'inquiries'>('hero_stats');
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // States for dynamic add/edit helpers
  const [newSpec, setNewSpec] = useState('');
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  
  // Standard Row Add/Edit helper state
  const [editingStandardId, setEditingStandardId] = useState<string | null>(null);
  const [newStandard, setNewStandard] = useState<Omit<StandardItem, 'id'>>({
    std: '',
    type: '',
    category: 'DIN',
    size: '',
    material: '',
    app: ''
  });

  // Load from local storage on mount
  useEffect(() => {
    if (isOpen) {
      setData(getSiteData());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setSuccessMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handleSaveAll = (currentData: SiteData) => {
    saveSiteData(currentData);
    onDataChange(currentData);
    triggerToast('تغییرات با موفقیت ذخیره شدند و روی سایت اعمال گردیدند.');
  };

  const handleResetToDefault = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تمام محتوای سایت را به حالت پیش‌فرض کارخانه بازنشانی کنید؟')) {
      setData(defaultSiteData);
      saveSiteData(defaultSiteData);
      onDataChange(defaultSiteData);
      triggerToast('تنظیمات سایت به حالت پیش‌فرض بازنشانی شدند.');
    }
  };

  // Hero edits
  const handleHeroChange = (field: keyof SiteData['hero'], value: string) => {
    const updated = {
      ...data,
      hero: {
        ...data.hero,
        [field]: value
      }
    };
    setData(updated);
  };

  // Stats edits
  const handleStatChange = (id: string, field: keyof StatItem, value: string) => {
    const updatedStats = data.stats.map(s => s.id === id ? { ...s, [field]: value } : s);
    setData({
      ...data,
      stats: updatedStats
    });
  };

  // Product CRUD
  const handleProductChange = (index: number, field: keyof ProductItem, value: any) => {
    const updatedProducts = [...data.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    setData({
      ...data,
      products: updatedProducts
    });
  };

  const handleAddProduct = () => {
    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      title: 'پیچ جدید صنعتی',
      subtitle: 'استاندارد DIN XXX',
      desc: 'توضیحات کوتاه فنی مربوط به محصول جدید تولیدی در رستاق پیچ نوین.',
      specs: ['سایز دایره‌ای: M12', 'کلاس مقاومتی: 10.9'],
      badge: 'محصول جدید سفارشی'
    };
    const updated = {
      ...data,
      products: [...data.products, newProduct]
    };
    setData(updated);
    setSelectedProductIndex(updated.products.length - 1);
    triggerToast('محصول جدید اضافه شد. اکنون می‌توانید مشخصات آن را ویرایش کنید.');
  };

  const handleDeleteProduct = (index: number) => {
    if (confirm('آیا از حذف این محصول صنعتی اطمینان دارید؟')) {
      const updatedProducts = data.products.filter((_, i) => i !== index);
      setData({
        ...data,
        products: updatedProducts
      });
      setSelectedProductIndex(null);
      triggerToast('محصول با موفقیت حذف شد.');
    }
  };

  const handleAddSpecToProduct = (productIndex: number) => {
    if (!newSpec.trim()) return;
    const product = data.products[productIndex];
    const updatedSpecs = [...product.specs, newSpec.trim()];
    handleProductChange(productIndex, 'specs', updatedSpecs);
    setNewSpec('');
  };

  const handleDeleteSpecFromProduct = (productIndex: number, specIndex: number) => {
    const product = data.products[productIndex];
    const updatedSpecs = product.specs.filter((_, i) => i !== specIndex);
    handleProductChange(productIndex, 'specs', updatedSpecs);
  };

  // Standards Table CRUD
  const handleAddStandard = () => {
    if (!newStandard.std || !newStandard.type) {
      alert('لطفاً شماره استاندارد و نوع پیچ را وارد نمایید.');
      return;
    }
    const created: StandardItem = {
      id: `std-${Date.now()}`,
      ...newStandard
    };
    const updated = {
      ...data,
      standards: [...data.standards, created]
    };
    setData(updated);
    setNewStandard({
      std: '',
      type: '',
      category: 'DIN',
      size: '',
      material: '',
      app: ''
    });
    triggerToast('ردیف استاندارد جدید به جدول فنی افزوده شد.');
  };

  const handleDeleteStandard = (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این ردیف استاندارد را از جدول فنی حذف کنید؟')) {
      const updatedStandards = data.standards.filter(s => s.id !== id);
      setData({
        ...data,
        standards: updatedStandards
      });
      triggerToast('استاندارد با موفقیت حذف شد.');
    }
  };

  // Inquiries updates
  const handleInquiryStatusChange = (id: string, newStatus: InquiryItem['status']) => {
    const updatedInquiries = data.inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setData({
      ...data,
      inquiries: updatedInquiries
    });
    triggerToast('وضعیت پیگیری درخواست تغییر یافت.');
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این درخواست را برای همیشه حذف کنید؟')) {
      const updatedInquiries = data.inquiries.filter(i => i.id !== id);
      setData({
        ...data,
        inquiries: updatedInquiries
      });
      triggerToast('درخواست استعلام حذف شد.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" dir="rtl">
      {/* Backdrop scrim */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />

      {/* Main SaaS panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 24, stiffness: 180 }}
        className="relative w-full max-w-5xl h-full bg-gray-950 border-r border-gray-900 flex flex-col z-10 text-right shadow-2xl"
      >
        {/* Panel Header */}
        <div className="p-4 md:p-6 border-b border-gray-900 bg-gray-950/80 backdrop-blur flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-3">
          <div className="flex items-center gap-2.5 md:gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Settings className="animate-spin duration-10000" size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm md:text-xl font-black text-white truncate">پنل مدیریت محتوا</h2>
              <p className="text-[10px] md:text-xs text-gray-500 font-mono truncate hidden xs:block">Management Studio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="بازگشت به حالت کارخانه"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">ریست کارخانه</span>
              <span className="inline sm:hidden">ریست</span>
            </button>

            <button 
              onClick={() => handleSaveAll(data)}
              className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-950/40 transition-all border border-orange-500/20 cursor-pointer"
            >
              <Save size={14} />
              <span className="hidden sm:inline">ذخیره نهایی محتوا</span>
              <span className="inline sm:hidden">ذخیره</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-all cursor-pointer shrink-0"
              title="بستن پنل"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dashboard layout core */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="hidden md:flex w-64 bg-gray-950/60 border-l border-gray-900 p-4 flex flex-col gap-2">
            <span className="block text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase px-3">بخش‌های سایت</span>
            
            <button
              onClick={() => setActiveTab('hero_stats')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'hero_stats' 
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner' 
                  : 'text-gray-400 hover:bg-gray-900/50 hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>متن هیرو و آمارها</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'products' 
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner' 
                  : 'text-gray-400 hover:bg-gray-900/50 hover:text-white'
              }`}
            >
              <Layers size={16} />
              <span>مدیریت محصولات</span>
              <span className="mr-auto text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                {data.products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('standards')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'standards' 
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner' 
                  : 'text-gray-400 hover:bg-gray-900/50 hover:text-white'
              }`}
            >
              <BarChart4 size={16} />
              <span>جدول استانداردها</span>
              <span className="mr-auto text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                {data.standards.length}
              </span>
            </button>

            <div className="border-t border-gray-900 my-4"></div>
            
            <span className="block text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase px-3">بخش ارتباطی</span>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'inquiries' 
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner' 
                  : 'text-gray-400 hover:bg-gray-900/50 hover:text-white'
              }`}
            >
              <Mail size={16} />
              <span>استعلام‌های دریافتی</span>
              <span className="mr-auto text-[10px] bg-orange-600 text-white px-2.5 py-0.5 rounded-full font-bold">
                {data.inquiries.filter(i => i.status === 'PENDING').length} جدید
              </span>
            </button>

            {/* Quick Helper Tips */}
            <div className="mt-auto p-4 bg-gray-900/30 border border-gray-900 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <HelpCircle size={14} className="text-orange-500" />
                <span>نکته مدیریت</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                تمام ویرایش‌های شما در مرورگر وب شما ذخیره خواهند شد و با دکمه بالا بلافاصله روی وب‌سایت زنده اعمال می‌شوند.
              </p>
            </div>
          </div>

          {/* Active Content Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 bg-gray-950/40">
            
            {/* TAB 1: HERO & STATS */}
            {activeTab === 'hero_stats' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">ویرایش بخش هیرو (بخش اول سایت)</h3>
                  <p className="text-xs text-gray-500">محتوای تبلیغاتی اصلی و شعارهای بالای صفحه اول را ویرایش کنید.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Badge Text */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400">برچسب باریک بالای هیرو</label>
                    <input 
                      type="text" 
                      value={data.hero.badge}
                      onChange={(e) => handleHeroChange('badge', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/70 border border-gray-800 focus:border-orange-500/50 rounded-xl text-sm text-white transition-all font-medium"
                    />
                  </div>

                  {/* Hero Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400">عنوان اصلی هیرو</label>
                    <input 
                      type="text" 
                      value={data.hero.title}
                      onChange={(e) => handleHeroChange('title', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/70 border border-gray-800 focus:border-orange-500/50 rounded-xl text-sm text-white transition-all font-extrabold"
                    />
                  </div>

                  {/* Slogan */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400">شعار برند (زیرعنوان هیرو)</label>
                    <input 
                      type="text" 
                      value={data.hero.subtitle}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/70 border border-gray-800 focus:border-orange-500/50 rounded-xl text-sm text-orange-500 transition-all font-bold"
                    />
                  </div>

                  {/* Hero Description */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400">توضیحات تکمیلی هیرو</label>
                    <textarea 
                      rows={3}
                      value={data.hero.desc}
                      onChange={(e) => handleHeroChange('desc', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/70 border border-gray-800 focus:border-orange-500/50 rounded-xl text-sm text-gray-300 leading-relaxed transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-900 my-4"></div>

                <div>
                  <h3 className="text-lg font-black text-white mb-1">ویرایش کارت‌های آمار و عملکرد</h3>
                  <p className="text-xs text-gray-500">شاخص‌ها، ظرفیت‌های تولید و رکوردهای مجموعه را به‌روزرسانی نمایید.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.stats.map((stat) => (
                    <div key={stat.id} className="p-5 rounded-2xl bg-gray-900/30 border border-gray-900 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-orange-500">آمار شماره {stat.id.split('-')[1]}</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-500">مقدار عددی (مثلاً ۵,۰۰۰+)</label>
                          <input 
                            type="text" 
                            value={stat.value}
                            onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-sm text-white font-mono text-center"
                          />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-500">برچسب فارسی شاخص</label>
                          <input 
                            type="text" 
                            value={stat.label}
                            onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-xs text-gray-300 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS CATALOG */}
            {activeTab === 'products' && (
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-white mb-1">مدیریت کاتالوگ محصولات صنعتی</h3>
                    <p className="text-xs text-gray-500">دسته‌بندی‌های مختلف پیچ و مهره را حذف، ویرایش یا اضافه کنید.</p>
                  </div>
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    <Plus size={14} />
                    <span>افزودن محصول جدید</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.products.map((p, index) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProductIndex(index)}
                      className={`p-4 rounded-xl text-right border transition-all flex flex-col gap-2 cursor-pointer ${
                        selectedProductIndex === index 
                          ? 'bg-orange-500/10 border-orange-500/30 text-white shadow-lg' 
                          : 'bg-gray-900/40 border-gray-900 text-gray-400 hover:bg-gray-900 hover:text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs bg-gray-950 border border-gray-800 text-orange-400 px-2.5 py-1 rounded-lg font-mono">
                          {p.badge}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(index);
                            }}
                            className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                            title="حذف کامل این دسته‌بندی"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <span className="font-bold text-sm truncate block">{p.title}</span>
                      <span className="text-[10px] text-gray-500 font-mono block truncate">{p.subtitle}</span>
                    </div>
                  ))}
                </div>

                {selectedProductIndex !== null && data.products[selectedProductIndex] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gray-900/20 border border-gray-900 flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center border-b border-gray-900 pb-4">
                      <h4 className="text-sm font-black text-white flex items-center gap-2">
                        <Edit2 size={14} className="text-orange-500" />
                        <span>ویرایش جزییات: {data.products[selectedProductIndex].title}</span>
                      </h4>
                      <button 
                        onClick={() => setSelectedProductIndex(null)}
                        className="text-xs text-gray-500 hover:text-white"
                      >
                        بستن فرم ویرایش
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Title */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400">نام کامل محصول</label>
                        <input 
                          type="text" 
                          value={data.products[selectedProductIndex].title}
                          onChange={(e) => handleProductChange(selectedProductIndex, 'title', e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-xl text-sm text-white"
                        />
                      </div>

                      {/* Product Badge */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400">برچسب وضعیت (مثل: مقاومت کششی بالا)</label>
                        <input 
                          type="text" 
                          value={data.products[selectedProductIndex].badge}
                          onChange={(e) => handleProductChange(selectedProductIndex, 'badge', e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-xl text-sm text-orange-400 font-medium"
                        />
                      </div>

                      {/* Product Standard Code */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400">کدهای استاندارد (مثل: DIN 931 / DIN 933)</label>
                        <input 
                          type="text" 
                          value={data.products[selectedProductIndex].subtitle}
                          onChange={(e) => handleProductChange(selectedProductIndex, 'subtitle', e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-xl text-xs text-gray-300 font-mono"
                        />
                      </div>

                      {/* Description */}
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-400">توضیحات و کاربرد صنعتی اصلی</label>
                        <textarea 
                          rows={2}
                          value={data.products[selectedProductIndex].desc}
                          onChange={(e) => handleProductChange(selectedProductIndex, 'desc', e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-xl text-xs text-gray-300 leading-relaxed"
                        />
                      </div>

                      {/* Specs list management */}
                      <div className="flex flex-col gap-3 md:col-span-2">
                        <label className="text-xs font-bold text-gray-400">لیست مشخصات فنی تخصصی (Bullet points)</label>
                        
                        <div className="flex flex-col gap-2">
                          {data.products[selectedProductIndex].specs.map((spec, specIdx) => (
                            <div key={specIdx} className="flex justify-between items-center bg-gray-950/80 border border-gray-900 px-4 py-2.5 rounded-xl">
                              <span className="text-xs text-gray-300 font-medium">{spec}</span>
                              <button 
                                onClick={() => handleDeleteSpecFromProduct(selectedProductIndex, specIdx)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add new spec form */}
                        <div className="flex gap-2 mt-2">
                          <input 
                            type="text" 
                            placeholder="مثال: متریال آلیاژی ضداسید ۳۱۶..."
                            value={newSpec}
                            onChange={(e) => setNewSpec(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSpecToProduct(selectedProductIndex);
                              }
                            }}
                            className="flex-1 px-4 py-2.5 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-xl text-xs text-white"
                          />
                          <button
                            onClick={() => handleAddSpecToProduct(selectedProductIndex)}
                            className="px-4 bg-gray-900 border border-gray-800 text-orange-500 hover:bg-orange-500/10 rounded-xl text-xs font-bold transition-all shrink-0"
                          >
                            افزودن بند
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* TAB 3: STANDARDS DIN/ISO */}
            {activeTab === 'standards' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">جدول استانداردهای بین‌المللی اتصالات</h3>
                  <p className="text-xs text-gray-500">ردیف‌های کدهای فنی و کلاس‌های فیزیکی را ویرایش و اضافه نمایید.</p>
                </div>

                {/* Inline form to add new Row */}
                <div className="p-5 rounded-2xl bg-gray-900/30 border border-gray-900 flex flex-col gap-4">
                  <span className="text-xs font-bold text-orange-400">افزودن ردیف استاندارد جدید به جدول</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <input 
                      type="text" 
                      placeholder="کد استاندارد (مثلاً: DIN 912)"
                      value={newStandard.std}
                      onChange={(e) => setNewStandard({ ...newStandard, std: e.target.value })}
                      className="px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-xs text-white"
                    />
                    <input 
                      type="text" 
                      placeholder="نوع پیچ (مثلاً: آلن سر استوانه‌ای)"
                      value={newStandard.type}
                      onChange={(e) => setNewStandard({ ...newStandard, type: e.target.value })}
                      className="px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-xs text-white"
                    />
                    <select
                      value={newStandard.category}
                      onChange={(e) => setNewStandard({ ...newStandard, category: e.target.value })}
                      className="px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-xs text-white"
                    >
                      <option value="DIN">DIN (استاندارد آلمان)</option>
                      <option value="ISO">ISO (بین‌المللی)</option>
                      <option value="ASTM">ASTM (سازه‌ای اینچی)</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="محدوده سایز (M12 - M64)"
                      value={newStandard.size}
                      onChange={(e) => setNewStandard({ ...newStandard, size: e.target.value })}
                      className="px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-xs text-white"
                    />
                    <input 
                      type="text" 
                      placeholder="متریال و کلاس (گرید ۱۰.۹)"
                      value={newStandard.material}
                      onChange={(e) => setNewStandard({ ...newStandard, material: e.target.value })}
                      className="px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-xs text-white"
                    />
                    <input 
                      type="text" 
                      placeholder="کاربرد اصلی (ماشین‌سازی)"
                      value={newStandard.app}
                      onChange={(e) => setNewStandard({ ...newStandard, app: e.target.value })}
                      className="px-3 py-2 bg-gray-950 border border-gray-800 focus:border-orange-500/50 rounded-lg text-xs text-white"
                    />
                  </div>
                  <button 
                    onClick={handleAddStandard}
                    className="self-start px-5 py-2 bg-gray-900 hover:bg-orange-600 border border-gray-800 hover:border-orange-500 text-orange-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>درج در جدول فنی</span>
                  </button>
                </div>

                {/* Table list rows preview to edit / delete */}
                <div className="overflow-x-auto rounded-2xl border border-gray-900 bg-gray-950/20">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-gray-900 text-gray-400 border-b border-gray-900">
                      <tr>
                        <th className="p-4">استاندارد</th>
                        <th className="p-4">شکل و ساختار پیچ</th>
                        <th className="p-4">محدوده سایز</th>
                        <th className="p-4">متریال پایه</th>
                        <th className="p-4">کاربرد شاخص</th>
                        <th className="p-4 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      {data.standards.map((std) => (
                        <tr key={std.id} className="hover:bg-gray-900/20 text-gray-300">
                          <td className="p-4 font-mono font-bold text-orange-400">{std.std}</td>
                          <td className="p-4 font-bold">{std.type}</td>
                          <td className="p-4 font-mono">{std.size}</td>
                          <td className="p-4">{std.material}</td>
                          <td className="p-4 text-xs text-gray-400">{std.app}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteStandard(std.id)}
                              className="p-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: SUBMITTED INQUIRIES LOG */}
            {activeTab === 'inquiries' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">استعلام‌های دریافتی از مشتریان</h3>
                  <p className="text-xs text-gray-500">درخواست‌های پیش‌فاکتور و استعلام‌های آنلاین پرشده در فرم تماس سایت را ردیابی کنید.</p>
                </div>

                {data.inquiries.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-gray-900 rounded-3xl bg-gray-900/10">
                    <Mail size={32} className="text-gray-600 mx-auto mb-4" />
                    <span className="block text-sm font-bold text-gray-400 mb-1">هیچ درخواستی ثبت نشده است</span>
                    <span className="text-xs text-gray-500">هنگامی که مشتریان فرم استعلام قیمت را ارسال کنند، داده‌هایشان فوراً در این پنل قابل پیگیری خواهد بود.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {data.inquiries.map((inq) => (
                      <div key={inq.id} className={`p-5 rounded-2xl border transition-all flex flex-col gap-4 ${
                        inq.status === 'PENDING' 
                          ? 'bg-orange-500/5 border-orange-500/20 shadow-lg shadow-orange-950/10' 
                          : inq.status === 'CONTACTED'
                          ? 'bg-blue-500/5 border-blue-500/20'
                          : 'bg-gray-900/20 border-gray-900 opacity-80'
                      }`}>
                        
                        {/* Upper row details */}
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white text-base">{inq.name}</span>
                              {inq.company && (
                                <span className="bg-gray-900 border border-gray-800 text-gray-400 text-xs px-2.5 py-0.5 rounded-lg font-medium">
                                  {inq.company}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono block mt-1">{inq.date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Status Change Dropdown */}
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as InquiryItem['status'])}
                              className="bg-gray-950 border border-gray-800 text-xs px-3 py-1.5 rounded-lg text-gray-300 font-bold focus:border-orange-500"
                            >
                              <option value="PENDING">🔴 در انتظار هماهنگی واحد فروش</option>
                              <option value="CONTACTED">🔵 در حال تماس و صدور فاکتور</option>
                              <option value="COMPLETED">🟢 صدور موفق پیش‌فاکتور نهایی</option>
                            </select>

                            {/* Trash button */}
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Mid-level details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-950/60 p-4 rounded-xl border border-gray-900">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500">شماره تماس مشتری</span>
                            <a href={`tel:${inq.phone}`} className="text-sm font-mono font-bold text-white hover:text-orange-400 transition-colors">
                              {inq.phone}
                            </a>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500">دسته‌بندی محصول مورد نیاز</span>
                            <span className="text-sm font-bold text-orange-400">
                              {inq.productType}
                            </span>
                          </div>
                        </div>

                        {/* Description field */}
                        {inq.desc && (
                          <div className="text-xs text-gray-400 leading-relaxed bg-gray-900/20 p-3 rounded-lg border border-gray-900/60">
                            <span className="font-bold text-gray-300 block mb-1">توضیحات و ابعاد سفارشی مشتری:</span>
                            {inq.desc}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Android Mobile Dashboard Bottom Navigation */}
        <div className="md:hidden fixed bottom-5 left-5 right-5 z-50 bg-gray-950/90 backdrop-blur-xl border border-gray-800/80 rounded-2xl px-2 py-2.5 flex justify-around items-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <button
            onClick={() => setActiveTab('hero_stats')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative rounded-xl transition-all cursor-pointer ${
              activeTab === 'hero_stats' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="text-[9px] font-bold">هیرو و آمار</span>
            {activeTab === 'hero_stats' && (
              <motion.div 
                layoutId="dashboard-bottom-indicator"
                className="absolute -bottom-1 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary-glow)]"
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative rounded-xl transition-all cursor-pointer ${
              activeTab === 'products' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="relative">
              <Layers size={18} />
              {data.products.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-gray-800 border border-gray-700 text-gray-300 w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {data.products.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold">محصولات</span>
            {activeTab === 'products' && (
              <motion.div 
                layoutId="dashboard-bottom-indicator"
                className="absolute -bottom-1 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary-glow)]"
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative rounded-xl transition-all cursor-pointer ${
              activeTab === 'standards' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="relative">
              <BarChart4 size={18} />
              {data.standards.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-gray-800 border border-gray-700 text-gray-300 w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {data.standards.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold">استانداردها</span>
            {activeTab === 'standards' && (
              <motion.div 
                layoutId="dashboard-bottom-indicator"
                className="absolute -bottom-1 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary-glow)]"
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative rounded-xl transition-all cursor-pointer ${
              activeTab === 'inquiries' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="relative">
              <Mail size={18} />
              {data.inquiries.filter(i => i.status === 'PENDING').length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {data.inquiries.filter(i => i.status === 'PENDING').length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold">استعلام‌ها</span>
            {activeTab === 'inquiries' && (
              <motion.div 
                layoutId="dashboard-bottom-indicator"
                className="absolute -bottom-1 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary-glow)]"
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              />
            )}
          </button>

          <button
            onClick={onClose}
            className="flex flex-col items-center gap-1.5 py-1 px-3.5 relative rounded-xl transition-all text-red-500 hover:text-red-400 cursor-pointer"
            title="خروج از پنل مدیریت"
          >
            <LogOut size={18} />
            <span className="text-[9px] font-bold">خروج</span>
          </button>
        </div>
      </motion.div>

      {/* Success SuccessToast bottom notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 p-4 bg-emerald-500 text-black font-bold rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 max-w-sm text-right"
          >
            <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center">
              <Check size={18} />
            </div>
            <div className="flex-1 text-xs">
              {successMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
