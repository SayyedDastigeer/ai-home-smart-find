import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Filter, RotateCcw, Sparkles } from "lucide-react";

const propertyTypes = ["Apartment", "Villa", "House", "Penthouse", "Studio"];
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [areaRange, setAreaRange] = useState([500, 5000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBhk, setSelectedBhk] = useState<string[]>([]);
  const [aiSuggested, setAiSuggested] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleBhk = (bhk: string) => {
    setSelectedBhk((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setAreaRange([500, 5000]);
    setSelectedTypes([]);
    setSelectedBhk([]);
    setAiSuggested(false);
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Suggested Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <Label htmlFor="ai-suggested" className="text-sm font-medium cursor-pointer">
              AI Best Value
            </Label>
          </div>
          <Switch
            id="ai-suggested"
            checked={aiSuggested}
            onCheckedChange={setAiSuggested}
          />
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Price Range: ${priceRange[0]}L - ${priceRange[1]}L
          </Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Area Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Area: {areaRange[0]} - {areaRange[1]} sqft
          </Label>
          <Slider
            value={areaRange}
            onValueChange={setAreaRange}
            min={500}
            max={5000}
            step={100}
            className="mt-2"
          />
        </div>

        {/* Property Type */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Property Type</Label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* BHK */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Bedrooms</Label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map((bhk) => (
              <Badge
                key={bhk}
                variant={selectedBhk.includes(bhk) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => toggleBhk(bhk)}
              >
                {bhk}
              </Badge>
            ))}
          </div>
        </div>

        <Button className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
