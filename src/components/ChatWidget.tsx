import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const PRESETS = [
  { q: 'تفاوت گرید ۸.۸ و ۱۰.۹ چیست؟', a: 'پیچ‌های گرید ۱۰.۹ دارای استحکام تسلیم بیشتری (حدود ۹۴۰ مگاپاسکال) نسبت به گرید ۸.۸ (۶۴۰ مگاپاسکال) هستند و برای سازه‌های سنگین و بارهای دینامیکی دینامیک شدید توصیه می‌شوند.' },
  { q: 'پوشش داکرومات چه مزیتی دارد؟', a: 'پوشش داکرومات لایه نازک و بسیار مقاوم در برابر نمک و خوردگی شیمیایی (بیش از ۱۰۰۰ ساعت سالت اسپری) ایجاد کرده و از پدیده تردی هیدروژنی در پیچ‌های گرید ۱۲.۹ کاملاً جلوگیری می‌کند.' },
  { q: 'سریع‌ترین راه دریافت قیمت چیست؟', a: 'شما می‌توانید از طریق فرم استعلام آنلاین بالای صفحه یا بخش استعلام پایانی، مشخصات مورد نیاز خود را به همراه فایل نقشه ارسال فرمایید تا پیش‌فاکتور رسمی صادر گردد.' },
  { q: 'آیا تولید سفارشی هم دارید؟', a: 'بله، شرکت رستاق پیچ نوین توانایی فورج گرم و تولید پیچ‌های صنعتی غیر استاندارد تا سایز M100 را طبق نقشه یا نمونه ارسالی کارفرما دارد.' }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'سلام! مهندس مشاور واحد فنی رستاق پیچ نوین هستم. چطور می‌توانم در خصوص استانداردها، گریدها یا استعلام قیمت انواع اتصالات صنعتی به شما کمک کنم؟',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate smart engineering bot response
    setTimeout(() => {
      let replyText = 'درخواست شما دریافت شد. همکاران فنی ما در بخش مهندسی متالورژی به زودی با شماره تماس شما تماس می‌گیرند تا اطلاعات تکمیلی را ارائه دهند. برای مشاوره فوری تلفنی همواره می‌توانید با فروشگاه مرکزی تماس حاصل فرمایید.';
      
      // Look for keywords
      const lowerText = text.toLowerCase();
      if (lowerText.includes('گرید') || lowerText.includes('grade') || lowerText.includes('8.8') || lowerText.includes('10.9') || lowerText.includes('12.9')) {
        replyText = 'در خصوص کلاس‌های مقاومتی پیچ‌های فولادی: پیچ گرید ۸.۸ فولاد کربنی متوسط آبکاری شده، ۱۰.۹ آلیاژی خشکه با استحکام بالاتر، و ۱۲.۹ فوق سخت صنعتی می‌باشد. توصیه می‌شود برای بارهای مرتعش حتماً از گرید ۱۰.۹ یا بالاتر با تست ضربه استفاده نمایید.';
      } else if (lowerText.includes('پوشش') || lowerText.includes('آبکاری') || lowerText.includes('داکرومات') || lowerText.includes('گالوانیزه')) {
        replyText = 'ما پوشش‌های متنوعی از جمله گالوانیزه گرم (HDG) مطابق ASTM A153، داکرومات زینک فلیک مطابق ISO 10683، و زینک کرومات زرد و مشکی ارائه می‌کنیم. داکرومات به علت عدم ایجاد تردی هیدروژنی، پوشش بهینه برای اتصالات گرید ۱۰.۹ و ۱۲.۹ است.';
      } else if (lowerText.includes('کاتالوگ') || lowerText.includes('لیست') || lowerText.includes('دانلود')) {
        replyText = 'کاتالوگ جامع صنعتی ما شامل جداول دقیق ابعادی DIN 931, DIN 912, DIN 6914 به همراه وزن‌های فنی می‌باشد. شما می‌توانید نسخه الکترونیکی را از بخش مدیریت دریافت نمایید یا درخواست ارسال کاتالوگ چاپی را ثبت کنید.';
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed right-6 bottom-24 md:bottom-6 z-50">
      {/* Floating Action Circle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-hover text-black flex items-center justify-center shadow-2xl shadow-primary-glow/40 hover:scale-110 active:scale-95 transition-all cursor-pointer relative group border border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={24} />
              {/* Pulsing indicator bubble */}
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center animate-pulse"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Windows Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, x: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="absolute right-0 bottom-18 w-[350px] sm:w-[380px] h-[500px] bg-gray-950/95 backdrop-blur-2xl border border-gray-800/90 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden z-50 text-right"
          >
            {/* Window Header */}
            <div className="p-4 bg-gray-900/80 border-b border-gray-900 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-black shadow-lg shadow-primary-glow/10 shrink-0">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    سامانه هوشمند مشاوره فنی
                    <Sparkles size={11} className="text-primary animate-pulse" />
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-gray-500">مهندسان متالورژی آنلاین</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-gray-950 border border-gray-900 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat Messages Log Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-2.5 items-start max-w-[85%] ${
                      isBot ? 'self-start flex-row-reverse' : 'self-end flex-row'
                    }`}
                  >
                    {/* Message Avatar */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow ${
                      isBot ? 'bg-primary/25 text-primary' : 'bg-gray-900 text-gray-400'
                    }`}>
                      {isBot ? <Bot size={14} /> : <User size={14} />}
                    </div>

                    {/* Message text card */}
                    <div className="flex flex-col gap-1">
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isBot 
                          ? 'bg-gray-900 text-gray-200 rounded-tr-none border border-gray-900/60' 
                          : 'bg-primary text-black font-medium rounded-tl-none shadow-md shadow-primary-glow/10'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-600 font-mono self-start px-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}

              {/* Typing simulation */}
              {isTyping && (
                <div className="flex gap-2.5 items-start self-start flex-row-reverse">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-gray-900 text-gray-400 p-3 rounded-2xl rounded-tr-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Presets / FAQs */}
            <div className="px-4 py-2 border-t border-gray-900/60 bg-gray-950 flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-500 font-bold mb-1 block flex items-center gap-1 justify-end">
                <span>پرسش‌های متداول مهندسی</span>
                <HelpCircle size={10} className="text-gray-600" />
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-color-[var(--primary)] text-right" dir="rtl">
                {PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        sender: 'user',
                        text: preset.q,
                        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                      }]);
                      setIsTyping(true);
                      setTimeout(() => {
                        setMessages(prev => [...prev, {
                          id: (Date.now() + 1).toString(),
                          sender: 'bot',
                          text: preset.a,
                          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                        }]);
                        setIsTyping(false);
                      }, 1200);
                    }}
                    className="whitespace-nowrap px-3 py-1.5 bg-gray-900/60 hover:bg-primary/10 border border-gray-800 hover:border-primary/25 rounded-lg text-[10px] text-gray-400 hover:text-primary transition-all cursor-pointer shrink-0"
                  >
                    {preset.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Input Message Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 bg-gray-900/60 border-t border-gray-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="سوال فنی خود را بپرسید..."
                className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send size={14} className="rotate-180" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
