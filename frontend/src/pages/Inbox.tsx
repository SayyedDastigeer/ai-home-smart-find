import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  Loader2,
  Inbox as InboxIcon
} from "lucide-react";
import { toast } from "sonner";

const Inbox = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchInbox = async () => {
    try {
      // Fetch inquiries sent to the logged-in owner
      const res = await axios.get("http://localhost:5000/api/inquiries/inbox", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInquiries(res.data);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Inquiry Inbox</h1>
            <p className="text-muted-foreground">Manage leads and potential buyers for your listings</p>
          </div>
        </div>

        {inquiries.length > 0 ? (
          <div className="grid gap-6">
            {inquiries.map((inquiry) => (
              <Card key={inquiry._id} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Summary Sidebar */}
                    <div className="bg-muted/30 p-6 md:w-72 border-r border-border/50">
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Building2 className="h-3 w-3" /> Property
                      </div>
                      <h3 className="font-bold text-lg mb-1">{inquiry.property?.title}</h3>
                      <p className="text-primary font-bold">₹{inquiry.property?.price.toLocaleString()}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Buyer Message and Contact Info */}
                    <div className="flex-1 p-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{inquiry.buyer?.name}</h4>
                            <Badge variant="outline" className="text-[10px] uppercase">{inquiry.status}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <a href={`mailto:${inquiry.buyerEmail}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <Mail className="h-4 w-4" /> {inquiry.buyerEmail}
                          </a>
                          <a href={`tel:${inquiry.buyerPhone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:underline">
                            <Phone className="h-4 w-4" /> {inquiry.buyerPhone}
                          </a>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-slate-700 italic">"{inquiry.message}"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed">
            <InboxIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h2 className="text-xl font-semibold">Your inbox is empty</h2>
            <p className="text-muted-foreground">Inquiries from potential buyers will appear here.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Inbox;