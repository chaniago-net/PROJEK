import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Sparkles, Minus } from 'lucide-react';
import { chatWithUstaz } from '../services/ustazService';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiUstaz: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Assalamu\'alaikum Anandaku! Saya Ustaz Al-Amin. Ada yang bisa ana bantu dalam membangun Empire-mu atau belajar PAI hari ini?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Format history for Gemini SDK
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithUstaz(userMessage, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-[380px] h-[500px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden mb-4 border border-islamic-gold/20"
          >
            {/* Header */}
            <div className="bg-islamic-green p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-islamic-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg leading-none italic">Ustaz Al-Amin</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">AI Mentor PAI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-sand/30"
            >
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex flex-col max-w-[85%]",
                  m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                )}>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    m.role === 'user' 
                      ? "bg-islamic-gold text-white rounded-tr-none" 
                      : "bg-white text-ink border border-gray-100 rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 mt-1 px-1">
                    {m.role === 'user' ? 'Anda' : 'Ustaz'}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="bg-white/50 p-3 rounded-2xl rounded-tl-none border border-gray-100 italic text-gray-400 text-xs">
                    Ustaz sedang mengetik...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tanyakan sesuatu..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-islamic-green text-white rounded-xl transition-all hover:scale-110 active:scale-95 disabled:grayscale disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-islamic-green text-white px-4 py-2 rounded-full shadow-lg text-sm font-serif italic cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            Ustaz Al-Amin
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all",
            isOpen ? "bg-white text-islamic-green border-2 border-islamic-green" : "bg-islamic-green text-white"
          )}
        >
          {isOpen ? <Sparkles className="w-8 h-8 text-islamic-gold" /> : <MessageCircle className="w-8 h-8" />}
        </motion.button>
      </div>
    </div>
  );
};
