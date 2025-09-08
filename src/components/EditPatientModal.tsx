import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useData, Patient } from '../contexts/DataContext';
import { toast } from 'sonner';

interface PatientFormData {
  nombre: string;
  apellido: string;
  dni: string;
  numeroHistoriaClinica: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  direccion?: string;
  sexo?: string;
}

interface EditPatientModalProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({ 
  patient, 
  open, 
  onOpenChange 
}) => {
  const { updatePatient } = useData();

  const form = useForm<PatientFormData>({
    defaultValues: {
      nombre: '',
      apellido: '',
      dni: '',
      numeroHistoriaClinica: '',
      telefono: '',
      email: '',
      fechaNacimiento: '',
      direccion: '',
      sexo: '',
    },
  });

  useEffect(() => {
    if (patient && open) {
      form.reset({
        nombre: patient.nombre,
        apellido: patient.apellido,
        dni: patient.dni,
        numeroHistoriaClinica: patient.numeroHistoriaClinica,
        telefono: patient.telefono || '',
        email: patient.email || '',
        fechaNacimiento: patient.fechaNacimiento || '',
        direccion: patient.direccion || '',
        sexo: patient.sexo || '',
      });
    }
  }, [patient, open, form]);

  const onSubmit = (data: PatientFormData) => {
    if (!patient) return;
    
    updatePatient(patient.id, data);
    toast.success('Paciente actualizado exitosamente');
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                rules={{ required: 'El nombre es requerido' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                rules={{ required: 'El apellido es requerido' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dni"
                rules={{ required: 'El DNI es requerido' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el DNI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroHistoriaClinica"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° Historia Clínica</FormLabel>
                    <FormControl>
                      <Input placeholder="Se generará automáticamente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaNacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Ingresa el email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa la dirección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Actualizar Paciente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};