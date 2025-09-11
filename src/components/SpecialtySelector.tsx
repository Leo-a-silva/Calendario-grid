import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SPECIALTIES = [
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Endocrinología',
  'Gastroenterología',
  'Ginecología',
  'Neurología',
  'Nutrición',
  'Odontología',
  'Oftalmología',
  'Otorrinolaringología',
  'Pediatría',
  'Psicología',
  'Psiquiatría',
  'Traumatología',
  'Urología',
  'Otra'
];

export const SpecialtySelector = () => {
  const { user, updateUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [license, setLicense] = useState(user?.professionalLicense || '');
  const [clinicName, setClinicName] = useState(user?.clinicName || '');
  const [customSpecialty, setCustomSpecialty] = useState('');

  const handleSave = () => {
    const finalSpecialty = specialty === 'Otra' ? customSpecialty : specialty;
    
    if (updateUser) {
      updateUser({
        specialty: finalSpecialty,
        professionalLicense: license,
        clinicName: clinicName
      });
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar Especialidad
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración Profesional</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidad</Label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu especialidad" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {specialty === 'Otra' && (
            <div className="space-y-2">
              <Label htmlFor="custom-specialty">Especialidad personalizada</Label>
              <Input
                id="custom-specialty"
                value={customSpecialty}
                onChange={(e) => setCustomSpecialty(e.target.value)}
                placeholder="Ingresa tu especialidad"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="license">Matrícula Profesional</Label>
            <Input
              id="license"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="Ej: MP 12345"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinic">Nombre del Consultorio</Label>
            <Input
              id="clinic"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Ej: Consultorio Dr. García"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};