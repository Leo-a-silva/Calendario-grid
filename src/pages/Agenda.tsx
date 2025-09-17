import { useState } from "react";
import { MiniCalendar } from "@/components/MiniCalendar";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { AppointmentModal } from "@/components/AppointmentModal";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>();
  const [modalInitialTime, setModalInitialTime] = useState<string | undefined>();

  // Próximas citas de ejemplo
  const upcomingAppointments = [
    { id: 1, time: "09:00 AM", patient: "María González", procedure: "Limpieza dental" },
    { id: 2, time: "10:30 AM", patient: "Carlos López", procedure: "Consulta de ortodoncia" },
    { id: 3, time: "11:15 AM", patient: "Ana Martínez", procedure: "Extracción" },
    { id: 4, time: "02:00 PM", patient: "Juan Pérez", procedure: "Blanqueamiento" },
    { id: 5, time: "03:30 PM", patient: "Laura Sánchez", procedure: "Revisión" },
  ];

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
                {upcomingAppointments.map((appt) => (
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
                            Confirmada
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-1">{appt.patient}</p>
                        <p className="text-sm text-gray-500">{appt.procedure}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
