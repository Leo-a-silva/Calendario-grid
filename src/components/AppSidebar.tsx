import { Home, Users, Settings, FileText } from "lucide-react";
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
  title: "Obras Sociales",
  url: "/obras-sociales",
  icon: FileText
}, {
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
  return <Sidebar className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            Menú Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="my-[5px] mx-0">
            <SidebarMenu>
              {items.map(item => <SidebarMenuItem key={item.title} className="bg-blue-700">
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={({
                  isActive: navIsActive
                }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive(item.url) || navIsActive ? "bg-primary text-primary-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}