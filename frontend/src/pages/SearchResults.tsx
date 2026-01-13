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
import { Loader2, Home, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]); // 🔹 Track saved IDs
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });

  const token = localStorage.getItem("token");
  const currentType = searchParams.get("type") || "sell";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // 1. Fetch properties based on search
      const params = {
        ...Object.fromEntries([...searchParams]),
        page: currentPage,
        limit: 9,
      };
      const res = await axios.get("http://localhost:5000/api/properties", { params });
      
      const propertyData = res.data.properties || (Array.isArray(res.data) ? res.data : []);
      setProperties(propertyData);
      setPagination({
        current: res.data.currentPage || currentPage || 1,
        total: res.data.totalPages || 1,
      });

      // 2. 🔹 CRITICAL FIX: Fetch user's saved list to highlight hearts
      if (token) {
        const savedRes = await axios.get("http://localhost:5000/api/properties/saved-properties", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Map to an array of just IDs for easy checking: ["id1", "id2"]
        setSavedIds(savedRes.data.map((p: any) => p._id));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Sync local state when user clicks heart so it stays red without refresh
  const handleToggleSaveLocal = (id: string, isNowSaved: boolean) => {
    if (isNowSaved) {
      setSavedIds((prev) => [...prev, id]);
    } else {
      setSavedIds((prev) => prev.filter((savedId) => savedId !== id));
    }
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />
      
      <div className="bg-white border-b border-slate-100 py-12">
        <div className="container px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
              Properties for <span className="text-[#29A397]">{currentType === "sell" ? "Sale" : "Rent"}</span>
            </h1>
            <p className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
              <MapPin className="h-3 w-3" /> Showing {properties.length} Results
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            {["sell", "rent"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.set("type", t);
                  p.set("page", "1");
                  setSearchParams(p);
                }}
                className={`px-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentType === t ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t === "sell" ? "Sale" : "Rent"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <PageTransition>
        <main className="flex-1 container px-8 py-16 flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 h-fit bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <SearchFilters onApply={(filters) => {
                const newParams = new URLSearchParams(searchParams);
                Object.keys(filters).forEach(key => newParams.set(key, filters[key]));
                newParams.set("page", "1");
                setSearchParams(newParams);
            }} />
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center py-40 gap-4">
                <Loader2 className="animate-spin h-10 w-10 text-[#29A397]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Inventory...</p>
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {properties.map((p, index) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PropertyCard 
                        property={p} 
                        // 🔹 FIX: Check if ID exists in our saved list
                        initiallySaved={savedIds.includes(p._id)} 
                        onToggleSave={handleToggleSaveLocal} 
                      />
                    </motion.div>
                  ))}
                </div>

                {pagination.total > 1 && (
                  <div className="flex justify-center items-center gap-6 mt-20 pt-10 border-t border-slate-100">
                    <Button 
                      variant="outline" 
                      disabled={pagination.current === 1} 
                      onClick={() => handlePageChange(pagination.current - 1)}
                      className="rounded-full h-12 px-8 font-bold text-[10px] uppercase"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" /> Prev
                    </Button>
                    <span className="text-[11px] font-black bg-slate-900 text-white px-6 py-2.5 rounded-full shadow-lg">
                      {pagination.current} / {pagination.total}
                    </span>
                    <Button 
                      variant="outline" 
                      disabled={pagination.current === pagination.total} 
                      onClick={() => handlePageChange(pagination.current + 1)}
                      className="rounded-full h-12 px-8 font-bold text-[10px] uppercase"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100">
                <Home className="h-16 w-16 mx-auto mb-6 text-slate-100" />
                <h3 className="text-xl font-bold text-slate-900 uppercase">No Listings Found</h3>
                <p className="text-slate-400 mt-2 text-sm">Adjust your filters to see more results.</p>
              </div>
            )}
          </div>
        </main>
      </PageTransition>
      <Footer />
      <AIChatWidget />
    </div>
  );
};

export default SearchResults;