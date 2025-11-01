import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ReportAnimal from "./pages/ReportAnimal";
import ReportedAnimals from "./pages/ReportedAnimals";
import Hospitals from "./pages/Hospitals";
import AdoptDonate from "./pages/AdoptDonate";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import AnimalTracking from "./pages/AnimalTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/report" element={<ReportAnimal />} />
          <Route path="/reported-animals" element={<ReportedAnimals />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/adopt-donate" element={<AdoptDonate />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tracking" element={<AnimalTracking />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
