import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, MessageSquareOff, Search, X } from "lucide-react";
import { toast } from "sonner";

const socket = io("http://localhost:5000");

const Inbox = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || user._id;

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
    } catch {
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

    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId, selectedChat]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/inquiries/reply/${selectedChat._id}`,
        { text: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(res.data);
      setReply("");
      fetchInbox();
    } catch {
      toast.error("Message failed to send");
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const formatMsgTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin h-10 w-10 text-[#29A397]" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAFBFC] overflow-hidden selection:bg-[#29A397]/10">
      <Navbar />

      <PageTransition>
        <main className="flex-1 flex container mx-auto py-6 overflow-hidden h-[calc(100vh-80px)]">
          <div className="flex w-full bg-white rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] overflow-hidden">
            
            {/* --- ANCHOR SIDEBAR: CONVERSATION LIST --- */}
            <div className="w-full md:w-[380px] flex flex-col bg-[#F9FAFB] border-r border-slate-100">
              <div className="p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                  Messages
                </h2>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#29A397] transition-colors" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-white border-none rounded-2xl h-12 shadow-sm focus-visible:ring-[#29A397] transition-all"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                      <X className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-8">
                {filteredChats.map((chat) => {
                  const isOwner = currentUserId === chat.owner?._id;
                  const partner = isOwner ? chat.buyer : chat.owner;
                  const isActive = selectedChat?._id === chat._id;

                  return (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 cursor-pointer rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                        isActive 
                        ? "bg-[#29A397] text-white shadow-[0_10px_30px_rgba(41,163,151,0.25)] scale-[1.02]" 
                        : "bg-white hover:bg-white/50 text-slate-600 border border-transparent hover:border-slate-100"
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                        isActive ? "bg-white/20" : "bg-[#29A397]/10 text-[#29A397]"
                      }`}>
                        {partner.name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className={`text-sm font-black truncate tracking-tight ${isActive ? "text-white" : "text-slate-900"}`}>
                            {partner.name}
                          </span>
                        </div>
                        <p className={`text-xs truncate font-medium ${isActive ? "text-white/80" : "text-slate-400"}`}>
                          {chat.property?.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --- MAIN CHAT AREA: PURE WHITE --- */}
            <div className="hidden md:flex flex-1 flex flex-col bg-white">
              {selectedChat ? (
                <>
                  {/* Premium Chat Header */}
                  <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-[#29A397] border border-slate-100">
                        {(currentUserId === selectedChat.owner?._id ? selectedChat.buyer?.name : selectedChat.owner?.name)?.[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 leading-tight tracking-tight text-lg">
                          {currentUserId === selectedChat.owner?._id ? selectedChat.buyer?.name : selectedChat.owner?.name}
                        </h3>
                        <p className="text-[11px] text-[#29A397] font-black uppercase tracking-[0.1em] mt-0.5">
                          {selectedChat.property?.title}
                        </p>
                      </div>
                    </div>
                    <Link to={`/property/${selectedChat.property?._id}`}>
                      <Button variant="outline" className="rounded-xl font-bold text-xs border-slate-200 hover:bg-slate-50 transition-all">
                        View Listing
                      </Button>
                    </Link>
                  </div>

                  {/* Editorial Message Feed */}
                  <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-4 flex flex-col bg-white">
                    {selectedChat.messages.map((m: any, i: number) => {
                      const isMe = (m.senderId || m.sender) === currentUserId;
                      return (
                        <div key={i} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[70%] px-5 py-3 shadow-sm ${
                            isMe 
                            ? "bg-[#29A397] text-white rounded-[20px] rounded-br-none" 
                            : "bg-slate-50 text-slate-800 rounded-[20px] rounded-bl-none border border-slate-100"
                          }`}>
                            <p className="text-[14.5px] leading-[1.6] font-medium whitespace-pre-wrap">{m.text}</p>
                            <span className={`text-[9px] block mt-1.5 font-bold uppercase tracking-widest ${isMe ? "text-white/60" : "text-slate-400"}`}>
                              {formatMsgTime(m.timestamp || m.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Refined Input Bar */}
                  <div className="p-8 bg-white border-t border-slate-50">
                    <form onSubmit={handleReply} className="flex items-center gap-4 max-w-4xl mx-auto group">
                      <div className="relative flex-1">
                        <Input
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full bg-slate-50 border-none rounded-2xl h-14 pl-6 focus-visible:ring-[#29A397] transition-all text-[15px] font-medium"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={!reply.trim()} 
                        className="bg-[#29A397] hover:bg-[#21857b] rounded-2xl h-14 w-14 p-0 shadow-[0_10px_30px_rgba(41,163,151,0.25)] transition-all hover:scale-[1.05]"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-in fade-in duration-700">
                  <div className="p-12 rounded-[3rem] bg-slate-50 mb-6">
                    <MessageSquareOff className="h-20 w-20 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em] text-xs">Direct Messages</h3>
                  <p className="text-sm mt-3 font-medium opacity-60">Select a conversation to begin your professional inquiry.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
};

export default Inbox;