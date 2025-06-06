
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, DollarSign } from "lucide-react";

const specialties = [
  { id: 1, name: "Consulta General", duration: "30 min", price: "$2000", color: "bg-blue-100 text-blue-800" },
  { id: 2, name: "Limpieza Dental", duration: "45 min", price: "$3000", color: "bg-green-100 text-green-800" },
  { id: 3, name: "Ortodoncia", duration: "60 min", price: "$5000", color: "bg-purple-100 text-purple-800" },
  { id: 4, name: "Endodoncia", duration: "90 min", price: "$8000", color: "bg-orange-100 text-orange-800" },
  { id: 5, name: "Implantología", duration: "120 min", price: "$15000", color: "bg-red-100 text-red-800" },
  { id: 6, name: "Blanqueamiento", duration: "60 min", price: "$4000", color: "bg-yellow-100 text-yellow-800" },
];

const Specialties = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-gray-900">Especialidades</h1>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva especialidad
          </Button>
        </div>
      </header>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => (
            <Card key={specialty.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{specialty.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${specialty.color}`}>
                    Activo
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Duración: {specialty.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Precio: {specialty.price}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      Editar especialidad
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

export default Specialties;
