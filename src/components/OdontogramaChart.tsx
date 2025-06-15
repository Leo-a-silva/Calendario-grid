import { useState } from "react";
import { ToothComponent } from "./ToothComponent";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ToothState {
  number: number;
  procedures: {
    type: 'diagnostico' | 'limpieza' | 'obturacion' | 'extraccion' | 'endodoncia' | 'corona' | 'ninguno';
    status: 'diagnostico' | 'realizado' | 'pendiente';
    segments: ('oclusal' | 'vestibular' | 'lingual' | 'mesial' | 'distal')[];
  }[];
}

interface OdontogramaChartProps {
  denticionType: 'permanente' | 'primaria';
}

export function OdontogramaChart({ denticionType }: OdontogramaChartProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [toothStates, setToothStates] = useState<{ [key: number]: ToothState }>({});
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    diagnostico: true,
    realizados: true,
    pendientes: true
  });

  // Números de dientes según el tipo de dentición
  const permanentTeeth = {
    superior: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    inferior: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  const primaryTeeth = {
    superior: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    inferior: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]
  };

  const teethNumbers = denticionType === 'permanente' ? permanentTeeth : primaryTeeth;

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
  };

  const handleProcedureSelect = (procedure: string) => {
    setSelectedProcedure(procedure);
  };

  const applyProcedureToTooth = () => {
    if (!selectedTooth || !selectedProcedure) return;

    setToothStates(prev => {
      const currentTooth = prev[selectedTooth] || { number: selectedTooth, procedures: [] };
      
      const updatedProcedures = [
        ...currentTooth.procedures,
        {
          type: selectedProcedure as any,
          status: 'diagnostico' as const,
          segments: ['oclusal' as const]
        }
      ];

      return {
        ...prev,
        [selectedTooth]: {
          ...currentTooth,
          procedures: updatedProcedures
        }
      };
    });

    setSelectedTooth(null);
    setSelectedProcedure(null);
  };

  const procedures = [
    { id: 'diagnostico', name: 'Diagnóstico', icon: '🦷' },
    { id: 'limpieza', name: 'Limpieza', icon: '🧽' },
    { id: 'obturacion', name: 'Obturación', icon: '🦷' },
    { id: 'extraccion', name: 'Extracción', icon: '🔧' },
    { id: 'blanqueamiento', name: 'Blanqueamiento', icon: '✨' },
    { id: 'radiografias', name: 'Radiografías', icon: '📱' },
    { id: 'selladores', name: 'Selladores', icon: '🦷' },
    { id: 'endodoncia', name: 'Endodoncia', icon: '⚕️' },
    { id: 'implantes', name: 'Implantes', icon: '🔩' },
    { id: 'coronas', name: 'Coronas', icon: '👑' },
    { id: 'puentes', name: 'Puentes', icon: '🌉' },
    { id: 'carillas', name: 'Carillas', icon: '🦷' },
    { id: 'apicectomia', name: 'Apicectomía', icon: '⚕️' },
    { id: 'prostodoncia', name: 'Prostodoncia', icon: '🦷' },
    { id: 'cirugia', name: 'Cirugía maxilofacial', icon: '⚕️' },
    { id: 'ortodoncia', name: 'Ortodoncia', icon: '🦷' },
    { id: 'placa', name: 'Placa antibruxismo', icon: '🦷' },
    { id: 'periodoncia', name: 'Periodoncia', icon: '🦠' },
    { id: 'fluor', name: 'Flúor', icon: '💧' },
    { id: 'frenectomia', name: 'Frenectomía', icon: '⚕️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Odontograma</h2>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="diagnostico" 
                checked={filters.diagnostico}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, diagnostico: !!checked }))}
              />
              <div className="w-4 h-4 bg-blue-500 rounded mr-1"></div>
              <label htmlFor="diagnostico" className="text-sm">Diagnóstico</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="realizados" 
                checked={filters.realizados}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, realizados: !!checked }))}
              />
              <div className="w-4 h-4 bg-green-500 rounded mr-1"></div>
              <label htmlFor="realizados" className="text-sm">Trabajos realizados</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pendientes" 
                checked={filters.pendientes}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, pendientes: !!checked }))}
              />
              <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
              <label htmlFor="pendientes" className="text-sm">Trabajo pendiente</label>
            </div>
          </div>

          <Select defaultValue={denticionType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar dentición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanente">Dentición permanente</SelectItem>
              <SelectItem value="primaria">Dentición primaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contenedor del odontograma */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        {/* Dientes superiores */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {teethNumbers.superior.map((toothNumber) => (
              <ToothComponent
                key={toothNumber}
                number={toothNumber}
                procedures={toothStates[toothNumber]?.procedures || []}
                onClick={() => handleToothClick(toothNumber)}
                isSelected={selectedTooth === toothNumber}
              />
            ))}
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Dientes inferiores */}
        <div className="flex justify-center">
          <div className="flex gap-2">
            {teethNumbers.inferior.map((toothNumber) => (
              <ToothComponent
                key={toothNumber}
                number={toothNumber}
                procedures={toothStates[toothNumber]?.procedures || []}
                onClick={() => handleToothClick(toothNumber)}
                isSelected={selectedTooth === toothNumber}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Panel de procedimientos */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="grid grid-cols-10 gap-4">
          {procedures.map((procedure) => (
            <Button
              key={procedure.id}
              variant="outline"
              className={`flex flex-col items-center gap-2 h-20 bg-white hover:bg-blue-100 border-blue-200 ${
                selectedProcedure === procedure.id ? 'bg-blue-200 border-blue-400' : ''
              }`}
              onClick={() => handleProcedureSelect(procedure.id)}
            >
              <span className="text-2xl">{procedure.icon}</span>
              <span className="text-xs text-center font-medium">{procedure.name}</span>
            </Button>
          ))}
        </div>
        
        {selectedTooth && selectedProcedure && (
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={applyProcedureToTooth}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Aplicar {procedures.find(p => p.id === selectedProcedure)?.name} al diente {selectedTooth}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
