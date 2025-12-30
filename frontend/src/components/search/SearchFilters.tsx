import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
  onApply: (filters: any) => void; // This function comes from the SearchResults page
}

export function SearchFilters({ onApply }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    type: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6 p-4 border rounded-xl bg-card">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="flex gap-2">
          <Input 
            name="minPrice" 
            type="number" 
            placeholder="Min" 
            value={filters.minPrice}
            onChange={handleChange} 
          />
          <Input 
            name="maxPrice" 
            type="number" 
            placeholder="Max" 
            value={filters.maxPrice}
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Property Type</Label>
        <select 
          name="type" 
          value={filters.type}
          className="w-full p-2 rounded-md border bg-background text-sm"
          onChange={handleChange}
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
        </select>
      </div>

      <Button className="w-full" onClick={() => onApply(filters)}>
        Apply Filters
      </Button>
    </div>
  );
}