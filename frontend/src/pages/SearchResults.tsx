import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Loader2, Home } from "lucide-react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");

  // Determine if the user is viewing a specific dashboard category
  const currentRole = searchParams.get("role");

  // Logic to dynamically change the page title
  const getPageHeading = () => {
    switch (currentRole) {
      case "owner": return "My Listed Properties";
      case "buyer": return "My Purchased Properties";
      case "renter": return "My Rented Properties";
      default: return "Search Results";
    }
  };

  const fetchSavedProperties = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/properties/saved-properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedIds(res.data.map((p: any) => p._id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProperties = async (additionalFilters: any = {}) => {
    setLoading(true);
    try {
      const params = {
        location: searchParams.get("location") || "",
        type: additionalFilters.type || searchParams.get("intent") || searchParams.get("type") || "",
        minPrice: additionalFilters.minPrice || "",
        maxPrice: additionalFilters.maxPrice || "",
        bedrooms: additionalFilters.bedrooms || "",
        // Dashboard role and ID syncing
        role: currentRole || "",
        userId: searchParams.get("userId") || "",
      };

      const res = await axios.get(`http://localhost:5000/api/properties`, { params });
      setProperties(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = (propertyId: string, newState: boolean) => {
    setSavedIds((prev) =>
      newState ? [...prev, propertyId] : prev.filter((id) => id !== propertyId)
    );
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
          {/* Dynamically updated title based on Dashboard role */}
          <h1 className="text-3xl font-bold">{getPageHeading()}</h1>
          
          {/* Only show filter toggle if we are NOT in a dashboard specific view */}
          {!currentRole && (
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Hide Sidebar filters if viewing dashboard-specific lists */}
          {!currentRole && (
            <aside className="hidden lg:block w-72 shrink-0">
              <SearchFilters onApply={fetchProperties} />
            </aside>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
              </div>
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
                <p>
                  {currentRole 
                    ? `You haven't ${currentRole === 'owner' ? 'listed' : currentRole === 'buyer' ? 'bought' : 'rented'} any properties yet.` 
                    : "No properties found. Try different criteria."}
                </p>
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