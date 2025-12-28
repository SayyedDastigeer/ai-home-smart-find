import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ArrowRight } from "lucide-react";

type PropertyType = "buy" | "rent" | "sell";

export function HeroSection() {
  const [propertyType, setPropertyType] = useState<PropertyType>("buy");

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: "buy", label: "Buy" },
    { value: "rent", label: "Rent" },
    { value: "sell", label: "Sell" },
  ];

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#081817]">
      
      {/* Ambient glow */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#29A397]/20 blur-[160px]" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-[#29A397]/10 blur-[140px]" />

      <div className="container relative z-10 grid lg:grid-cols-[1fr_520px] gap-16 items-center py-20">
        
        {/* LEFT */}
        <div>
          {/* Tag */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#29A397]" />
            <span className="text-xs tracking-[0.25em] uppercase text-gray-400 font-semibold">
              AI Powered Real Estate
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-white font-semibold leading-[1.08] mb-6">
            <span className="block text-[clamp(2.6rem,4vw,3.8rem)]">
              Discover Your
            </span>
            <span className="relative inline-block text-[clamp(2.6rem,4vw,3.8rem)]">
              Perfect Home
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#29A397] rounded-full" />
            </span>
          </h1>

          <p className="text-gray-400 max-w-sm text-base leading-relaxed mb-10">
            Smarter property decisions powered by AI — pricing accuracy,
            location intelligence, and real market trends.
          </p>

          {/* Property Type Pills */}
         {/* PROPERTY INTENT SWITCH (PRIMARY ACTION) */}
<div className="inline-flex items-center gap-1 p-1.5 mb-6 rounded-full bg-[#102826]/70 backdrop-blur-md border border-white/10">
  {propertyTypes.map((type) => {
    const active = propertyType === type.value;

    return (
      <button
        key={type.value}
        onClick={() => setPropertyType(type.value)}
        className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
          ${
            active
              ? "bg-[#29A397] text-white shadow-[0_0_20px_rgba(41,163,151,0.45)]"
              : "text-gray-400 hover:text-white"
          }
        `}
      >
        {type.label}

        {/* Active underline */}
        {active && (
          <span className="absolute left-1/2 -bottom-1 w-6 h-0.5 bg-white rounded-full -translate-x-1/2" />
        )}
      </button>
    );
  })}
</div>


          {/* Search */}
          <div className="flex items-center gap-2 bg-[#102826]/70 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 max-w-md">
            <MapPin className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Enter city or area"
              className="flex-1 bg-transparent text-white placeholder:text-gray-500 text-sm focus:outline-none"
            />
            <Button className="bg-[#29A397] hover:bg-[#228a80] text-white h-9 px-4 rounded-lg text-sm">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-10">
            <div>
              <div className="text-white text-2xl font-semibold">
                9,000<span className="text-[#29A397]">+</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Premium Homes</div>
            </div>
            <div>
              <div className="text-white text-2xl font-semibold">
                2,000<span className="text-[#29A397]">+</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Happy Clients</div>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative group hidden lg:block">
          <div className="relative h-[520px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1400&auto=format&fit=crop"
              alt="Luxury House"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081817] via-transparent to-transparent" />

            {/* Floating card */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#081817]/80 backdrop-blur-md border border-white/10 rounded-3xl p-5">
              <p className="text-xs text-gray-400 mb-1">Featured Property</p>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-white font-medium">
                    Modern Villa, Malibu
                  </h3>
                  <p className="text-[#29A397] text-xl font-semibold mt-1">
                    $4.2M
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  View <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative ring */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-[#29A397]/30" />
        </div>
      </div>
    </section>
  );
}
