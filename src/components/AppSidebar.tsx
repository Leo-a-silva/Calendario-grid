
import { Calendar, Home, Users, Stethoscope, Shield, Settings, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Calendario",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Especialidades",
    url: "/specialties",
    icon: Stethoscope,
  },
  {
    title: "Obra Social",
    url: "/insurance",
    icon: Shield,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-sidebar-background" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">DentiApp</h2>
            <p className="text-xs text-sidebar-foreground/70">Gestión Odontológica</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <div className="mb-4">
            <Button className="w-full bg-white text-sidebar-background hover:bg-gray-100" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agendar turno
            </Button>
          </div>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/70 text-center">
          © 2024 DentiApp
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
