import { Bell, Calendar as CalendarIcon, ChevronDown, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { user, logout } = useAuth();
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const formattedDate = today.toLocaleDateString('es-ES', options);
  
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#0f172a] text-white">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white hover:bg-gray-800 p-2 rounded-lg" />
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-gray-800 hover:text-white rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-800 cursor-pointer">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
                <AvatarFallback className="bg-blue-500 text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.username || 'Usuario'}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-white" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem 
              onClick={logout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="h-8 w-px bg-gray-700 mx-2"></div>
        
        <div className="flex items-center gap-2 bg-gray-800 text-white px-3 py-1.5 rounded-lg">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Hoy, {formattedDate}</span>
        </div>
      </div>
    </header>
  );
}