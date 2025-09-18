import { useState, useMemo } from "react";
import { MiniCalendar } from "@/components/MiniCalendar";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { AppointmentModal } from "@/components/AppointmentModal";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { format, parse, isAfter, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();
  const [modalInitialTime, setModalInitialTime] = useState<string | undefined>();
  
  const { appointments } = useData();

  // Filtrar y ordenar las próximas citas
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    
    return appointments
      .filter(appointment => {
        // Parseamos la fecha y hora de la cita
        const appointmentDate = parseISO(appointment.date);
        const [hours, minutes] = appointment.time.split(':').map(Number);
        const appointmentDateTime = new Date(appointmentDate);
        appointmentDateTime.setHours(hours, minutes, 0, 0);
        
        // Solo incluir citas futuras y con estado 'scheduled'
        return isAfter(appointmentDateTime, now) && appointment.status === 'scheduled';
      })
      .sort((a, b) => {
        // Ordenar por fecha y hora
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        const [hoursA, minutesA] = a.time.split(':').map(Number);
        const [hoursB, minutesB] = b.time.split(':').map(Number);
        
        dateA.setHours(hoursA, minutesA, 0, 0);
        dateB.setHours(hoursB, minutesB, 0, 0);
        
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5); // Mostrar solo las próximas 5 citas
  }, [appointments]);

  const handleTimeSlotClick = (date: Date, time: string) => {
    setModalInitialDate(date);
    setModalInitialTime(time);
    setAppointmentModalOpen(true);
  };

  const handleNewAppointmentClick = () => {
    setModalInitialDate(undefined);
    setModalInitialTime(undefined);
    setAppointmentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda de Citas</h1>
            <p className="text-gray-600">Gestiona tus citas y horarios</p>
          </div>
          <Button 
            onClick={handleNewAppointmentClick}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>

        {/* Layout Principal */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Columna Izquierda - Calendario y Próximas Citas */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mini Calendario */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <CalendarIcon className="inline-block h-5 w-5 mr-2 text-primary" />
                  Calendario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MiniCalendar 
                  selectedDate={selectedDate} 
                  onDateSelect={setSelectedDate} 
                />
              </CardContent>
            </Card>

            {/* Próximas Citas */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Próximas Citas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay citas próximas</p>
                  </div>
                ) : (
                  upcomingAppointments.map((appt) => (
                    <div 
                      key={appt.id} 
                      className="p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        // Aquí podrías abrir un modal con los detalles de la cita
                        console.log('Cita seleccionada:', appt);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">{appt.time}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {appt.status === 'scheduled' ? 'Programada' : 
                               appt.status === 'completed' ? 'Completada' : 'Cancelada'}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">{appt.patientName}</p>
                          <p className="text-sm text-gray-500">{appt.type}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(parseISO(appt.date), "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendario Semanal */}
          <div className="lg:col-span-3">
            <Card className="border border-gray-100 shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Vista Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyCalendar 
                  selectedDate={selectedDate} 
                  onDateChange={setSelectedDate}
                  onTimeSlotClick={handleTimeSlotClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Nueva Cita */}
      <AppointmentModal 
        open={appointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
        initialDate={modalInitialDate}
        initialTime={modalInitialTime}
      />
    </div>
  );
}
