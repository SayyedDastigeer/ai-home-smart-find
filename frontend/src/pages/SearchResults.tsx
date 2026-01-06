import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { AIChatWidget } from "@/components/chat/AIChatWidget";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Loader2, Building2, Key, Home } from "lucide-react";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentType = searchParams.get("type") || "sell";
  const currentRole = searchParams.get("role");

  const fetchProperties = async (additionalFilters: any = {}) => {
    setLoading(true);
    try {
      const params = {
        location: additionalFilters.location || searchParams.get("location") || "",
        type: currentType,
        minPrice: additionalFilters.minPrice || "",
        maxPrice: additionalFilters.maxPrice || "",
        bedrooms: additionalFilters.bedrooms || "",
        bathrooms: additionalFilters.bathrooms || "",
        minArea: additionalFilters.minArea || "",
        role: currentRole || "",
        userId: searchParams.get("userId") || "",
      };

      const res = await axios.get("http://localhost:5000/api/properties", { params });
      setProperties(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (newType: "sell" | "rent") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", newType);
    setSearchParams(newParams);
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      <Navbar />
      <PageTransition>
        <div className="flex flex-col min-h-screen">
          {!currentRole && (
            <div className="bg-white border-b py-6 sticky top-0 z-20 shadow-sm">
              <div className="container flex justify-center">
                <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 border border-slate-200">
                  <Button
                    variant={currentType === "sell" ? "default" : "ghost"}
                    onClick={() => handleTypeToggle("sell")}
                    className={`px-10 h-12 rounded-xl font-bold transition-all duration-300 ${
                      currentType === "sell" ? "bg-primary text-white shadow-lg" : "text-slate-500"
                    }`}
                  >
                    <Building2 className="mr-2 h-4 w-4" /> For Sale
                  </Button>
                  <Button
                    variant={currentType === "rent" ? "default" : "ghost"}
                    onClick={() => handleTypeToggle("rent")}
                    className={`px-10 h-12 rounded-xl font-bold transition-all duration-300 ${
                      currentType === "rent" ? "bg-primary text-white shadow-lg" : "text-slate-500"
                    }`}
                  >
                    <Key className="mr-2 h-4 w-4" /> For Rent
                  </Button>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 container py-10">
            <div className="flex gap-10 items-start">
              <aside className="hidden lg:block w-80 shrink-0 sticky top-32">
                <SearchFilters onApply={fetchProperties} />
              </aside>

              <div className="flex-1">
                {loading ? (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-primary" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Inventory...</p>
                  </div>
                ) : properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {properties.map((p) => (
                      <PropertyCard key={p._id} property={p} initiallySaved={false} onToggleSave={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <Home className="h-16 w-16 mx-auto mb-4 text-slate-100" />
                    <h3 className="text-xl font-bold text-slate-900">No properties found</h3>
                    <p className="text-slate-500">Try broadening your filters or location.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </PageTransition>
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SearchResults;