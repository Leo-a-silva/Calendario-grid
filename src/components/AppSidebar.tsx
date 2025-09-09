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
  return <Sidebar className="border-r border-gray-100 bg-white w-64 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-white-600">NombreApp</h1>
      </div>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase font-medium text-blue-500 mb-2">
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
                            ? "bg-blue-50 text-white-600 font-semibold" 
                            : "text-gray-600 hover:bg-gray-50"
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
          <SidebarGroupLabel className="text-xs uppercase font-medium text-blue-500 mb-2">
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
                            ? "bg-blue-50 text-white-600 font-semibold" 
                            : "text-gray-600 hover:bg-gray-50"
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
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-black-800">Dr. Juan Pérez</p>
              <p className="text-xs text-dark-500">Odontólogo</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>;
}