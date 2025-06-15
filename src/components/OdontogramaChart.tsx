
import { useState } from "react";
import { ToothComponent } from "./ToothComponent";
import { ProcedureModal } from "./ProcedureModal";
import { ProcedurePanel } from "./ProcedurePanel";

export interface ToothState {
  number: number;
  procedures: {
    type: 'diagnostico' | 'limpieza' | 'obturacion' | 'extraccion' | 'endodoncia' | 'corona' | 'ninguno';
    status: 'diagnostico' | 'realizado' | 'pendiente';
    segments: ('superior' | 'inferior' | 'izquierdo' | 'derecho' | 'centro')[];
  }[];
}

interface OdontogramaChartProps {
  denticionType: 'permanente' | 'primaria';
}

export function OdontogramaChart({ denticionType }: OdontogramaChartProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<'diagnostico' | 'limpieza' | 'obturacion' | 'extraccion' | 'endodoncia' | 'corona'>('diagnostico');
  const [toothStates, setToothStates] = useState<{ [key: number]: ToothState }>({});

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

  const handleToothClick = (toothNumber: number, segment: 'superior' | 'inferior' | 'izquierdo' | 'derecho' | 'centro') => {
    if (!selectedProcedure) return;

    setToothStates(prev => {
      const currentTooth = prev[toothNumber] || { number: toothNumber, procedures: [] };
      
      // Buscar si ya existe un procedimiento del mismo tipo en el mismo segmento
      const existingProcedureIndex = currentTooth.procedures.findIndex(
        p => p.type === selectedProcedure && p.segments.includes(segment)
      );

      let updatedProcedures;
      if (existingProcedureIndex >= 0) {
        // Si existe, cambiar el estado (diagnostico -> pendiente -> realizado -> ninguno)
        const currentProcedure = currentTooth.procedures[existingProcedureIndex];
        const statusCycle: ('diagnostico' | 'pendiente' | 'realizado')[] = ['diagnostico', 'pendiente', 'realizado'];
        const currentIndex = statusCycle.indexOf(currentProcedure.status);
        const nextIndex = (currentIndex + 1) % statusCycle.length;
        
        if (nextIndex === 0) {
          // Volver al inicio del ciclo o eliminar si es el tercer click
          updatedProcedures = currentTooth.procedures.filter((_, index) => index !== existingProcedureIndex);
        } else {
          updatedProcedures = [...currentTooth.procedures];
          updatedProcedures[existingProcedureIndex] = {
            ...currentProcedure,
            status: statusCycle[nextIndex]
          };
        }
      } else {
        // Si no existe, crear uno nuevo
        updatedProcedures = [
          ...currentTooth.procedures,
          {
            type: selectedProcedure,
            status: 'diagnostico' as const,
            segments: [segment]
          }
        ];
      }

      return {
        ...prev,
        [toothNumber]: {
          ...currentTooth,
          procedures: updatedProcedures
        }
      };
    });
  };

  return (
    <div className="space-y-8">
      {/* Dientes superiores */}
      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-3 lg:grid-cols-16">
          {teethNumbers.superior.map((toothNumber) => (
            <ToothComponent
              key={toothNumber}
              number={toothNumber}
              procedures={toothStates[toothNumber]?.procedures || []}
              onSegmentClick={(segment) => handleToothClick(toothNumber, segment)}
            />
          ))}
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t-2 border-gray-300 mx-8"></div>

      {/* Dientes inferiores */}
      <div className="flex justify-center">
        <div className="grid grid-cols-8 gap-3 lg:grid-cols-16">
          {teethNumbers.inferior.map((toothNumber) => (
            <ToothComponent
              key={toothNumber}
              number={toothNumber}
              procedures={toothStates[toothNumber]?.procedures || []}
              onSegmentClick={(segment) => handleToothClick(toothNumber, segment)}
            />
          ))}
        </div>
      </div>

      {/* Panel de procedimientos */}
      <ProcedurePanel
        selectedProcedure={selectedProcedure}
        onProcedureSelect={setSelectedProcedure}
      />
    </div>
  );
}
