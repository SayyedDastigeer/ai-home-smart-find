import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Find me a luxury villa in Mumbai",
  "Which area has the best ROI?",
  "Should I buy or rent in 2026?",
  "Is this property overpriced?",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI real estate consultant. Tell me about your dream home or ask about market trends!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 🔹 Real API Call to your OpenAI Backend
      const res = await axios.post("http://localhost:5000/api/chat/ask-ai", { 
        userMessage: textToSend 
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.reply,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { id: "err", role: "assistant", content: "I'm having trouble connecting to the database. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border-none rounded-[2rem]">
          {/* Luxe Header */}
          <div className="flex items-center justify-between p-5 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight">AI Consultant</div>
                <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live Market Data
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
                  message.role === "assistant" ? "bg-white text-primary" : "bg-primary text-white"
                )}>
                  {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "rounded-2xl px-4 py-3 text-sm max-w-[260px] shadow-sm leading-relaxed",
                  message.role === "assistant" 
                    ? "bg-white text-slate-700 rounded-tl-none border border-slate-100" 
                    : "bg-primary text-white rounded-tr-none"
                )}>
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Analyzing Listings...
                </div>
              </div>
            )}
          </div>

          {/* Suggested Actions */}
          {messages.length < 3 && !loading && (
            <div className="px-5 pb-4 bg-slate-50">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSend(question)}
                    className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Luxe Input Field */}
          <div className="p-5 bg-white border-t border-slate-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Find a home..."
                className="flex-1 h-12 px-5 rounded-2xl border-none bg-slate-100 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              />
              <Button
                size="icon"
                className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/20"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}