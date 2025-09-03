
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
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Add Appointment Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
          <Button onClick={() => setAppointmentModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Agendar turnos
          </Button>
        </div>

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mini Calendar - Above on mobile, left on desktop */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </div>
          
          {/* Weekly Calendar - Below on mobile, right on desktop */}
          <div className="flex-1 min-w-0">
            <WeeklyCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </div>
        </div>
      </div>
      
      <AppointmentModal 
        open={appointmentModalOpen} 
        onOpenChange={setAppointmentModalOpen} 
      />
    </div>
  );
};

export default Index;
