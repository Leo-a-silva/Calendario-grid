
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, Users, Percent } from "lucide-react";

const insuranceProviders = [
  { 
    id: 1, 
    name: "OSDE", 
    coverage: "80%", 
    patients: 45, 
    status: "active",
    plan: "Plan 210"
  },
  { 
    id: 2, 
    name: "Swiss Medical", 
    coverage: "75%", 
    patients: 32, 
    status: "active",
    plan: "SMG 1"
  },
  { 
    id: 3, 
    name: "Galeno", 
    coverage: "70%", 
    patients: 28, 
    status: "active",
    plan: "Plan Azul"
  },
  { 
    id: 4, 
    name: "Medicus", 
    coverage: "85%", 
    patients: 19, 
    status: "pending",
    plan: "Plan Oro"
  },
];

const Insurance = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-gray-900">Obras Sociales</h1>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Agregar obra social
          </Button>
        </div>
      </header>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insuranceProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>{provider.name}</span>
                  </div>
                  <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
                    {provider.status === 'active' ? 'Activo' : 'Pendiente'}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">{provider.plan}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Percent className="w-4 h-4" />
                      <span className="text-sm">Cobertura</span>
                    </div>
                    <span className="font-semibold text-green-600">{provider.coverage}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Pacientes</span>
                    </div>
                    <span className="font-semibold">{provider.patients}</span>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver detalles
                    </Button>
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

export default Insurance;
