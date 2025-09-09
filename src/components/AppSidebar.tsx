import { Home, Users, FileText, Calendar, File, Settings, MessageSquare, Bell, User, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const items = [{
  title: "Inicio",
  url: "/",
  icon: Home
}, {
  title: "Pacientes",
  url: "/pacientes",
  icon: Users
}, {
  title: "Agenda",
  url: "/agenda",
  icon: Calendar
}, {
  title: "Documentos",
  url: "/documentos",
  icon: File
}, {
  title: "Mensajes",
  url: "/mensajes",
  icon: MessageSquare
}];

const configItems = [{
  title: "Configuración",
  url: "/configuracion",
  icon: Settings
}];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/" || currentPath === "/odontograma";
    }
    return currentPath === path;
  };
  return <Sidebar className="border-r border-border bg-white w-64">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">NombreApp</h1>
      </div>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase font-medium text-gray-500 mb-2">
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mb-6">
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: navIsActive }) => 
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.url) || navIsActive 
                            ? "bg-blue-50 text-blue-600" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase font-medium text-gray-500 mb-2">
            Configuración
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive: navIsActive }) => 
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive(item.url) || navIsActive 
                            ? "bg-blue-50 text-blue-600" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Dr. Juan Pérez</p>
              <p className="text-xs text-gray-500">Odontólogo</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>;
}