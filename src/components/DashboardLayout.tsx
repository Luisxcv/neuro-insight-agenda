import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  User,
  Stethoscope,
  Brain,
  UserCheck
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

const DashboardLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Navegación específica por rol
  const getNavigationItems = () => {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ];

    switch (user.role) {
      case 'patient':
        return [
          ...baseItems,
          { title: "Análisis de IA", url: "/dashboard/analysis", icon: Brain },
          { title: "Mis Citas", url: "/dashboard/appointments", icon: Calendar },
          { title: "Mi Historial", url: "/dashboard/history", icon: FileText },
          { title: "Mi Perfil", url: "/dashboard/profile", icon: User },
        ];
      
      case 'doctor':
        return [
          ...baseItems,
          { title: "Mis Pacientes", url: "/dashboard/patients", icon: Users },
          { title: "Citas Programadas", url: "/dashboard/appointments", icon: Calendar },
          { title: "Diagnósticos", url: "/dashboard/diagnoses", icon: Brain },
          { title: "Mi Perfil", url: "/dashboard/profile", icon: Stethoscope },
        ];
      
      case 'admin':
        return [
          ...baseItems,
          { title: "Gestión de Usuarios", url: "/dashboard/users", icon: Users },
          { title: "Médicos Pendientes", url: "/dashboard/pending-doctors", icon: UserCheck },
          { title: "Todas las Citas", url: "/dashboard/all-appointments", icon: Calendar },
          { title: "Reportes", url: "/dashboard/reports", icon: FileText },
          { title: "Configuración", url: "/dashboard/settings", icon: Settings },
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          items={navigationItems} 
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Bienvenido, {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

// Componente del Sidebar
function AppSidebar({ 
  items, 
  user, 
  onLogout 
}: { 
  items: Array<{ title: string; url: string; icon: any }>;
  user: User;
  onLogout: () => void;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'patient': return 'text-blue-600';
      case 'doctor': return 'text-green-600';
      case 'admin': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'patient': return 'Paciente';
      case 'doctor': return 'Médico';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent>
        {/* Logo y usuario */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-primary">AI-Neurysm</h2>
                <p className={`text-xs ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navegación */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-2 w-full ${
                          isActive 
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                            : 'hover:bg-sidebar-accent/50'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout en el sidebar si está colapsado */}
        {collapsed && (
          <div className="mt-auto p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="w-full justify-center"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default DashboardLayout;