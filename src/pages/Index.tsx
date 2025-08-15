
import { useState } from "react";
import { MiniCalendar } from "@/components/MiniCalendar";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { AppointmentModal } from "@/components/AppointmentModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  return (
    <div className="flex gap-6 p-6">
      <div className="flex flex-col gap-4">
        <Button className="w-full" onClick={() => setAppointmentModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agendar turnos
        </Button>
        
        <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </div>
      
      <WeeklyCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      
      <AppointmentModal 
        open={appointmentModalOpen} 
        onOpenChange={setAppointmentModalOpen} 
      />
    </div>
  );
};

export default Index;
