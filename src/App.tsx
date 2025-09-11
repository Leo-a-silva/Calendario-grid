
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import Index from "./pages/Index";
import Odontograma from "./pages/Odontograma";
import Pacientes from "./pages/Pacientes";
import Agenda from "./pages/Agenda";
import LoginForm from "./components/LoginForm";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Wrapper component that includes the layout (sidebar, header, etc.)
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex w-full bg-background">
    <AppSidebar />
    <div className="flex-1 flex flex-col">
      <AppHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />} 
      />
      
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout>
            <Index />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/pacientes" element={
        <ProtectedRoute>
          <AppLayout>
            <Pacientes />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/agenda" element={
        <ProtectedRoute>
          <AppLayout>
            <Agenda />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/agenda/nueva-cita" element={
        <ProtectedRoute>
          <AppLayout>
            <Agenda />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/odontograma" element={
        <ProtectedRoute>
          <AppLayout>
            <Odontograma />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/odontograma/:pacienteId" element={
        <ProtectedRoute>
          <AppLayout>
            <Odontograma />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <Router>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </Router>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
