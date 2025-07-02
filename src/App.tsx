
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import UserManagement from "./pages/dashboard/UserManagement";
import PatientAnalysis from "./pages/dashboard/PatientAnalysis";
import PatientProfile from "./pages/dashboard/PatientProfile";
import DoctorPatients from "./pages/dashboard/DoctorPatients";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analysis" element={<PatientAnalysis />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="diagnoses" element={<div>Diagnósticos</div>} />
              <Route path="pending-doctors" element={<div>Médicos Pendientes</div>} />
              <Route path="all-appointments" element={<div>Todas las Citas</div>} />
              <Route path="reports" element={<div>Reportes</div>} />
              <Route path="settings" element={<div>Configuración</div>} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="history" element={<div>Mi Historial</div>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
