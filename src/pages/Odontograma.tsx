import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OdontogramaChart } from "@/components/OdontogramaChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Stethoscope,
  PlusCircle,
  FilePlus,
  History
} from "lucide-react";

// Mock de datos del paciente (en una aplicación real, esto vendría de una API)
const mockPacientes = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    numeroHistoriaClinica: "HC001",
    fechaNacimiento: "15/05/1985",
    telefono: "+54 9 11 1234-5678",
    email: "juan.perez@email.com",
    direccion: "Av. Siempre Viva 123",
    obraSocial: "OSDE",
    numeroAfiliado: "12345678",
  },
  // Agrega más pacientes según sea necesario
];

const Odontograma = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  const [denticionType, setDenticionType] = useState<'permanente' | 'primaria'>('permanente');
  const [paciente, setPaciente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En una aplicación real, aquí harías una llamada a la API para obtener los datos del paciente
    const fetchPaciente = () => {
      setLoading(true);
      // Simulamos un retraso de red
      setTimeout(() => {
        const pacienteEncontrado = mockPacientes.find(p => p.id.toString() === pacienteId);
        setPaciente(pacienteEncontrado);
        setLoading(false);
      }, 500);
    };

    fetchPaciente();
  }, [pacienteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div>Cargando datos del paciente...</div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Paciente no encontrado</h2>
          <Button onClick={() => navigate('/pacientes')}>
            Volver a la lista de pacientes
          </Button>
        </div>
      </div>
    );
  }

  // Calcular la edad a partir de la fecha de nacimiento
  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const [dia, mes, anio] = fechaNacimiento.split('/').map(Number);
    const fechaNac = new Date(anio, mes - 1, dia);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad > 0 ? `(${edad} años)` : '';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/pacientes')}
              className="h-10 w-10 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Odontograma</h1>
                <Badge variant="outline" className="text-xs sm:text-sm font-medium w-fit">
                  {denticionType === 'permanente' ? 'Dentición Permanente' : 'Dentición Temporal'}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-foreground">{paciente.nombre} {paciente.apellido}</span>
                </div>
                <span className="hidden sm:inline mx-2">•</span>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>HC: {paciente.numeroHistoriaClinica}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="gap-2 text-sm"
              onClick={() => navigate(`/pacientes/${paciente.id}/historia-clinica`)}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historia Clínica</span>
              <span className="sm:hidden">Historia</span>
            </Button>
            <Button 
              className="gap-2 bg-primary hover:bg-primary/90 text-sm"
              onClick={() => navigate(`/pacientes/${paciente.id}/nuevo-tratamiento`)}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Nuevo Tratamiento</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>
        </div>

        {/* Responsive Patient Information Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 text-sm">
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Paciente</p>
                  <p className="font-medium truncate">{paciente.nombre} {paciente.apellido}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Documento</p>
                  <p className="font-mono font-medium">{paciente.dni}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Nacimiento</p>
                  <p className="font-medium text-sm">
                    {paciente.fechaNacimiento} 
                    {paciente.fechaNacimiento && (
                      <span className="text-muted-foreground block sm:inline">
                        {calcularEdad(paciente.fechaNacimiento)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <Stethoscope className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Obra Social</p>
                  <p className="font-medium truncate">{paciente.obraSocial || 'Particular'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-medium truncate">{paciente.telefono || 'No especificado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium truncate">{paciente.email || 'No especificado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="font-medium truncate">{paciente.direccion || 'No especificada'}</p>
                </div>
              </div>
              
              {paciente.obraSocial && (
                <div className="flex items-center gap-2 p-2 md:p-3 rounded-md bg-muted/30">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">N° Afiliado</p>
                    <p className="font-mono font-medium">{paciente.numeroAfiliado || 'No especificado'}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Responsive Dentition Type Selector */}
        <div className="flex justify-center">
          <Tabs 
            value={denticionType} 
            onValueChange={(value) => setDenticionType(value as 'permanente' | 'primaria')}
            className="w-full max-w-md"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="permanente" className="text-xs sm:text-sm">Dentición Permanente</TabsTrigger>
              <TabsTrigger value="primaria" className="text-xs sm:text-sm">Dentición Temporal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Odontogram Section */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Odontograma
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  Visualización del estado dental del paciente
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={denticionType === 'permanente' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDenticionType('permanente')}
                  className="text-xs"
                >
                  Permanente
                </Button>
                <Button 
                  variant={denticionType === 'primaria' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDenticionType('primaria')}
                  className="text-xs"
                >
                  Temporal
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="border rounded-lg p-4 md:p-6 bg-card shadow-inner flex items-center justify-center min-h-[400px]">
              <OdontogramaChart denticionType={denticionType} pacienteId={paciente.id} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default Odontograma;
