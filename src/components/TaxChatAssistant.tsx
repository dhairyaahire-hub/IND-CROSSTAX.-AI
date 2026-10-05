import React, { useState, useRef, useEffect } from 'react';
import { FullTaxAnalysisReport } from '../types/tax';
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Scale, 
  RefreshCw
} from 'lucide-react';

interface TaxChatAssistantProps {
  report?: FullTaxAnalysisReport;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const TaxChatAssistant: React.FC<TaxChatAssistantProps> = ({ report }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: `Greetings. I am your International Tax Counsel at Cross Tax AI. I am trained in OECD Transfer Pricing Guidelines (2022), bilateral DTAA conventions (Articles 5, 7, 12, 14, 23), and India's Income Tax Act 1961 (Chapter X Transfer Pricing, Section 90/90A, 115A, 195, and 206AA).

${report ? `I have your active assessment loaded for ${report.contract.clientName} (${report.contract.residentCountry} → ${report.contract.sourceCountry}).` : 'How can I assist you with your cross-border tax structuring today?'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-tax-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          contextReport: report || null
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'I am currently unable to parse that tax query. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'An error occurred while consulting the international tax agent. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'How does the "Make Available" clause protect pure software services?',
    'What happens if my operating profit margin is lower than 17% under Indian Safe Harbour?',
    'Can our foreign client deduct 20% tax if we do not possess an Indian PAN?',
    'How is a Service Permanent Establishment calculated under the India-US DTAA?'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header (White Card with Red Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/25">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">AI International Tax Counsel</h2>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 rounded border border-red-200 uppercase">
                Grounded in Chapter X &amp; OECD 2022
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Direct legal inquiry for cross-border withholding, PE risk, and arm&apos;s length pricing
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Advisor Ready</span>
        </div>
      </div>

      {/* Chat Container (White/Slate Container) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[540px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/70">
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isBot ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-red-600 text-white shadow-xs'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                    isBot 
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-xs font-sans' 
                      : 'bg-red-600 text-white font-medium shadow-xs'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`text-[10px] text-slate-400 ${isBot ? 'text-left' : 'text-right'} px-1`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-xs text-slate-600">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-600" />
                <span>Evaluating tax statutes and precedents...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(q);
              }}
              className="text-[11px] px-3 py-1 rounded-full bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything on DTAA, Service PE, Form 10F, or Chapter X Transfer Pricing..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 disabled:opacity-40 cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Consult</span>
          </button>
        </form>
      </div>
    </div>
  );
};
