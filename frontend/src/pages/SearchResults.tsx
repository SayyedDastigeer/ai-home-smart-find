import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, Loader2, Home } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");

  const fetchSavedProperties = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/properties/saved-properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedIds(res.data.map((p: any) => p._id));
    } catch (err) { console.error(err); }
  };

  const fetchProperties = async (additionalFilters: any = {}) => {
    setLoading(true);
    try {
      const params = {
        location: searchParams.get("location") || "",
        type: additionalFilters.type || searchParams.get("intent") || "",
        minPrice: additionalFilters.minPrice || "",
        maxPrice: additionalFilters.maxPrice || "",
        bedrooms: additionalFilters.bedrooms || "",
      };

      const res = await axios.get(`http://localhost:5000/api/properties`, { params });
      setProperties(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleToggleSave = (propertyId: string, newState: boolean) => {
    setSavedIds((prev) => newState ? [...prev, propertyId] : prev.filter((id) => id !== propertyId));
  };

  useEffect(() => {
    fetchProperties();
    fetchSavedProperties();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <SearchFilters onApply={fetchProperties} />
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
            ) : properties.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((p) => (
                  <PropertyCard 
                    key={p._id} 
                    property={p} 
                    initiallySaved={savedIds.includes(p._id)} 
                    onToggleSave={handleToggleSave} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border-dashed border-2">
                <Home className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No properties found. Try a different location.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SearchResults;