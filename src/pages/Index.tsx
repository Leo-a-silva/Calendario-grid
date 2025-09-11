
import { CalendarDays, Clock, User, Stethoscope, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { AddPatientModal } from "@/components/AddPatientModal";
import { useData } from "@/contexts/DataContext";

const Index = () => {
  const navigate = useNavigate();
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const { patients, appointments } = useData();
  
  // Calcular estadísticas reales
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);
    
    // Próxima cita de hoy
    const nextAppointment = todayAppointments
      .filter(apt => apt.status === 'scheduled')
      .sort((a, b) => a.time.localeCompare(b.time))[0];
    
    // Nuevos pacientes este mes
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newPatientsThisMonth = patients.filter(patient => {
      if (!patient.fechaNacimiento) return false;
      const patientDate = new Date(patient.fechaNacimiento);
      return patientDate.getMonth() === currentMonth && patientDate.getFullYear() === currentYear;
    }).length;
    
    // Tratamientos activos (citas programadas)
    const activeTreatments = appointments.filter(apt => apt.status === 'scheduled').length;
    
    return [
      { 
        title: "Citas Hoy", 
        value: todayAppointments.length.toString(), 
        icon: CalendarDays, 
        trend: todayAppointments.length > 0 ? `+${todayAppointments.length}` : "",
        description: "Citas programadas para hoy",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        valueColor: "text-blue-900"
      },
      { 
        title: "Próxima Cita", 
        value: nextAppointment ? nextAppointment.time : "Sin citas", 
        icon: Clock, 
        trend: "",
        description: "Siguiente cita programada",
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
        valueColor: "text-emerald-900"
      },
      { 
        title: "Nuevos Pacientes", 
        value: newPatientsThisMonth.toString(), 
        icon: User, 
        trend: newPatientsThisMonth > 0 ? `+${newPatientsThisMonth}` : "",
        description: "Nuevos pacientes este mes",
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
        valueColor: "text-amber-900"
      },
      { 
        title: "Tratamientos Activos", 
        value: activeTreatments.toString(), 
        icon: Stethoscope, 
        trend: "",
        description: "Tratamientos en curso",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
        valueColor: "text-purple-900"
      },
    ];
  }, [patients, appointments]);

  // Estadísticas adicionales calculadas
  const additionalStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const appointmentsThisMonth = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
    }).length;
    
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    
    return [
      { 
        title: "Pacientes Totales", 
        value: patients.length.toString(), 
        icon: User,
        bgColor: "bg-sky-50",
        iconColor: "text-sky-600"
      },
      { 
        title: "Citas del Mes", 
        value: appointmentsThisMonth.toString(), 
        icon: CalendarIcon,
        bgColor: "bg-rose-50",
        iconColor: "text-rose-600"
      },
      { 
        title: "Ingresos Mensuales", 
        value: `$${(appointmentsThisMonth * 150).toLocaleString()}`, 
        icon: "$",
        bgColor: "bg-green-50",
        iconColor: "text-green-600"
      },
      { 
        title: "Tratamientos Completados", 
        value: completedAppointments.toString(), 
        icon: Stethoscope,
        bgColor: "bg-indigo-50",
        iconColor: "text-indigo-600"
      },
    ];
  }, [patients, appointments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Welcome Message */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Buenos días, Dr.</h1>
          <p className="text-gray-600">Aquí tienes un resumen de tu consultorio.</p>
        </div>

        {/* Sección de Acceso Rápido */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Resumen del Día</h2>
              <p className="text-sm text-gray-500">Vista general de tu consultorio</p>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 font-medium shadow-sm flex items-center transition-colors"
              onClick={() => navigate('/agenda')}
            >
              Ver agenda <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className={`${stat.bgColor} rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-100`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor.replace('50', '100')}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
                {stat.trend && (
                  <div className="flex items-center justify-between pt-3 border-t border-white/50">
                    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-white/50 text-green-700">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {stat.trend} desde ayer
                    </span>
                    <p className="text-xs text-gray-600">
                      {stat.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas Adicionales */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Resumen Mensual */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Resumen General</h2>
              <p className="text-sm text-gray-500">Métricas clave de tu consultorio</p>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {additionalStats.map((stat, i) => (
                <div key={i} className={`${stat.bgColor} rounded-xl p-4 sm:p-5 transition-all duration-200`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1 truncate">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bgColor.replace('50', '100')} flex-shrink-0 ml-2`}>
                      {typeof stat.icon === 'string' ? (
                        <span className={`text-lg font-bold ${stat.iconColor}`}>{stat.icon}</span>
                      ) : (
                        <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próximas Acciones */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-14"
                onClick={() => setIsAddPatientModalOpen(true)}
              >
                <User className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Agregar Nuevo Paciente</p>
                  <p className="text-xs text-gray-500">Registrar información del paciente</p>
                </div>
              </Button>
              <AddPatientModal 
                open={isAddPatientModalOpen} 
                onOpenChange={setIsAddPatientModalOpen} 
              />
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-14"
                onClick={() => navigate('/agenda/nueva-cita')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Nueva Cita</p>
                  <p className="text-xs text-gray-500">Programar una nueva cita</p>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left h-14"
                onClick={() => navigate('/tratamientos')}
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                <div className="text-left">
                  <p className="font-medium">Ver Tratamientos</p>
                  <p className="text-xs text-gray-500">Gestionar tratamientos en curso</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
