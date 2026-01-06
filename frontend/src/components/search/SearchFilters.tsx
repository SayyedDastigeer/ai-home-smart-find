import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, MapPin } from "lucide-react";

interface SearchFiltersProps {
  onApply: (filters: any) => void;
}

export function SearchFilters({ onApply }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "Any",
    bathrooms: "Any",
    homeTypes: [] as string[],
  });

  const propertyTypes = ["Houses", "Townhomes", "Multi-family", "Condos", "Apartments", "Manufactured"];

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      homeTypes: prev.homeTypes.includes(type)
        ? prev.homeTypes.filter(t => t !== type)
        : [...prev.homeTypes, type]
    }));
  };

  const handleApply = () => {
    // Clean filters to prevent NaN errors
    const cleanFilters = { ...filters };
    if (cleanFilters.bedrooms === "Any") delete (cleanFilters as any).bedrooms;
    if (cleanFilters.bathrooms === "Any") delete (cleanFilters as any).bathrooms;
    onApply(cleanFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border-b sticky top-0 z-30 shadow-sm">
      
      {/* 1. Location Search */}
      <div className="relative w-full md:w-64">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="City, ZIP, or Address"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-[#29A397]"
        />
      </div>

      {/* 2. Price Range */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold px-4 hover:border-[#29A397] hover:text-[#29A397]">
            Price <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6 rounded-2xl shadow-2xl border-none">
          <div className="space-y-4">
            <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm">Price Range</h4>
            <div className="flex items-center gap-3">
              <Input 
                placeholder="Min" 
                type="number" 
                className="h-11 rounded-xl bg-slate-50 border-none"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
              <span className="text-slate-300">/</span>
              <Input 
                placeholder="Max" 
                type="number" 
                className="h-11 rounded-xl bg-slate-50 border-none"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
            <Button onClick={handleApply} className="w-full h-11 bg-[#29A397] hover:opacity-90 rounded-xl font-bold">Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 3. Beds & Baths (Green Active State) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold px-4 hover:border-[#29A397] hover:text-[#29A397]">
            Beds & Baths <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-6 rounded-2xl shadow-2xl border-none">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bedrooms</Label>
              <div className="flex border rounded-xl overflow-hidden border-slate-100">
                {["Any", "1+", "2+", "3+", "4+"].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFilters({ ...filters, bedrooms: num })}
                    className={`flex-1 py-3 text-xs font-bold transition-all ${
                      filters.bedrooms === num ? "bg-[#29A397] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bathrooms</Label>
              <div className="flex border rounded-xl overflow-hidden border-slate-100">
                {["Any", "1+", "1.5+", "2+", "3+"].map((num) => (
                  <button
                    key={num}
                    onClick={() => setFilters({ ...filters, bathrooms: num })}
                    className={`flex-1 py-3 text-xs font-bold transition-all ${
                      filters.bathrooms === num ? "bg-[#29A397] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleApply} className="w-full h-12 bg-[#29A397] hover:opacity-90 rounded-xl font-bold">Apply Filters</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 4. Home Type (Green Checkboxes) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 font-bold px-4 hover:border-[#29A397] hover:text-[#29A397]">
            Home Type <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 rounded-2xl shadow-2xl border-none">
          <div className="p-2 space-y-1">
            {propertyTypes.map((type) => (
              <div 
                key={type} 
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                onClick={() => handleTypeToggle(type)}
              >
                <Checkbox 
                  checked={filters.homeTypes.includes(type)}
                  className="rounded-md border-slate-300 data-[state=checked]:bg-[#29A397] data-[state=checked]:border-[#29A397]"
                />
                <span className="text-sm font-bold text-slate-700">{type}</span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t mt-2">
            <Button onClick={handleApply} className="w-full h-11 bg-[#29A397] hover:opacity-90 rounded-xl font-bold">Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Main Action Button */}
      <Button 
        onClick={handleApply} 
        className="h-11 px-8 ml-auto bg-[#29A397] hover:opacity-90 font-bold rounded-xl shadow-lg shadow-[#29A397]/20 transition-all active:scale-95"
      >
        Save search
      </Button>
    </div>
  );
}