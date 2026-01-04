import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight,
  Heart, Phone, MessageCircle, Sparkles, Loader2,
  Settings, Edit3, Trash2, Info, Share2, Check, MessageSquare
} from "lucide-react";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("I am interested in this property. Please contact me.");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || user._id;

  const fetchPropertyData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
      setProperty(res.data);

      if (token) {
        const savedRes = await axios.get("http://localhost:5000/api/properties/saved-properties", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const isAlreadySaved = savedRes.data.some((p: any) => p._id === id);
        setIsSaved(isAlreadySaved);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

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
      setIsSaved(res.data.saved);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Could not update wishlist");
    }
  };

  const handleInquiry = async () => {
    if (!token) {
      toast.error("Please login to contact the seller");
      return navigate("/auth");
    }
    try {
      setProcessing(true);
      await axios.post(`http://localhost:5000/api/inquiries`, {
        propertyId: id,
        ownerId: property.owner._id || property.owner,
        message: customMessage,
        buyerPhone: user.phone || "Not provided",
        buyerEmail: user.email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Message sent! You can continue in your Inbox.");
      setCustomMessage("");
      setIsDialogOpen(false); // Close modal on success
    } catch (err) {
      toast.error("Failed to send inquiry");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!window.confirm("Permanently remove this listing?")) return;
    try {
      setProcessing(true);
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Listing removed");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!property) return <div className="text-center py-20">Property not found</div>;

  const isOwner = (property.owner._id || property.owner) === currentUserId;
  const images = property.images?.length > 0 ? property.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB] dark:bg-background">
      <Navbar />
      
      <main className="flex-1 pb-12">
        <div className="bg-white dark:bg-card border-b">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/search" className="hover:text-primary transition-colors">Search</Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{property.title}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
              <Button variant={isSaved ? "secondary" : "outline"} size="sm" className={`rounded-full ${isSaved ? "text-red-500" : ""}`} onClick={handleToggleSave}>
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} /> {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        <div className="container mt-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Image Carousel */}
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl group bg-black">
                <img src={images[currentImage]} alt={property.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage((p) => (p > 0 ? p - 1 : images.length - 1))} className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"><ChevronLeft /></button>
                    <button onClick={() => setCurrentImage((p) => (p < images.length - 1 ? p + 1 : 0))} className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"><ChevronRight /></button>
                  </>
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    <Sparkles className="h-4 w-4 mr-2" /> AI Verified Listing
                  </Badge>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-white dark:bg-card p-8 rounded-3xl shadow-sm border border-border/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-lg"><MapPin className="h-5 w-5 text-primary" />{property.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-primary">₹{property.price.toLocaleString()}</div>
                    <Badge variant="outline" className="mt-2 uppercase tracking-widest">{property.type}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60">
                  <StatItem icon={Bed} label="Bedrooms" value={property.bedrooms} />
                  <StatItem icon={Bath} label="Bathrooms" value={property.bathrooms} />
                  <StatItem icon={Square} label="Sqft Area" value={property.area} />
                </div>
              </div>

              <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white dark:bg-card pb-2"><CardTitle className="text-xl font-bold flex items-center gap-2"><Info className="h-5 w-5 text-primary" /> About this property</CardTitle></CardHeader>
                <CardContent className="bg-white dark:bg-card">
                  <p className="text-muted-foreground leading-relaxed text-lg">{property.description || "No description provided."}</p>
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t">
                    {(property.amenities || []).map((item: string) => (
                      <div key={item} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/40"><Check className="h-4 w-4 text-green-500" /><span className="text-sm font-medium">{item}</span></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Management / Action Card */}
              <Card className={`rounded-3xl shadow-xl overflow-hidden sticky top-24 ${isOwner ? 'border-primary/40 ring-1 ring-primary/10' : 'border-none'}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Listing Status</span>
                    <Badge className={property.status === 'available' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700'}>{property.status}</Badge>
                  </div>

                  {isOwner ? (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2"><Settings className="h-4 w-4" /> Management Console</div>
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2" onClick={() => navigate(`/edit-property/${id}`)}><Edit3 className="h-4 w-4" /> Edit Listing</Button>
                      <Button variant="outline" className="w-full h-12 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center justify-center gap-2" onClick={handleDeleteProperty} disabled={processing}>
                        {processing ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />} Deactivate Listing
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {/* POPUP CONTACT DIALOG */}
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 rounded-2xl" disabled={property.status !== 'available'}>
                            <MessageCircle className="h-5 w-5 mr-2" />
                            {property.status === 'available' ? 'Contact Seller' : 'Listing Closed'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl bg-white">
                          <div className="bg-primary p-6 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-6 w-6" /> Contact Owner
                              </DialogTitle>
                            </DialogHeader>
                          </div>
                          <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {property.owner?.name?.[0] || "O"}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{property.owner?.name || "Property Owner"}</p>
                                <p className="text-sm text-muted-foreground">Typically responds in ~2 hours</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Message</label>
                              <textarea 
                                className="w-full p-4 text-sm border-2 border-slate-100 rounded-2xl bg-slate-50 outline-none focus:border-primary min-h-[120px] resize-none"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                              />
                            </div>
                            <Button className="w-full h-14 text-lg font-bold rounded-2xl" onClick={handleInquiry} disabled={processing}>
                              {processing ? <Loader2 className="animate-spin" /> : "Send Message"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {/* Display owner's stored phone number */}
                        <a href={`tel:${property.owner?.phone}`} className="w-full">
                          <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200">
                            <Phone className="h-4 w-4 mr-2" /> Call Agent
                          </Button>
                        </a>
                        <Button variant="outline" className="h-12 rounded-xl border-slate-200"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {!isOwner && (
                <Card className="rounded-3xl border-primary/20 bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold"><Sparkles className="h-5 w-5" /> AI Market Intelligence</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Market insight for <span className="font-bold">{property.location}</span> shows high demand. Listings here usually close within 7-10 days.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

const StatItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex flex-col items-center p-4 rounded-2xl bg-muted/30">
    <Icon className="h-6 w-6 text-primary mb-2" />
    <span className="text-xl font-bold">{value}</span>
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
  </div>
);

export default PropertyDetails;