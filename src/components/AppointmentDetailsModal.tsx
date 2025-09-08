import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, Trash2, Calendar, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Appointment, useData } from "@/contexts/DataContext";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export function AppointmentDetailsModal({ isOpen, onClose, appointment }: AppointmentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState<Partial<Appointment>>({});
  const { updateAppointment, deleteAppointment } = useData();
  const { toast } = useToast();

  if (!appointment) return null;

  const handleEdit = () => {
    setEditedAppointment(appointment);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedAppointment.date && editedAppointment.time && editedAppointment.type) {
      updateAppointment(appointment.id, editedAppointment);
      toast({
        title: "Turno actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
      setIsEditing(false);
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm("¿Está seguro que desea eliminar este turno?")) {
      deleteAppointment(appointment.id);
      toast({
        title: "Turno eliminado",
        description: "El turno se ha eliminado correctamente.",
        variant: "destructive",
      });
      onClose();
    }
  };

  const appointmentDate = new Date(appointment.date);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? "Editar Turno" : "Detalles del Turno"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isEditing ? (
            // View mode
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">DNI: {appointment.patientDni}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {format(appointmentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Tipo de consulta</p>
                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Estado</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status === 'scheduled' ? 'Programado' :
                     appointment.status === 'completed' ? 'Completado' : 'Cancelado'}
                  </span>
                </div>
                
                {appointment.notes && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Notas</p>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleEdit} className="flex-1" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button onClick={handleDelete} variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </>
          ) : (
            // Edit mode
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-date">Fecha</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editedAppointment.date || appointment.date}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-time">Hora</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={editedAppointment.time || appointment.time}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, time: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-type">Tipo de consulta</Label>
                  <Input
                    id="edit-type"
                    value={editedAppointment.type || appointment.type}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, type: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select 
                    value={editedAppointment.status || appointment.status}
                    onValueChange={(value: 'scheduled' | 'completed' | 'canceled') => 
                      setEditedAppointment({ ...editedAppointment, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Programado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="canceled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-notes">Notas</Label>
                  <Textarea
                    id="edit-notes"
                    value={editedAppointment.notes || appointment.notes || ''}
                    onChange={(e) => setEditedAppointment({ ...editedAppointment, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Guardar Cambios
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}