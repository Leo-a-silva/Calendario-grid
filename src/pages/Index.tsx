
import { useState } from "react";
import { MiniCalendar } from "@/components/MiniCalendar";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4 flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-gray-900">Calendario - Agenda Semanal</h1>
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

export default Index;
