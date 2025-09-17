
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useData, Appointment as DataAppointment } from "@/contexts/DataContext";
import { AppointmentDetailsModal } from "@/components/AppointmentDetailsModal";
import { useState } from "react";

interface Appointment {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: "Recordatorio" | "turnos" | "tareas" | "inhabilitado";
  patient?: string;
  doctor?: string;
}

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

const sampleAppointments: Appointment[] = [
  { id: "1", title: "Consulta General", time: "09:00", duration: 1, type: "turnos", patient: "Juan Pérez", doctor: "Dr. García" },
];

//configuración de agenda semanal (horario de atencion)
const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const weekDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function WeeklyCalendar({ selectedDate, onDateChange, onTimeSlotClick }: WeeklyCalendarProps) {
  const { appointments } = useData();
  const [selectedAppointment, setSelectedAppointment] = useState<DataAppointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => {
    onDateChange(subWeeks(selectedDate, 1));
  };

  const goToNextWeek = () => {
    onDateChange(addWeeks(selectedDate, 1));
  };

  const getAppointmentsForDayAndTime = (dayIndex: number, time: string) => {
    const currentDate = weekDates[dayIndex];
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    
    // Get appointments for this specific date and time
    return appointments.filter(appointment => 
      appointment.date === formattedDate && appointment.time === time
    );
  };

  const handleAppointmentClick = (appointment: DataAppointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  return (
    <Card className="flex-1">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {format(weekStart, "MMMM yyyy", { locale: es })}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>GMT+{new Date().getTimezoneOffset() / -60}</span>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-0 border-b">
          <div className="p-2"></div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-2 text-center border-l">
              <div className="text-sm font-medium text-gray-600">
                {weekDays[index]}
              </div>
              <div className={`text-lg font-semibold mt-1 ${
                format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') 
                  ? 'text-primary' 
                  : 'text-gray-900'
              }`}>
                {format(date, "d")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-auto max-h-[500px]">
        <div className="grid grid-cols-8 gap-0">
          {timeSlots.map((time) => (
            <>
              <div key={`time-${time}`} className="p-2 text-xs text-gray-500 text-right border-b bg-gray-50">
                {time}
              </div>
              
              {weekDates.map((date, dayIndex) => {
                const appointments = getAppointmentsForDayAndTime(dayIndex, time);
                
                return (
                  <div 
                    key={`${dayIndex}-${time}`} 
                    className="min-h-12 p-1 border-l border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (appointments.length === 0 && onTimeSlotClick) {
                        onTimeSlotClick(date, time);
                      }
                    }}
                  >
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="dental-appointment-slot appointment-turnos mb-1 text-xs cursor-pointer bg-blue-100 border border-blue-300 rounded p-2 hover:bg-blue-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppointmentClick(appointment);
                        }}
                      >
                        <div className="font-medium">{appointment.type}</div>
                        <div className="text-xs opacity-75">{appointment.patientName}</div>
                        <div className="text-xs text-blue-600">{appointment.time}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
      
      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
      />
    </Card>
  );
}
