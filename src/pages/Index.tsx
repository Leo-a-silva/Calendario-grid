
import { CalendarDays, Clock, User, Stethoscope, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AddPatientModal } from "@/components/AddPatientModal";

const Index = () => {
  const navigate = useNavigate();
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  
  // Datos de ejemplo para las estadísticas
  const stats = [
    { 
      title: "Citas Hoy", 
      value: "8", 
      icon: CalendarDays, 
      trend: "+2",
      description: "Citas programadas para hoy"
    },
    { 
      title: "Próxima Cita", 
      value: "10:30 AM", 
      icon: Clock, 
      trend: "",
      description: "Siguiente cita programada"
    },
    { 
      title: "Nuevos Pacientes", 
      value: "3", 
      icon: User, 
      trend: "+1",
      description: "Nuevos pacientes este mes"
    },
    { 
      title: "Tratamientos Activos", 
      value: "5", 
      icon: Stethoscope, 
      trend: "",
      description: "Tratamientos en curso"
    },
  ];

  // Estadísticas adicionales
  const additionalStats = [
    { title: "Pacientes Totales", value: "124", icon: User },
    { title: "Citas del Mes", value: "68", icon: CalendarIcon },
    { title: "Ingresos Mensuales", value: "$12,450", icon: "$" },
    { title: "Procedimientos Realizados", value: "42", icon: Stethoscope },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Welcome Message */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Buenos días, Dr.</h1>
          <p className="text-gray-600">Aquí tienes un resumen de tu consultorio odontológico.</p>
        </div>

        {/* Sección de Acceso Rápido */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Acceso Rápido</h2>
            <Button 
              variant="outline" 
              className="border-primary/70 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary hover:text-primary font-medium shadow-sm"
              onClick={() => navigate('/agenda')}
            >
              Ir a Agenda Completa <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Card key={i} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  {stat.trend && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-green-500">
                        {stat.trend} desde ayer
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Estadísticas Adicionales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* Resumen Mensual */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Resumen Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {additionalStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {typeof stat.icon === 'string' ? (
                          <span className="text-primary font-medium">{stat.icon}</span>
                        ) : (
                          <stat.icon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
