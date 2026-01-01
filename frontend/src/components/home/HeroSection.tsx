import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ArrowRight } from "lucide-react";

type PropertyType = "buy" | "rent" | "sell";

export function HeroSection() {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState<PropertyType>("buy");
  const [location, setLocation] = useState("");

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "buy", label: "Buy" },
    { value: "rent", label: "Rent" },
    { value: "sell", label: "Sell" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    
    // Map "buy" intent to "sell" type for database consistency
    const intent = propertyType === "buy" ? "sell" : propertyType;
    params.append("intent", intent);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#081817]">
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#29A397]/20 blur-[160px]" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[#29A397]/10 blur-[140px]" />

      <div className="container relative z-10 grid lg:grid-cols-[1fr_520px] gap-16 items-center py-20">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#29A397]" />
            <span className="text-xs tracking-[0.25em] uppercase text-gray-400 font-semibold">AI Powered Real Estate</span>
          </div>

          <h1 className="text-white font-semibold leading-[1.08] mb-6 text-[clamp(2.6rem,4vw,3.8rem)]">
            Discover Your <br />
            <span className="relative inline-block">
              Perfect Home
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#29A397] rounded-full" />
            </span>
          </h1>

          <p className="text-gray-400 max-w-sm text-base leading-relaxed mb-10">
            Smarter property decisions powered by AI — pricing accuracy, location intelligence, and real market trends.
          </p>

          <div className="inline-flex items-center gap-1 p-1.5 mb-6 rounded-full bg-[#102826]/70 backdrop-blur-md border border-white/10">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setPropertyType(type.value)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  propertyType === type.value ? "bg-[#29A397] text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#102826]/70 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 max-w-md">
            <MapPin className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Enter city or area (e.g. Virar)"
              className="flex-1 bg-transparent text-white placeholder:text-gray-500 text-sm focus:outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} className="bg-[#29A397] hover:bg-[#228a80] text-white h-9 px-4 rounded-lg text-sm">
              <Search className="h-4 w-4 mr-1" /> Search
            </Button>
          </div>
        </div>

        <div className="relative group hidden lg:block">
          <div className="relative h-[520px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1400" alt="House" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081817] to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-[#081817]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-white">
              <p className="text-xs text-gray-400">Featured Property</p>
              <div className="flex justify-between items-end">
                <div><h3 className="font-medium">Modern Villa, Malibu</h3><p className="text-[#29A397] text-xl font-semibold">$4.2M</p></div>
                <Button variant="outline" className="rounded-full border-white/20 hover:bg-white/10">View <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}