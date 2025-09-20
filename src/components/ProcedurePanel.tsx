
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Iconos ahora provienen de public/Iconos tratamientos

interface ProcedurePanelProps {
  selectedProcedure: 'diagnostico' | 'limpieza' | 'obturacion' | 'extraccion' | 'endodoncia' | 'corona';
  onProcedureSelect: (procedure: 'diagnostico' | 'limpieza' | 'obturacion' | 'extraccion' | 'endodoncia' | 'corona') => void;
}

export function ProcedurePanel({ selectedProcedure, onProcedureSelect }: ProcedurePanelProps) {
  // Mapa de iconos desde public/Iconos tratamientos
  const iconMap: Record<string, string> = {
    diagnostico: "diagnosticos.svg",
    limpieza: "limpieza.svg",
    obturacion: "obstruccion.svg",
    extraccion: "extraccion.svg",
    endodoncia: "endodoncia.svg",
    corona: "coronas.svg",
  };

  const procedures = [
    { id: 'diagnostico' as const, name: 'Diagnóstico', color: 'bg-blue-500' },
    { id: 'limpieza' as const, name: 'Limpieza', color: 'bg-green-500' },
    { id: 'obturacion' as const, name: 'Obturación', color: 'bg-yellow-500' },
    { id: 'extraccion' as const, name: 'Extracción', color: 'bg-red-500' },
    { id: 'endodoncia' as const, name: 'Endodoncia', color: 'bg-purple-500' },
    { id: 'corona' as const, name: 'Corona', color: 'bg-orange-500' },
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Seleccionar Tratamiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {procedures.map((procedure) => (
            <Button
              key={procedure.id}
              variant={selectedProcedure === procedure.id ? 'default' : 'outline'}
              className={`flex flex-col items-center gap-2 h-20 ${
                selectedProcedure === procedure.id ? procedure.color + ' text-white' : ''
              }`}
              onClick={() => onProcedureSelect(procedure.id)}
              >
                <span className="text-primary">
                  {iconMap[procedure.id] && (
                    <img
                      src={`/iconos_tratamientos/${iconMap[procedure.id]}`}
                      alt={procedure.name}
                      className="h-10 w-10"
                    />
                  )}
                </span>
                <span className="text-xs">{procedure.name}</span>
            </Button>
          ))}
        </div>
        
        {/* Leyenda de colores */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Diagnóstico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Realizado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
