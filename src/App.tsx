
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard"; // Will keep for backward compatibility
import ResidentDashboard from "./pages/ResidentDashboard"; // New resident dashboard
import Staff from "./pages/Staff"; // Changed from Admin to Staff to be consistent
import CommunityManager from "./pages/CommunityManager";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
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
          <Route path="/dashboard" element={<Navigate to="/resident" replace />} /> {/* Redirect old dashboard to new resident page */}
          <Route path="/resident" element={<ResidentDashboard />} /> {/* New dedicated resident page */}
          <Route path="/staff" element={<Staff />} /> 
          <Route path="/admin" element={<Navigate to="/staff" replace />} /> {/* Redirect for backward compatibility */}
          <Route path="/community-manager" element={<CommunityManager />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
