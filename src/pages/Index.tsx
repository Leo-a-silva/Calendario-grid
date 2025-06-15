
import { useState } from "react";
import { MiniCalendar } from "@/components/MiniCalendar";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="h-screen flex">
      <div className="w-16"></div>
      
      <div className="flex-1 flex flex-col">
        <div className="h-16 flex items-center justify-center gap-4 border-b">
          <Link to="/odontograma">
            <Button variant="outline">
              Ver Odontograma
            </Button>
          </Link>
        </div>
        
        <div className="flex-1 flex gap-6 p-6 mx-0 my-[80px]">
          <div className="flex flex-col gap-4">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Agendar turnos
            </Button>
            
            <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </div>
          
          <WeeklyCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>
      </div>
    </div>
  );
};

export default Index;
