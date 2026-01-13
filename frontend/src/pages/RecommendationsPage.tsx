import React, { useEffect, useState } from "react";
import axios from "axios";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Sparkles, Loader2, Trophy, Brain } from "lucide-react";

export const RecommendationsPage = () => {
  const [rankedHouses, setRankedHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/properties/ai-rankings", {
          params: { 
            budget: 5000000, 
            homeType: "Houses",
            priority: "investment" 
          }
        });
        setRankedHouses(res.data);
      } catch (err) {
        console.error("Ranking fetch error");
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Trophy className="text-yellow-500 h-10 w-10" /> 
            AI Property Rankings
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Our algorithm ranked {rankedHouses.length} properties specifically for your profile.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-primary h-12 w-12 mb-4" />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Analyzing Market Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {rankedHouses.map((house, index) => (
              <div key={house._id} className="relative group">
                {/* Ranking Number */}
                <div className="absolute -top-4 -left-4 z-20 h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl border-4 border-white">
                  #{index + 1}
                </div>

                {/* AI Reasoning Overlay */}
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-primary/20 max-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-black uppercase text-primary tracking-tighter">AI Analysis</span>
                  </div>
                  <p className="text-[11px] leading-tight font-bold text-slate-700">
                    "{house.aiReason}"
                  </p>
                  <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${house.matchScore}%` }}></div>
                  </div>
                </div>

                <PropertyCard property={house} onToggleSave={() => {}} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};