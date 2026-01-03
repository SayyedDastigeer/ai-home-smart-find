import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

export const FeaturedProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/properties");
        // Only show the first 4 available properties
        setProperties(res.data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch featured properties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // FIX: Added the missing onToggleSave handler required by PropertyCard
  const handleToggleSave = (propertyId: string, newState: boolean) => {
    console.log(`Property ${propertyId} save state changed to: ${newState}`);
    // Since this is just a showcase on the home page, we don't necessarily 
    // need to update a local list of saved IDs like we do in SearchResults.
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900">Featured Homes</h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Explore our handpicked selection of premium properties. Find your perfect match from our top-rated listings.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="hidden md:flex group border-primary text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => navigate("/search")}
          >
            View All Properties
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p) => (
              <PropertyCard 
                key={p._id} 
                property={p} 
                initiallySaved={false} 
                onToggleSave={handleToggleSave} // FIX: Now passing the required function
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Button 
            className="w-full h-12 bg-primary text-white"
            onClick={() => navigate("/search")}
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};