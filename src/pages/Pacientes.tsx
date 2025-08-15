import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddPatientModal } from "@/components/AddPatientModal";

const Pacientes = () => {
  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Lista de pacientes</h1>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Agregar nuevo paciente</h2>
          
          <Button 
            className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setAddPatientModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar paciente
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Búsqueda de pacientes por datos específicos</h2>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Buscar un paciente por DNI
            </label>
            <Input 
              placeholder="DNI"
              className="max-w-lg"
            />
            
            <Button 
              variant="outline" 
              className="w-full max-w-lg"
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