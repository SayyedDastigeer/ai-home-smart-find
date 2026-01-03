import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Heart, Scale, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner for notifications

const SavedProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchSavedProperties = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/properties/saved-properties",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load saved properties", err);
    } finally {
      setLoading(false);
    }
  };

  // Improved Unsave Logic
  const handleToggleSave = async (propertyId: string, newState: boolean) => {
    if (!token) return;

    // If newState is false, it means the user clicked to "Unsave"
    if (!newState) {
      try {
        await axios.post(
          `http://localhost:5000/api/properties/save-property/${propertyId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Remove from UI only after successful backend response
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
        toast.success("Property removed from saved list");
      } catch (err) {
        console.error("Failed to unsave", err);
        toast.error("Failed to unsave property. Please try again.");
      }
    }
  };

  // Improved Clear All Logic using the DELETE endpoint
  const handleClearAll = async () => {
    if (!token || properties.length === 0) return;
    
    if (!window.confirm("Are you sure you want to clear all saved properties?")) return;

    try {
      await axios.delete(
        "http://localhost:5000/api/properties/clear-saved",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setProperties([]);
      toast.success("All saved properties cleared");
    } catch (err) {
      console.error("Failed to clear all", err);
      toast.error("Failed to clear list");
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-destructive fill-destructive" />
              Saved Properties
            </h1>
            <p className="text-muted-foreground">{properties.length} properties saved</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl">
            <p className="text-muted-foreground text-lg">You haven't saved any properties yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                initiallySaved={true}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SavedProperties;