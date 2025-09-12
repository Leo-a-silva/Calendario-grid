import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Calendar, FileText, Pill, Activity, Smile } from 'lucide-react';
import { useData, Patient } from '@/contexts/DataContext';
import { useMedical, MedicalRecord } from '@/contexts/MedicalContext';
import { useAuth } from '@/contexts/AuthContext';
import { MedicalRecordModal } from '@/components/MedicalRecordModal';
import { OdontogramaChart } from '@/components/OdontogramaChart';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients } = useData();
  const { getPatientMedicalHistory, getPatientPrescriptions } = useMedical();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPatient = patients.find(p => p.id === parseInt(id));
      if (foundPatient) {
        setPatient(foundPatient);
        const records = getPatientMedicalHistory(foundPatient.id);
        setMedicalRecords(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    }
  }, [id, patients, getPatientMedicalHistory]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Paciente no encontrado</p>
      </div>
    );
  }

  const getRecordTypeColor = (type: MedicalRecord['type']) => {
    const colors = {
      consultation: 'bg-blue-100 text-blue-800',
      prescription: 'bg-green-100 text-green-800',
      lab_result: 'bg-purple-100 text-purple-800',
      evolution: 'bg-orange-100 text-orange-800',
      treatment_plan: 'bg-cyan-100 text-cyan-800'
    };
    return colors[type];
  };

  const getRecordTypeLabel = (type: MedicalRecord['type']) => {
    const labels = {
      consultation: 'Consulta',
      prescription: 'Receta',
      lab_result: 'Laboratorio',
      evolution: 'Evolución',
      treatment_plan: 'Tratamiento'
    };
    return labels[type];
  };

  const isDentist = user?.specialty?.toLowerCase().includes('odont') || user?.specialty?.toLowerCase().includes('dent');
  const tabsCount = isDentist ? 4 : 3;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/pacientes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.nombre} {patient.apellido}
          </h1>
          <p className="text-gray-500">DNI: {patient.dni} • HC: {patient.numeroHistoriaClinica}</p>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className={`grid w-full grid-cols-${tabsCount}`}>
          <TabsTrigger value="info">Información Personal</TabsTrigger>
          <TabsTrigger value="history">Historial Médico</TabsTrigger>
          {isDentist && <TabsTrigger value="odontogram">Odontograma</TabsTrigger>}
          <TabsTrigger value="appointments">Citas</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                <p className="text-base">{patient.nombre} {patient.apellido}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">DNI</p>
                <p className="text-base">{patient.dni}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-base">{patient.telefono || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{patient.email || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de nacimiento</p>
                <p className="text-base">{patient.fechaNacimiento || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sexo</p>
                <p className="text-base">{patient.sexo || 'No especificado'}</p>
              </div>
              {patient.direccion && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p className="text-base">{patient.direccion}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información médica adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información Médica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.alergias && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Alergias</p>
                  <p className="text-base">{patient.alergias}</p>
                </div>
              )}
              {patient.medicamentosActuales && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Medicamentos Actuales</p>
                  <p className="text-base">{patient.medicamentosActuales}</p>
                </div>
              )}
              {patient.antecedentesPersonales && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Antecedentes Personales</p>
                  <p className="text-base">{patient.antecedentesPersonales}</p>
                </div>
              )}
              {patient.antecedentesFamiliares && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Antecedentes Familiares</p>
                  <p className="text-base">{patient.antecedentesFamiliares}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Historial Médico</h2>
            <Button onClick={() => setIsRecordModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Registro
            </Button>
          </div>

          <div className="space-y-4">
            {medicalRecords.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay registros médicos</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setIsRecordModalOpen(true)}
                    >
                      Crear primer registro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              medicalRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getRecordTypeColor(record.type)}>
                          {getRecordTypeLabel(record.type)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">por {record.createdBy}</span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2">{record.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{record.description}</p>
                    
                    {record.diagnosis && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                        <p className="text-sm text-gray-600">{record.diagnosis}</p>
                      </div>
                    )}
                    
                    {record.vitalSigns && Object.keys(record.vitalSigns).length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Signos vitales:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {record.vitalSigns.weight && (
                            <span className="bg-gray-100 px-2 py-1 rounded">Peso: {record.vitalSigns.weight}kg</span>
                          )}
                          {record.vitalSigns.bloodPressure && (
                            <span className="bg-gray-100 px-2 py-1 rounded">PA: {record.vitalSigns.bloodPressure}</span>
                          )}
                          {record.vitalSigns.heartRate && (
                            <span className="bg-gray-100 px-2 py-1 rounded">FC: {record.vitalSigns.heartRate}lpm</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {record.medications && record.medications.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Medicamentos:</p>
                        <div className="space-y-1">
                          {record.medications.map((med) => (
                            <div key={med.id} className="text-xs bg-green-50 p-2 rounded">
                              <span className="font-medium">{med.name}</span> - {med.dosage} - {med.frequency}
                              {med.duration && <span> por {med.duration}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Notas:</span> {record.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {isDentist && (
          <TabsContent value="odontogram" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Odontograma</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <OdontogramaChart denticionType="permanente" pacienteId={patient.id} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="appointments">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Próximamente: Gestión de citas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MedicalRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        patientId={patient.id}
        patientName={`${patient.nombre} ${patient.apellido}`}
      />
    </div>
  );
};

export default PatientDetail;