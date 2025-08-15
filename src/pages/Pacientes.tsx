import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, List, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddPatientModal } from "@/components/AddPatientModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const mockPatients = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    numeroHistoriaClinica: "HC001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    dni: "23456789",
    numeroHistoriaClinica: "HC002",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    dni: "34567890",
    numeroHistoriaClinica: "HC003",
  },
];

const Pacientes = () => {
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [showPatientsList, setShowPatientsList] = useState(false);

  return (
    <div className="p-6 space-y-8 w-full">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold text-foreground">Lista de pacientes</h1>
        <Button
          variant="outline"
          onClick={() => setShowPatientsList(!showPatientsList)}
          className="flex items-center gap-2"
        >
          <List className="w-4 h-4" />
          {showPatientsList ? "Ocultar listado" : "Listado completo"}
        </Button>
      </div>

      {showPatientsList && (
        <div className="w-full space-y-4">
          <h2 className="text-lg font-medium text-foreground">Pacientes registrados</h2>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre y Apellido</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>N° Historia Clínica</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.nombre} {patient.apellido}
                    </TableCell>
                    <TableCell>{patient.dni}</TableCell>
                    <TableCell>{patient.numeroHistoriaClinica}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Acceder a ficha
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      <div className="space-y-6 w-full">
        
        <div className="space-y-4 w-full">
          <h2 className="text-lg font-medium text-foreground w-full">Agregar nuevo paciente</h2>
          
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setAddPatientModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar paciente
          </Button>
        </div>

        <div className="space-y-4 w-full">
          <h2 className="text-lg font-medium text-foreground w-full">Búsqueda de pacientes por datos específicos</h2>
          
          <div className="space-y-3 w-full">
            <label className="text-sm font-medium text-muted-foreground block w-full">
              Buscar un paciente por DNI
            </label>
            <Input 
              placeholder="DNI"
              className="w-full"
            />
            
            <Button 
              variant="outline" 
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar paciente
            </Button>
          </div>
        </div>
      </div>

      <AddPatientModal 
        open={addPatientModalOpen}
        onOpenChange={setAddPatientModalOpen}
      />
    </div>
  );
};

export default Pacientes;