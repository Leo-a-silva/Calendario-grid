import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  User, 
  Building2, 
  Clock, 
  Bell, 
  Palette, 
  Shield, 
  Save,
  Plus,
  X
} from 'lucide-react';

const SPECIALTIES = [
  'Odontología',
  'Medicina General',
  'Nutrición',
  'Psicología',
  'Fisioterapia',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Ginecología',
  'Neurología',
  'Traumatología',
  'Oftalmología',
  'Otorrinolaringología',
  'Otro'
];

const WORK_DAYS = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' }
];

const Configuracion = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // Profile settings
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    specialty: user?.specialty || '',
    customSpecialty: '',
    professionalLicense: user?.professionalLicense || '',
    clinicName: user?.clinicName || ''
  });

  // Clinic settings
  const [clinicData, setClinicData] = useState({
    address: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });

  // Schedule settings
  const [scheduleData, setScheduleData] = useState({
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '08:00',
    endTime: '18:00',
    appointmentDuration: 30,
    breakStart: '12:00',
    breakEnd: '13:00'
  });

  // Notification settings
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    newPatientAlerts: true,
    systemUpdates: false
  });

  // Quick templates for common procedures
  const [templates, setTemplates] = useState<string[]>([
    'Consulta general',
    'Control rutinario',
    'Seguimiento'
  ]);
  const [newTemplate, setNewTemplate] = useState('');

  const handleSaveProfile = () => {
    const finalSpecialty = profileData.specialty === 'Otro' 
      ? profileData.customSpecialty 
      : profileData.specialty;

    updateUser({
      username: profileData.username,
      email: profileData.email,
      specialty: finalSpecialty,
      professionalLicense: profileData.professionalLicense,
      clinicName: profileData.clinicName
    });

    toast({
      title: "Perfil actualizado",
      description: "Los cambios se han guardado correctamente."
    });
  };

  const handleSaveClinic = () => {
    // Here you would save clinic data to localStorage or API
    localStorage.setItem('clinicData', JSON.stringify(clinicData));
    toast({
      title: "Configuración de clínica guardada",
      description: "Los datos del consultorio se han actualizado."
    });
  };

  const handleSaveSchedule = () => {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    toast({
      title: "Horarios actualizados",
      description: "La configuración de horarios se ha guardado."
    });
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationData', JSON.stringify(notificationData));
    toast({
      title: "Notificaciones configuradas",
      description: "Las preferencias de notificación se han guardado."
    });
  };

  const addTemplate = () => {
    if (newTemplate.trim()) {
      setTemplates([...templates, newTemplate.trim()]);
      setNewTemplate('');
    }
  };

  const removeTemplate = (index: number) => {
    setTemplates(templates.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Gestiona la configuración de tu consultorio</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="clinic" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Consultorio
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horarios
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Plantillas
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specialty">Especialidad</Label>
                <Select
                  value={profileData.specialty}
                  onValueChange={(value) => setProfileData({...profileData, specialty: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {profileData.specialty === 'Otro' && (
                <div>
                  <Label htmlFor="customSpecialty">Especifica tu especialidad</Label>
                  <Input
                    id="customSpecialty"
                    value={profileData.customSpecialty}
                    onChange={(e) => setProfileData({...profileData, customSpecialty: e.target.value})}
                    placeholder="Escribe tu especialidad"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="license">Matrícula profesional</Label>
                  <Input
                    id="license"
                    value={profileData.professionalLicense}
                    onChange={(e) => setProfileData({...profileData, professionalLicense: e.target.value})}
                    placeholder="Número de matrícula"
                  />
                </div>
                <div>
                  <Label htmlFor="clinicName">Nombre del consultorio</Label>
                  <Input
                    id="clinicName"
                    value={profileData.clinicName}
                    onChange={(e) => setProfileData({...profileData, clinicName: e.target.value})}
                    placeholder="Nombre de tu consultorio"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar perfil
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinic Tab */}
        <TabsContent value="clinic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Consultorio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={clinicData.address}
                  onChange={(e) => setClinicData({...clinicData, address: e.target.value})}
                  placeholder="Dirección completa del consultorio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={clinicData.phone}
                    onChange={(e) => setClinicData({...clinicData, phone: e.target.value})}
                    placeholder="Número de teléfono"
                  />
                </div>
                <div>
                  <Label htmlFor="clinicEmail">Email del consultorio</Label>
                  <Input
                    id="clinicEmail"
                    type="email"
                    value={clinicData.email}
                    onChange={(e) => setClinicData({...clinicData, email: e.target.value})}
                    placeholder="email@consultorio.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Sitio web</Label>
                <Input
                  id="website"
                  value={clinicData.website}
                  onChange={(e) => setClinicData({...clinicData, website: e.target.value})}
                  placeholder="www.tusitio.com"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={clinicData.description}
                  onChange={(e) => setClinicData({...clinicData, description: e.target.value})}
                  placeholder="Describe tu consultorio y servicios"
                />
              </div>

              <Button onClick={handleSaveClinic} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Horarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Días de trabajo</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {WORK_DAYS.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Switch
                        id={day.id}
                        checked={scheduleData.workDays.includes(day.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setScheduleData({
                              ...scheduleData,
                              workDays: [...scheduleData.workDays, day.id]
                            });
                          } else {
                            setScheduleData({
                              ...scheduleData,
                              workDays: scheduleData.workDays.filter(d => d !== day.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Hora de inicio</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={scheduleData.startTime}
                    onChange={(e) => setScheduleData({...scheduleData, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Hora de fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={scheduleData.endTime}
                    onChange={(e) => setScheduleData({...scheduleData, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duración de cita (min)</Label>
                  <Select
                    value={scheduleData.appointmentDuration.toString()}
                    onValueChange={(value) => setScheduleData({...scheduleData, appointmentDuration: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="breakStart">Inicio de descanso</Label>
                  <Input
                    id="breakStart"
                    type="time"
                    value={scheduleData.breakStart}
                    onChange={(e) => setScheduleData({...scheduleData, breakStart: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="breakEnd">Fin de descanso</Label>
                  <Input
                    id="breakEnd"
                    type="time"
                    value={scheduleData.breakEnd}
                    onChange={(e) => setScheduleData({...scheduleData, breakEnd: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSchedule} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar horarios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones por email</Label>
                  <p className="text-sm text-gray-500">Recibir notificaciones en tu email</p>
                </div>
                <Switch
                  checked={notificationData.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationData({...notificationData, emailNotifications: checked})
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Recordatorios de citas</Label>
                  <p className="text-sm text-gray-500">Notificar sobre próximas citas</p>
                </div>
                <Switch
                  checked={notificationData.appointmentReminders}
                  onCheckedChange={(checked) => 
                    setNotificationData({...notificationData, appointmentReminders: checked})
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Alertas de nuevos pacientes</Label>
                  <p className="text-sm text-gray-500">Notificar cuando se registre un nuevo paciente</p>
                </div>
                <Switch
                  checked={notificationData.newPatientAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationData({...notificationData, newPatientAlerts: checked})
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Actualizaciones del sistema</Label>
                  <p className="text-sm text-gray-500">Recibir información sobre nuevas funciones</p>
                </div>
                <Switch
                  checked={notificationData.systemUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationData({...notificationData, systemUpdates: checked})
                  }
                />
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Guardar notificaciones
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plantillas de Procedimientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Plantillas actuales</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {templates.map((template, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {template}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTemplate(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Nueva plantilla de procedimiento"
                  onKeyPress={(e) => e.key === 'Enter' && addTemplate()}
                />
                <Button onClick={addTemplate} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                Las plantillas te ayudan a crear registros médicos más rápido con procedimientos comunes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracion;