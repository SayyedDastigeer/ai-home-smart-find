import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
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
  MapPin, Bed, Bath, Square, ChevronLeft, Heart, 
  Share2, Check, Sparkles, Loader2, Calendar, 
  ArrowRight, ShieldCheck, Globe, Star, MessageSquare, Send
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Persistence States
  const [isSaved, setIsSaved] = useState(false); // 🔹 This handles the heart color
  const [tourDate, setTourDate] = useState<Date | undefined>(new Date());
  const [inquiryMessage, setInquiryMessage] = useState("I am interested in this exclusive listing.");
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        // 1. Fetch Property Info
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data);

        // 2. 🔹 CRITICAL FIX: Check if property is saved by user on load
        if (token) {
          const savedRes = await axios.get(
            "http://localhost:5000/api/properties/saved-properties",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Check if this property ID exists in the user's saved list
          const alreadySaved = savedRes.data.some((p: any) => p._id === id);
          setIsSaved(alreadySaved);
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
    if (!token) {
      toast.error("Please login to save properties");
      return navigate("/auth");
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/properties/save-property/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSaved(res.data.saved); // Update state based on backend response
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Could not update wishlist");
    }
  };

  const handlePrivateInquiry = async (isTour: boolean = false) => {
    if (!token) {
      toast.error("Please login to contact the owner");
      return navigate("/auth");
    }

    setProcessing(true);
    try {
      const finalMessage = isTour 
        ? `Requesting a tour for: ${tourDate ? format(tourDate, "PPP") : "Not specified"}. ${inquiryMessage}`
        : inquiryMessage;

      await axios.post(
        `http://localhost:5000/api/inquiries`,
        {
          propertyId: id,
          ownerId: property.owner._id || property.owner,
          message: finalMessage,
          buyerPhone: user.phone || "Not provided",
          buyerEmail: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Message sent! Taking you to your Inbox...");
      setIsInquiryOpen(false);
      setTimeout(() => navigate("/inbox"), 1500); 
    } catch (err) {
      toast.error("Failed to send inquiry");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white italic text-primary">
        Luxe Real Estate
    </div>
  );

  const images = property.images?.length > 0 ? property.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      {/* --- LUXE HERO SECTION --- */}
      <section className="relative h-[85vh] overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <img src={images[0]} className="w-full h-full object-cover" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </motion.div>

        {/* 🔹 FIXED HEART BUTTON IN HERO */}
        <div className="absolute top-10 right-10 z-20 flex gap-4">
          <Button 
            variant="outline" 
            className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-slate-900"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleToggleSave}
            variant="outline" 
            className={`rounded-full backdrop-blur-md border-white/20 transition-all ${
                isSaved ? "bg-red-500 text-white border-red-500" : "bg-white/10 text-white hover:bg-white hover:text-red-500"
            }`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end pb-16">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
              <Badge className="mb-4 bg-white/20 backdrop-blur-md text-white border-none px-4 py-1">
                <Star className="h-3 w-3 mr-2 fill-yellow-400 text-yellow-400" /> Exclusive Listing
              </Badge>
              <h1 className="text-5xl md:text-7xl font-serif text-white mb-4 leading-tight">{property.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-lg">
                <span className="flex items-center gap-2"><MapPin className="h-5 w-5" /> {property.location}</span>
                <span className="flex items-center gap-2"><Square className="h-5 w-5" /> {property.area} sq.ft</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16">
             {/* ... Stats and Description logic ... */}
             <div className="flex justify-between items-center py-8 border-y border-slate-200">
               <DetailItem label="Bedrooms" value={property.bedrooms} />
               <DetailItem label="Bathrooms" value={property.bathrooms} />
               <DetailItem label="Type" value={property.homeType} />
             </div>
             <p className="text-xl font-light leading-relaxed">{property.description}</p>
          </div>

          {/* Right Column: Floating Luxury Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl">
                <div className="mb-8">
                  <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Asking Price</p>
                  <div className="text-5xl font-serif text-primary">₹{property.price.toLocaleString()}</div>
                </div>

                <div className="space-y-4">
                  <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full h-16 text-lg font-medium rounded-xl bg-slate-900 text-white">
                        Inquire Privately
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">Direct Inquiry</DialogTitle>
                      </DialogHeader>
                      <textarea 
                        className="w-full h-32 p-4 rounded-2xl border bg-slate-50 outline-none focus:border-primary"
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                      />
                      <Button onClick={() => handlePrivateInquiry(false)} disabled={processing} className="w-full h-12">
                        {processing ? <Loader2 className="animate-spin" /> : "Send Message & Go to Inbox"}
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-16 text-lg font-medium rounded-xl border-slate-200">
                        <Calendar className="mr-2 h-5 w-5" /> Reserve a Tour
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-2xl text-center">Schedule Viewing</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center gap-4">
                        <CalendarPicker mode="single" selected={tourDate} onSelect={setTourDate} disabled={(date) => date < new Date()} />
                        <Button onClick={() => handlePrivateInquiry(true)} disabled={!tourDate || processing} className="w-full h-12">
                          Confirm Reservation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string, value: any }) => (
  <div className="text-center md:text-left">
    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">{label}</p>
    <p className="text-xl font-serif text-slate-800">{value}</p>
  </div>
);

export default PropertyDetails;