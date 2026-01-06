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
import { SlidersHorizontal, Loader2, Home, Building2, Key } from "lucide-react";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const token = localStorage.getItem("token");
  const currentRole = searchParams.get("role");
  const currentType =
    searchParams.get("type") ||
    searchParams.get("intent") ||
    "sell";

  const getPageHeading = () => {
    switch (currentRole) {
      case "owner":
        return "My Listed Properties";
      case "buyer":
        return "My Purchased Properties";
      case "renter":
        return "My Rented Properties";
      default:
        return currentType === "sell"
          ? "Buy a Home"
          : "Rent a Home";
    }
  };

  const handleTypeToggle = (newType: "sell" | "rent") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", newType);
    setSearchParams(newParams);
  };

  const fetchProperties = async (additionalFilters: any = {}) => {
    setLoading(true);
    try {
      const params = {
        location: searchParams.get("location") || "",
        type: additionalFilters.type || currentType,
        minPrice: additionalFilters.minPrice || "",
        maxPrice: additionalFilters.maxPrice || "",
        bedrooms: additionalFilters.bedrooms || "",
        role: currentRole || "",
        userId: searchParams.get("userId") || "",
      };

      const res = await axios.get(
        "http://localhost:5000/api/properties",
        { params }
      );
      setProperties(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // saved logic stays as-is
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      <Navbar />

      {/* GLOBAL PAGE ANIMATION */}
      <PageTransition>
        <>
          {/* Toggle Header */}
          {!currentRole && (
            <div className="bg-white border-b py-6 shadow-sm">
              <div className="container flex flex-col items-center">
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
                  <Button
                    variant={
                      currentType === "sell"
                        ? "default"
                        : "ghost"
                    }
                    onClick={() => handleTypeToggle("sell")}
                    className={`px-10 h-11 rounded-lg font-bold transition-all ${
                      currentType === "sell"
                        ? "bg-primary text-white shadow-md scale-105"
                        : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    For Sale
                  </Button>

                  <Button
                    variant={
                      currentType === "rent"
                        ? "default"
                        : "ghost"
                    }
                    onClick={() => handleTypeToggle("rent")}
                    className={`px-10 h-11 rounded-lg font-bold transition-all ${
                      currentType === "rent"
                        ? "bg-primary text-white shadow-md scale-105"
                        : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    For Rent
                  </Button>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 container py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {getPageHeading()}
                </h1>
                <p className="text-sm text-slate-500">
                  Found {properties.length}{" "}
                  {currentType === "sell"
                    ? "properties for sale"
                    : "rentals available"}
                </p>
              </div>

              {!currentRole && (
                <Button
                  variant="outline"
                  className="lg:hidden flex items-center gap-2"
                  onClick={() => setShowFilters(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              )}
            </div>

            <div className="flex gap-8 items-start">
              {!currentRole && (
                <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
                  <SearchFilters onApply={fetchProperties} />
                </aside>
              )}

              <div className="flex-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin h-10 w-10 text-primary" />
                    <p className="text-slate-400 font-medium">
                      Fetching best matches...
                    </p>
                  </div>
                ) : properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((p) => (
                      <PropertyCard
                        key={p._id}
                        property={p}
                        onToggleSave={() => {}}
                        initiallySaved={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <Home className="h-16 w-16 mx-auto mb-4 text-slate-200" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      No properties found
                    </h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                      Try adjusting filters or switching Buy/Rent.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </>
      </PageTransition>

      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SearchResults;
