
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Phone, Mail, Calendar } from "lucide-react";

const samplePatients = [
  { id: 1, name: "Juan Pérez", email: "juan@email.com", phone: "123-456-789", lastVisit: "2024-01-15", nextVisit: "2024-02-15" },
  { id: 2, name: "María López", email: "maria@email.com", phone: "987-654-321", lastVisit: "2024-01-10", nextVisit: "2024-02-10" },
  { id: 3, name: "Carlos Ruiz", email: "carlos@email.com", phone: "555-123-456", lastVisit: "2024-01-20", nextVisit: "2024-02-20" },
];

const Patients = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-gray-900">Pacientes</h1>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo paciente
          </Button>
        </div>
      </header>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Buscar pacientes..." 
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {samplePatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3" />
                      Última visita: {patient.lastVisit}
                    </div>
                    <div className="text-primary font-medium">
                      Próxima: {patient.nextVisit}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
