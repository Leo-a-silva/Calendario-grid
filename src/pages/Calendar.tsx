
import { useState } from "react";
import { MiniCalendar } from "@/components/MiniCalendar";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Filter, MoreHorizontal } from "lucide-react";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-gray-900">Calendario</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo turno
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <MiniCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        
        <WeeklyCalendar 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default Calendar;
