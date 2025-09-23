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
  FormDescription,
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
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusCircle, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const { addPatient } = useData();
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
    try {
      const newPatient = addPatient({
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        numeroHistoriaClinica: data.numeroHistoriaClinica,
        telefono: data.telefono,
        email: data.email,
        fechaNacimiento: data.fechaNacimiento,
      });
      
      toast({
        title: "Paciente agregado",
        description: `${newPatient.nombre} ${newPatient.apellido} ha sido agregado exitosamente.`,
      });
      
      form.reset();
      setShowObraSocialFields(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el paciente. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleCoberturaChange = (value: string) => {
    setShowObraSocialFields(value === "obra_social");
    form.setValue("cobertura", value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Nuevo Paciente
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
              <FormField
                control={form.control}
                name="nombre"
                rules={{ required: "El nombre es requerido" }}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium text-gray-700">Nombre</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ingrese el nombre" 
                        {...field} 
                        className="h-10 focus-visible:ring-primary/50 border-gray-300 focus:border-primary/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                rules={{ required: "El apellido es requerido" }}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium text-gray-700">Apellido</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ingrese el apellido" 
                        {...field} 
                        className="h-10 focus-visible:ring-primary/50 border-gray-300 focus:border-primary/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
  control={form.control}
  name="fechaNacimiento"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium text-gray-700">
        Fecha de Nacimiento
      </FormLabel>
      <FormControl>
        <Input
          type="date"
          {...field}
          className="w-full h-10 px-3 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
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

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Guardar Paciente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};