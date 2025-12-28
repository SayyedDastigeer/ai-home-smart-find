import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import PropertyDetails from "./pages/PropertyDetails";
import Dashboard from "./pages/Dashboard";
import SavedProperties from "./pages/SavedProperties";
import ListProperty from "./pages/ListProperty"; // 1. ADD THIS IMPORT
import NotFound from "./pages/NotFound";
import { RecommendationsPage } from "./pages/RecommendationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/saved" element={<SavedProperties />} />
          
          {/* 2. ADD THE LIST PROPERTY ROUTE HERE */}
          <Route path="/list-property" element={<ListProperty />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;