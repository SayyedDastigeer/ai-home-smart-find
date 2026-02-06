import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin, Bed, Bath, Square, Heart, 
  Share2, Sparkles, Loader2, Calendar, 
  ShieldCheck, Globe, Info, ChevronLeft, Maximize2
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [tourDate, setTourDate] = useState<Date | undefined>(new Date());
  const [inquiryMessage, setInquiryMessage] = useState("I am interested in this listing.");
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data);
        if (token) {
          const savedRes = await axios.get("http://localhost:5000/api/properties/saved-properties", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsSaved(savedRes.data.some((p: any) => p._id === id));
        }
      } catch (err) {
        toast.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyData();
  }, [id, token]);

  const handleToggleSave = async () => {
    if (!token) return navigate("/auth");
    try {
      const res = await axios.post(`http://localhost:5000/api/properties/save-property/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(res.data.saved);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handlePrivateInquiry = async (isTour: boolean = false) => {
    if (!token) return navigate("/auth");
    setProcessing(true);
    try {
      const finalMessage = isTour ? `Tour Request: ${tourDate ? format(tourDate, "PPP") : "TBD"}. ${inquiryMessage}` : inquiryMessage;
      await axios.post(`http://localhost:5000/api/inquiries`, {
        propertyId: id,
        ownerId: property.owner._id || property.owner,
        message: finalMessage,
        buyerPhone: user.phone || "Not provided",
        buyerEmail: user.email,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Inquiry sent successfully.");
      setIsInquiryOpen(false);
      navigate("/inbox");
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#29A397] mb-2" />
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Syncing Property Data</span>
    </div>
  );

  const images = property.images?.length > 0 ? property.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-slate-50 font-bold px-0 text-slate-500 text-xs">
            <ChevronLeft className="h-4 w-4 mr-1" /> BACK TO SEARCH
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-slate-200"><Share2 className="h-4 w-4 text-slate-600" /></Button>
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-full h-9 w-9 border-slate-200 transition-all ${isSaved ? "bg-red-50 text-red-500 border-red-100 shadow-sm" : ""}`} 
              onClick={handleToggleSave}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <section className="mb-10">
            <div className="relative aspect-video max-h-[550px] w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                <img src={images[0]} className="w-full h-full object-cover" alt="Property" />
                <div className="absolute bottom-4 right-4">
                    <Badge className="bg-white/95 backdrop-blur-sm text-slate-800 border-none px-4 py-2 rounded-lg shadow-sm font-bold tracking-tight text-[11px] cursor-pointer hover:bg-white transition-all">
                        <Maximize2 className="h-3.5 w-3.5 mr-2 text-[#29A397]" /> VIEW GALLERY
                    </Badge>
                </div>
                <div className="absolute top-4 left-4">
                    <Badge className="bg-[#29A397] text-white border-none px-3 py-1 rounded-md font-bold tracking-wider text-[9px] uppercase">
                        <Sparkles className="h-3 w-3 mr-1.5" /> Featured Listing
                    </Badge>
                </div>
            </div>
        </section>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Details */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <MapPin className="h-4 w-4 text-[#29A397]" /> {property.location}
              </div>
            </div>

            {/* Quick Summary Row */}
            <div className="flex flex-wrap gap-10 py-6 border-y border-slate-100 mb-10">
              <PropertyStat icon={Bed} label="BEDS" value={property.bedrooms} />
              <PropertyStat icon={Bath} label="BATHS" value={property.bathrooms} />
              <PropertyStat icon={Square} label="AREA" value={`${property.area} Sq.ft`} />
            </div>

            {/* Description Area */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-[#29A397]">
                <Info className="h-4 w-4" />
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">About this property</h2>
              </div>
              <p className="text-base leading-relaxed text-slate-600 font-medium max-w-3xl">
                {property.description}
              </p>
            </section>
          </div>

          {/* Sticky Conversion Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="p-8 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="mb-8">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">ASKING PRICE</span>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight mt-1">₹{property.price.toLocaleString()}</div>
                </div>

                <div className="space-y-3">
                  <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full h-12 bg-[#29A397] hover:bg-[#21857b] font-bold text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-[#29A397]/20 transition-all active:scale-95">
                        SEND INQUIRY
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl p-8 border-none">
                      <DialogHeader><DialogTitle className="font-bold text-lg">Inquiry for {property.title}</DialogTitle></DialogHeader>
                      <textarea 
                        className="w-full h-32 p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-1 ring-[#29A397]/40 font-medium text-sm text-slate-700" 
                        value={inquiryMessage} 
                        onChange={(e) => setInquiryMessage(e.target.value)} 
                      />
                      <Button onClick={() => handlePrivateInquiry(false)} disabled={processing} className="w-full h-12 bg-[#29A397] font-bold text-xs uppercase tracking-widest rounded-xl mt-4">SEND MESSAGE</Button>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-12 font-bold text-[11px] uppercase tracking-widest border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                        <Calendar className="mr-2 h-4 w-4 text-[#29A397]" /> REQUEST TOUR
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl p-6 flex flex-col items-center border-none">
                      <DialogHeader><DialogTitle className="font-bold text-lg mb-4">Select Viewing Date</DialogTitle></DialogHeader>
                      <CalendarPicker mode="single" selected={tourDate} onSelect={setTourDate} disabled={(date) => date < new Date()} className="rounded-xl border-none shadow-sm bg-slate-50" />
                      <Button onClick={() => handlePrivateInquiry(true)} disabled={!tourDate || processing} className="w-full h-12 bg-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl mt-6">CONFIRM DATE</Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#29A397]" /> VERIFIED OWNERSHIP
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Globe className="h-3.5 w-3.5 text-[#29A397]" /> DIRECT CONNECTION
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Internal Stat Item
const PropertyStat = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-[#29A397]/5 flex items-center justify-center text-[#29A397]">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 block mb-0.5">{label}</span>
            <div className="text-xl font-bold text-slate-900 tracking-tight">{value}</div>
        </div>
    </div>
);

export default PropertyDetails;