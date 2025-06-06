
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Appointment {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: "decoraciones" | "turnos" | "tareas" | "inhabilitado";
  patient?: string;
  doctor?: string;
}

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

// Datos de ejemplo de turnos
const sampleAppointments: Appointment[] = [
  { id: "1", title: "Consulta General", time: "09:00", duration: 1, type: "decoraciones", patient: "Juan Pérez", doctor: "Dr. García" },
  { id: "2", title: "Limpieza", time: "10:00", duration: 1, type: "turnos", patient: "María López", doctor: "Dr. García" },
  { id: "3", title: "Ortodoncia", time: "11:00", duration: 2, type: "turnos", patient: "Carlos Ruiz", doctor: "Dr. Martínez" },
  { id: "4", title: "Revisión", time: "14:00", duration: 1, type: "decoraciones", patient: "Ana Torres", doctor: "Dr. García" },
  { id: "5", title: "Endodoncia", time: "15:00", duration: 2, type: "turnos", patient: "Pedro Sánchez", doctor: "Dr. Martínez" },
  { id: "6", title: "Consulta", time: "16:00", duration: 1, type: "tareas", patient: "Laura Díaz", doctor: "Dr. García" },
];

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // Start at 8:00 AM
  return `${hour.toString().padStart(2, '0')}:00`;
});

const weekDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function WeeklyCalendar({ selectedDate, onDateChange }: WeeklyCalendarProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => {
    onDateChange(subWeeks(selectedDate, 1));
  };

  const goToNextWeek = () => {
    onDateChange(addWeeks(selectedDate, 1));
  };

  const getAppointmentsForDayAndTime = (dayIndex: number, time: string) => {
    // This would typically filter appointments based on date and time
    // For demo purposes, we'll show some sample appointments
    if (dayIndex >= 1 && dayIndex <= 5 && Math.random() > 0.7) {
      const randomAppointment = sampleAppointments[Math.floor(Math.random() * sampleAppointments.length)];
      return [randomAppointment];
    }
    return [];
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

        {/* Week header */}
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

      {/* Calendar grid */}
      <div className="overflow-auto max-h-96">
        <div className="grid grid-cols-8 gap-0">
          {timeSlots.map((time) => (
            <>
              {/* Time column */}
              <div key={`time-${time}`} className="p-2 text-xs text-gray-500 text-right border-b">
                {time}
              </div>
              
              {/* Day columns */}
              {weekDates.map((date, dayIndex) => {
                const appointments = getAppointmentsForDayAndTime(dayIndex, time);
                
                return (
                  <div 
                    key={`${dayIndex}-${time}`} 
                    className="min-h-12 p-1 border-l border-b hover:bg-gray-50 cursor-pointer"
                  >
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`dental-appointment-slot appointment-${appointment.type} mb-1`}
                      >
                        <div className="font-medium">{appointment.title}</div>
                        {appointment.patient && (
                          <div className="text-xs opacity-75">{appointment.patient}</div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </Card>
  );
}
