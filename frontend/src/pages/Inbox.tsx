import { useEffect, useState, useRef, useMemo } from "react"; // Added useMemo for performance
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, MessageSquareOff, Search, Home, ChevronRight, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const socket = io("http://localhost:5000");

const Inbox = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 State for search input
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || user._id;

  // 🔹 FILTER LOGIC: Updates automatically when searchTerm or chats change
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const isOwner = currentUserId === chat.owner?._id;
      const partnerName = (isOwner ? chat.buyer?.name : chat.owner?.name) || "";
      const propertyTitle = chat.property?.title || "";
      
      return (
        partnerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, chats, currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  const fetchInbox = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inquiries/inbox", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
      if (res.data.length > 0 && !selectedChat) setSelectedChat(res.data[0]);
    } catch (err) {
      toast.error("Failed to load inbox");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) socket.emit("join_room", currentUserId);
    socket.on("receive_message", (data) => {
      fetchInbox(); 
      setSelectedChat((prev: any) => {
        if (prev && prev._id === data.inquiryId) {
          return { ...prev, messages: [...prev.messages, data.message] };
        }
        return prev;
      });
    });
    return () => { socket.off("receive_message"); };
  }, [currentUserId, selectedChat]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/inquiries/reply/${selectedChat._id}`, 
        { text: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(res.data);
      setReply("");
      fetchInbox();
    } catch (err) {
      toast.error("Message failed to send");
    }
  };

  useEffect(() => { fetchInbox(); }, []);

  const formatMsgTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
      <Navbar />
      
      <main className="flex-1 flex container mx-auto py-6 overflow-hidden h-[calc(100vh-80px)]">
        <div className="flex w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* COLUMN 1: CONVERSATIONS */}
          <div className="w-1/3 border-r border-slate-50 flex flex-col bg-white">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Messages</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                {/* 🔹 INPUT BINDING */}
                <Input 
                  placeholder="Search name or property..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-10 bg-slate-50 border-none rounded-2xl h-12 focus-visible:ring-1 focus-visible:ring-primary/20" 
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {/* 🔹 MAP OVER FILTERED LIST INSTEAD OF ORIGINAL */}
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => {
                  if (!chat?.owner || !chat?.buyer) return null;
                  const isOwner = currentUserId === chat.owner?._id;
                  const partner = isOwner ? chat.buyer : chat.owner;
                  const isActive = selectedChat?._id === chat._id;

                  return (
                    <div 
                      key={chat._id} 
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 cursor-pointer rounded-2xl transition-all duration-300 flex items-center gap-4 ${
                        isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                      }`}>
                        {partner.name?.[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-sm font-bold truncate">{partner.name}</span>
                          {isActive && <Clock className="h-3 w-3 text-white/60" />}
                        </div>
                        <p className={`text-[11px] truncate font-medium ${isActive ? 'text-white/70' : 'text-slate-500'}`}>
                          {chat.property?.title}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-slate-400 font-medium">No results found for "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: ACTIVE CHAT */}
          <div className="flex-1 flex flex-col bg-[#FCFCFD]">
            {selectedChat ? (
              <>
                <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedChat.property?.title}</h3>
                      <p className="text-[11px] text-primary font-bold">Inquiry Discussion</p>
                    </div>
                  </div>
                  <Link to={`/property/${selectedChat.property?._id}`}>
                    <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                      View Listing <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>

                <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6">
                  {selectedChat.messages.map((m: any, i: number) => {
                    const isMe = m.sender === currentUserId;
                    return (
                      <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] px-5 py-3.5 rounded-3xl text-[14px] leading-relaxed font-medium shadow-sm transition-all ${
                          isMe 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 mt-1.5 px-2 uppercase tracking-tighter">
                          {formatMsgTime(m.timestamp || m.createdAt || new Date().toISOString())}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-8 bg-white border-t border-slate-50">
                  <form onSubmit={handleReply} className="relative flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-primary/40 transition-all">
                    <Input 
                      placeholder="Type your reply..." 
                      value={reply} 
                      onChange={(e) => setReply(e.target.value)}
                      className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 text-sm font-medium"
                    />
                    <Button 
                      type="submit" 
                      className="h-12 w-12 rounded-xl bg-primary hover:opacity-90 text-white shadow-lg shadow-primary/20 transition-all"
                      disabled={!reply.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="h-24 w-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mb-6 border border-slate-50">
                  <MessageSquareOff className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Select a Discussion</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Pick a conversation from the left to start.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Inbox;