
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building, Clock, Bell, Users, Mail, Phone } from "lucide-react";

const Settings = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-gray-900">Configuración</h1>
        </div>
      </header>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl space-y-6">
          {/* Información del consultorio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Información del Consultorio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clinic-name">Nombre del Consultorio</Label>
                  <Input id="clinic-name" defaultValue="Consultorio Dental DentiApp" />
                </div>
                <div>
                  <Label htmlFor="clinic-phone">Teléfono</Label>
                  <Input id="clinic-phone" defaultValue="+54 11 1234-5678" />
                </div>
                <div>
                  <Label htmlFor="clinic-email">Email</Label>
                  <Input id="clinic-email" defaultValue="info@dentiapp.com" />
                </div>
                <div>
                  <Label htmlFor="clinic-address">Dirección</Label>
                  <Input id="clinic-address" defaultValue="Av. Corrientes 1234, CABA" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horarios de atención */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horarios de Atención
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Hora de inicio</Label>
                  <Input type="time" id="start-time" defaultValue="08:00" />
                </div>
                <div>
                  <Label htmlFor="end-time">Hora de cierre</Label>
                  <Input type="time" id="end-time" defaultValue="18:00" />
                </div>
              </div>
              <div>
                <Label htmlFor="slot-duration">Duración de turnos (minutos)</Label>
                <Input type="number" id="slot-duration" defaultValue="30" />
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recordatorios por email</Label>
                  <p className="text-sm text-gray-600">Enviar recordatorios a pacientes 24h antes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recordatorios por SMS</Label>
                  <p className="text-sm text-gray-600">Enviar SMS de confirmación</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones de cancelación</Label>
                  <p className="text-sm text-gray-600">Alertar cuando un paciente cancele</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button>Guardar cambios</Button>
            <Button variant="outline">Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
