import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search, List, Eye, User, FileText, CreditCard, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddPatientModal } from "@/components/AddPatientModal";
import { useData } from "@/contexts/DataContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Pacientes = () => {
  const navigate = useNavigate();
  const { patients } = useData();
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [showPatientsList, setShowPatientsList] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(patient =>
    patient.dni.includes(searchTerm) || 
    `${patient.nombre} ${patient.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.numeroHistoriaClinica.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Gestión de Pacientes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra la información de los pacientes de la clínica
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowPatientsList(!showPatientsList)}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            {showPatientsList ? "Ocultar listado" : "Mostrar listado"}
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            onClick={() => setAddPatientModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Nuevo Paciente
          </Button>
        </div>
      </div>

      {showPatientsList && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Pacientes Registrados
                </CardTitle>
                <CardDescription>
                  Lista de todos los pacientes en el sistema
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, DNI o HC..."
                  className="w-full pl-8 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Paciente</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Historia Clínica</TableHead>
                    <TableHead className="w-[100px] text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{patient.nombre} {patient.apellido}</p>
                              <p className="text-xs text-muted-foreground">ID: {patient.id.toString().padStart(4, '0')}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {patient.dni.replace(/(\d{2})(?=\d)/g, '$1.')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{patient.numeroHistoriaClinica}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              onClick={() => navigate(`/odontograma/${patient.id}`)}
                              title="Ver ficha clínica"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                              title="Ver historial"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        {searchTerm ? (
                          <div className="flex flex-col items-center justify-center py-6">
                            <Search className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No se encontraron pacientes que coincidan con la búsqueda</p>
                            <Button 
                              variant="ghost" 
                              className="mt-2"
                              onClick={() => setSearchTerm('')}
                            >
                              Limpiar búsqueda
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <User className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No hay pacientes registrados</p>
                            <Button 
                              className="mt-2"
                              onClick={() => setAddPatientModalOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar paciente
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!showPatientsList && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Nuevo Paciente
              </CardTitle>
              <CardDescription>
                Registra un nuevo paciente en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
                onClick={() => setAddPatientModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar paciente
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Búsqueda Avanzada
              </CardTitle>
              <CardDescription>
                Busca pacientes por diferentes criterios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dni" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="dni">Por DNI</TabsTrigger>
                  <TabsTrigger value="historia">Por Historia Clínica</TabsTrigger>
                </TabsList>
                <TabsContent value="dni" className="pt-4">
                  <div className="space-y-3">
                    <Input 
                      placeholder="Ingrese el DNI"
                      className="w-full"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Buscar por DNI
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="historia" className="pt-4">
                  <div className="space-y-3">
                    <Input 
                      placeholder="Ingrese el N° de Historia Clínica"
                      className="w-full"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Buscar por HC
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      <AddPatientModal 
        open={addPatientModalOpen}
        onOpenChange={setAddPatientModalOpen}
      />
    </div>
  );
};

export default Pacientes;