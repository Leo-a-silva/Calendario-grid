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
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg" />
        <div className="text-sm text-gray-500 hidden md:block">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
          <span className="sr-only">Notificaciones</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group">
              <Avatar className="h-8 w-8 border-2 border-gray-100">
                <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
                <AvatarFallback className="bg-blue-500 text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{user?.username || 'Usuario'}</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">Odontólogo</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-600" />
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