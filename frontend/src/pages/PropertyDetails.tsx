import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight,
  Heart, Phone, MessageCircle, Sparkles, Loader2,
  Settings, Edit3, Trash2, Calendar, Power
} from "lucide-react";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [img, setImg] = useState(0);

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
      toast.error("Failed to load details");
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
      return navigate("/login");
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

  const handleAction = async (actionType: "buy" | "rent") => {
    if (!token) {
      toast.error("Please login first");
      return navigate("/login");
    }
    try {
      setProcessing(true);
      const res = await axios.post(`http://localhost:5000/api/properties/${actionType}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      fetchPropertyData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  // MANAGEMENT TOOL: Delete/Deactivate Property
  const handleDeleteProperty = async () => {
    if (!window.confirm("Are you sure you want to deactivate this listing? It will be permanently removed.")) return;
    
    try {
      setProcessing(true);
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Listing deactivated successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to deactivate listing");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;

  const isOwner = property.owner === currentUserId;
  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];

  return (
    <div className="bg-muted/30 min-h-screen">
      <Navbar />
      <main className="container py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="relative rounded-xl overflow-hidden bg-black shadow-lg">
            <img src={images[img]} className="w-full h-[450px] object-cover" alt="Property" />
            {images.length > 1 && (
              <>
                <button onClick={() => setImg(i => (i > 0 ? i - 1 : images.length - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"><ChevronLeft /></button>
                <button onClick={() => setImg(i => (i < images.length - 1 ? i + 1 : 0))} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition"><ChevronRight /></button>
              </>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground"><MapPin className="h-4 w-4 mr-1" />{property.location}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 border rounded-xl p-6 bg-background shadow-sm">
            <Feature icon={Bed} label="Bedrooms" value={property.bedrooms} />
            <Feature icon={Bath} label="Bathrooms" value={property.bathrooms} />
            <Feature icon={Square} label="Area" value={`${property.area} sqft`} />
          </div>

          <Card><CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">About this property</h2>
            <p className="text-muted-foreground leading-relaxed">{property.description || "No description provided."}</p>
          </CardContent></Card>
        </div>

        {/* Action Sidebar */}
        <div className="sticky top-24 h-fit space-y-4">
          <Card className={isOwner ? "border-blue-500 shadow-md ring-1 ring-blue-100" : "shadow-md"}>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-primary">₹{property.price.toLocaleString()}</div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${property.status === 'available' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {property.status}
                </span>
              </div>

              {isOwner ? (
                /* OWNER VIEW: MANAGEMENT TOOLS */
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold mb-2">
                    <Settings className="h-4 w-4 animate-spin-slow" /> Management Mode
                  </div>
                  
                  <Button 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                    onClick={() => navigate(`/edit-property/${id}`)}
                  >
                    <Edit3 className="h-4 w-4" /> Edit Listing
                  </Button>

                  <Button variant="outline" className="w-full h-11 flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" /> Manage Availability
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center justify-center gap-2"
                    onClick={handleDeleteProperty}
                    disabled={processing}
                  >
                    {processing ? <Loader2 className="animate-spin h-4 w-4" /> : <Power className="h-4 w-4" />}
                    Deactivate Listing
                  </Button>
                </div>
              ) : (
                /* VISITOR VIEW: Standard Actions */
                <div className="space-y-3 pt-2">
                  {property.status === "available" ? (
                    <Button 
                      className="w-full h-12 text-lg font-bold shadow-sm" 
                      disabled={processing} 
                      onClick={() => handleAction(property.type === "sell" ? "buy" : "rent")}
                    >
                      {processing ? <Loader2 className="animate-spin" /> : (property.type === "sell" ? "Buy Now" : "Rent Now")}
                    </Button>
                  ) : (
                    <Button className="w-full h-12 text-lg" variant="secondary" disabled>Property {property.status}</Button>
                  )}
                  
                  <Button 
                    variant={isSaved ? "secondary" : "ghost"} 
                    className={`w-full h-11 transition-all ${isSaved ? "text-red-600 bg-red-50 hover:bg-red-100" : "text-muted-foreground"}`}
                    onClick={handleToggleSave}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} /> 
                    {isSaved ? "Saved to Wishlist" : "Save Property"}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-11"><MessageCircle className="h-4 w-4 mr-2" /> Chat</Button>
                    <Button variant="outline" className="h-11"><Phone className="h-4 w-4 mr-2" /> Call</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* AI Insight Card */}
          {!isOwner && (
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardContent className="p-4 flex gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  This property is in high demand. Properties in <span className="font-semibold">{property.location}</span> usually sell within 15 days.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Feature = ({ icon: Icon, label, value }: any) => (
  <div className="flex flex-col items-center text-center p-2">
    <Icon className="h-6 w-6 text-primary mb-2" />
    <div className="font-bold text-lg">{value}</div>
    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</div>
  </div>
);

export default PropertyDetails;