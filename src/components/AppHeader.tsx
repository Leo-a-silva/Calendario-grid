import { Bell, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-blue-600 text-white">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white hover:bg-blue-700 p-2 rounded-lg" />
        <h1 className="text-xl font-semibold">
          OdontoApp
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-blue-700 hover:text-white rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>
        
        <div className="flex items-center gap-2 p-1 rounded-full hover:bg-blue-700 cursor-pointer">
          <Avatar className="h-8 w-8 border-2 border-white">
            <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
            <AvatarFallback className="bg-blue-500 text-white">JP</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Dr. Juan Pérez</p>
          </div>
          <ChevronDown className="h-4 w-4 text-white" />
        </div>
        
        <div className="h-8 w-px bg-blue-500 mx-2"></div>
        
        <div className="flex items-center gap-2 bg-white/20 text-white px-3 py-1.5 rounded-lg">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Hoy, 19 Ago</span>
        </div>
      </div>
    </header>
  );
}