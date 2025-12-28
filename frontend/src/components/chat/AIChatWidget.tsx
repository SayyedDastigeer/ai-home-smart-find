import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Is this house overpriced?",
  "Which area is better for rent?",
  "Should I buy or rent?",
  "What's the rental yield here?",
];

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI real estate assistant. Ask me anything about properties, pricing, or market trends!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("overpriced")) {
      return "Based on our AI analysis, properties in this area are typically priced 5-8% above market value. I'd recommend negotiating or looking at nearby neighborhoods for better deals.";
    }
    if (lowerQuery.includes("rent") && lowerQuery.includes("buy")) {
      return "Given current market conditions with high interest rates, renting might be more economical in the short term. However, if you plan to stay 5+ years, buying could build equity and hedge against rent increases.";
    }
    if (lowerQuery.includes("yield")) {
      return "The average rental yield in this area is around 4.2%. Properties near transit hubs typically see 0.5-1% higher yields due to strong tenant demand.";
    }
    return "That's a great question! I can help you analyze property prices, compare neighborhoods, and find the best investment opportunities. Could you share more details about what you're looking for?";
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] flex flex-col shadow-2xl animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">AI Assistant</div>
                <div className="text-xs text-primary-foreground/70">Always here to help</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 hover:bg-primary-foreground/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "assistant"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm max-w-[250px]",
                    message.role === "assistant"
                      ? "bg-muted text-foreground rounded-tl-sm"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div className="px-4 pb-3">
              <div className="text-xs text-muted-foreground mb-2">Suggested questions:</div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 2).map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about properties..."
                className="flex-1 h-10 px-4 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={handleSend}
                disabled={!input.trim()}
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
