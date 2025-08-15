import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PatientFormData {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: string;
  dni: string;
  cobertura: string;
  numeroHistoriaClinica: string;
  telefono: string;
  email: string;
  motivoConsulta: string;
  // Campos para obra social
  nombreTitular?: string;
  apellidoTitular?: string;
  numeroAfiliado?: string;
  nombreObraSocial?: string;
}

interface AddPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPatientModal = ({ open, onOpenChange }: AddPatientModalProps) => {
  const { toast } = useToast();
  const [showObraSocialFields, setShowObraSocialFields] = useState(false);
  
  const form = useForm<PatientFormData>({
    defaultValues: {
      nombre: "",
      apellido: "",
      fechaNacimiento: "",
      sexo: "",
      dni: "",
      cobertura: "",
      numeroHistoriaClinica: "",
      telefono: "",
      email: "",
      motivoConsulta: "",
      nombreTitular: "",
      apellidoTitular: "",
      numeroAfiliado: "",
      nombreObraSocial: "",
    },
  });

  const onSubmit = (data: PatientFormData) => {
    console.log("Datos del paciente:", data);
    toast({
      title: "Paciente agregado",
      description: `${data.nombre} ${data.apellido} ha sido agregado exitosamente.`,
    });
    form.reset();
    setShowObraSocialFields(false);
    onOpenChange(false);
  };

  const handleCoberturaChange = (value: string) => {
    setShowObraSocialFields(value === "obra_social");
    form.setValue("cobertura", value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                rules={{ required: "El nombre es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                rules={{ required: "El apellido es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaNacimiento"
                rules={{ required: "La fecha de nacimiento es requerida" }}
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
                rules={{ required: "El sexo es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sexo" />
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
                name="dni"
                rules={{ required: "El DNI es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input placeholder="DNI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cobertura"
                rules={{ required: "La cobertura es requerida" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cobertura</FormLabel>
                    <Select onValueChange={handleCoberturaChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cobertura" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="particular">Particular</SelectItem>
                        <SelectItem value="obra_social">Obra Social</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroHistoriaClinica"
                rules={{ required: "El número de historia clínica es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Historia Clínica</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de historia clínica" {...field} />
                    </FormControl>
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
                      <Input placeholder="Teléfono" {...field} />
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
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivoConsulta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de la Consulta</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe el motivo de la consulta..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showObraSocialFields && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Datos de Obra Social</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombreTitular"
                    rules={showObraSocialFields ? { required: "El nombre del titular es requerido" } : {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Titular</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del titular" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellidoTitular"
                    rules={showObraSocialFields ? { required: "El apellido del titular es requerido" } : {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido del Titular</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellido del titular" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numeroAfiliado"
                    rules={showObraSocialFields ? { required: "El número de afiliado es requerido" } : {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Afiliado</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de afiliado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nombreObraSocial"
                    rules={showObraSocialFields ? { required: "El nombre de la obra social es requerido" } : {}}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Obra Social</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de la obra social" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Paciente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};