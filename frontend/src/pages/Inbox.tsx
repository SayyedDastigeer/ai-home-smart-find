import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client"; //
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Loader2, MessageSquareOff } from "lucide-react";
import { toast } from "sonner";

// Initialize socket outside component to prevent multiple connections
const socket = io("http://localhost:5000");

const Inbox = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || user._id;

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

  // Socket Logic
  useEffect(() => {
    if (currentUserId) {
      socket.emit("join_room", currentUserId);
    }

    socket.on("receive_message", (data) => {
      // Refresh the list to show newest messages at top
      fetchInbox(); 

      // If the incoming message belongs to the current open chat, update UI instantly
      setSelectedChat((prev: any) => {
        if (prev && prev._id === data.inquiryId) {
          return {
            ...prev,
            messages: [...prev.messages, data.message]
          };
        }
        return prev;
      });
      
      toast.info("New message received!");
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId, selectedChat]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedChat) return;

    try {
      const res = await axios.post(`http://localhost:5000/api/inquiries/reply/${selectedChat._id}`, 
        { text: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the open chat with the new message thread returned from server
      setSelectedChat(res.data);
      setReply("");
      fetchInbox();
    } catch (err) {
      toast.error("Message failed to send");
    }
  };

  useEffect(() => { fetchInbox(); }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Chat List */}
        <div className="w-80 border-r overflow-y-auto bg-slate-50">
          <div className="p-4 border-b bg-white font-bold">Messages</div>
          {chats.map((chat) => {
            // Safety Guard: Prevent crash if owner/buyer data is missing
            if (!chat?.owner || !chat?.buyer) return null;

            const isOwner = currentUserId === chat.owner?._id;
            const partnerName = isOwner ? chat.buyer?.name : chat.owner?.name;

            return (
              <div 
                key={chat._id} 
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer border-b transition-colors ${selectedChat?._id === chat._id ? 'bg-primary/10 border-r-4 border-r-primary' : 'hover:bg-slate-100'}`}
              >
                <h4 className="font-bold truncate">{chat.property?.title || "Unknown Property"}</h4>
                <p className="text-xs text-muted-foreground">With: {partnerName || "User"}</p>
              </div>
            );
          })}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Safety Check: Ensure selectedChat and its users exist before rendering */}
          {selectedChat?.owner && selectedChat?.buyer ? (
            <>
              <div className="p-4 border-b flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center"><User className="h-5 w-5 text-slate-500" /></div>
                  <div>
                    <h3 className="font-bold">{selectedChat.property?.title}</h3>
                    <p className="text-xs text-primary font-semibold">₹{selectedChat.property?.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
                {selectedChat.messages.map((m: any, i: number) => (
                  <div key={i} className={`flex ${m.sender === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${m.sender === currentUserId ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReply} className="p-4 border-t bg-white flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={reply} 
                  onChange={(e) => setReply(e.target.value)}
                  className="rounded-full bg-slate-50 border-none focus-visible:ring-1"
                />
                <Button type="submit" size="icon" className="rounded-full h-10 w-10 shrink-0 shadow-md">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-slate-50">
              <MessageSquareOff className="h-16 w-16 mb-4 opacity-10" />
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Inbox;