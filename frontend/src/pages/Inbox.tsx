import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Loader2,
  MessageSquareOff,
  Search,
  Home,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
      const partnerName =
        (isOwner ? chat.buyer?.name : chat.owner?.name) || "";
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
      const res = await axios.get(
        "http://localhost:5000/api/inquiries/inbox",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setChats(res.data);
      if (res.data.length > 0 && !selectedChat)
        setSelectedChat(res.data[0]);
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
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
      <Navbar />

      {/* ✅ ONLY ADDITION: PageTransition */}
      <PageTransition>
        <main className="flex-1 flex container mx-auto py-6 overflow-hidden h-[calc(100vh-80px)]">
          <div className="flex w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
            {/* COLUMN 1 */}
            <div className="w-1/3 border-r border-slate-50 flex flex-col bg-white">
              <div className="p-8 border-b border-slate-50">
                <h2 className="text-2xl font-black text-slate-900 mb-6">
                  Messages
                </h2>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search name or property..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-10 bg-slate-50 border-none rounded-2xl h-12"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredChats.map((chat) => {
                  const isOwner = currentUserId === chat.owner?._id;
                  const partner = isOwner ? chat.buyer : chat.owner;
                  const isActive = selectedChat?._id === chat._id;

                  return (
                    <div
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 cursor-pointer rounded-2xl flex items-center gap-4 transition-all ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary/10 font-bold">
                        {partner.name?.[0]}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold">
                          {partner.name}
                        </span>
                        <p className="text-xs truncate">
                          {chat.property?.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-6 border-b bg-white flex justify-between">
                    <h3 className="font-bold">
                      {selectedChat.property?.title}
                    </h3>
                    <Link to={`/property/${selectedChat.property?._id}`}>
                      <Button size="sm" variant="ghost">
                        View Listing
                      </Button>
                    </Link>
                  </div>

                  <div
                    ref={scrollRef}
                    className="flex-1 p-8 overflow-y-auto"
                  >
                    {selectedChat.messages.map((m: any, i: number) => (
                      <div key={i} className="mb-4">
                        <div>{m.text}</div>
                        <span className="text-xs text-slate-400">
                          {formatMsgTime(m.timestamp || m.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-t bg-white">
                    <form
                      onSubmit={handleReply}
                      className="flex items-center gap-3"
                    >
                      <Input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Type your reply..."
                      />
                      <Button type="submit" disabled={!reply.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <MessageSquareOff className="h-12 w-12 text-slate-300" />
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
