import { useState } from "react";
import { ToothComponent } from "./ToothComponent";
import { SegmentSelectionModal } from "./SegmentSelectionModal";
import { QuadrantSelectionModal } from "./QuadrantSelectionModal";
import { WorkTypeModal } from "./WorkTypeModal";
import { TreatmentSelectionModal } from "./TreatmentSelectionModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false);
  const [isQuadrantModalOpen, setIsQuadrantModalOpen] = useState(false);
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState<'pendiente' | 'realizado' | 'diagnostico' | null>(null);
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

  // Helper function to render teeth with separation
  const renderTeethWithSeparation = (teeth: number[]) => {
    const leftSide = teeth.slice(0, teeth.length / 2);
    const rightSide = teeth.slice(teeth.length / 2);

    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          {leftSide.map((toothNumber) => (
            <ToothComponent
              key={toothNumber}
              number={toothNumber}
              procedures={toothStates[toothNumber]?.procedures || []}
              onClick={() => handleToothClick(toothNumber)}
              onSegmentClick={handleSegmentClick}
              onNumberClick={handleNumberClick}
              isSelected={selectedTooth === toothNumber}
            />
          ))}
        </div>
        
        {/* Separación central */}
        <div className="w-6 flex justify-center">
          <div className="w-0.5 h-16 bg-gray-400"></div>
        </div>
        
        <div className="flex gap-2">
          {rightSide.map((toothNumber) => (
            <ToothComponent
              key={toothNumber}
              number={toothNumber}
              procedures={toothStates[toothNumber]?.procedures || []}
              onClick={() => handleToothClick(toothNumber)}
              onSegmentClick={handleSegmentClick}
              onNumberClick={handleNumberClick}
              isSelected={selectedTooth === toothNumber}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    setIsWorkTypeModalOpen(true);
  };

  const handleNumberClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    setIsSegmentModalOpen(true);
  };

  const handleSegmentClick = (toothNumber: number, segment: string) => {
    console.log(`Clicked segment ${segment} of tooth ${toothNumber}`);
    setSelectedTooth(toothNumber);
    setSelectedSegment(segment);
    setIsQuadrantModalOpen(true);
  };

  const handleWorkTypeSelect = (workType: 'pendiente' | 'realizado' | 'diagnostico') => {
    setSelectedWorkType(workType);
    setIsTreatmentModalOpen(true);
  };

  const handleTreatmentSelect = (treatment: string) => {
    if (!selectedTooth || !selectedWorkType) return;

    // Aplicar el tratamiento a todo el diente (todos los segmentos)
    const allSegments: ('oclusal' | 'vestibular' | 'lingual' | 'mesial' | 'distal')[] = 
      ['oclusal', 'vestibular', 'lingual', 'mesial', 'distal'];

    setToothStates(prev => {
      const currentTooth = prev[selectedTooth] || { number: selectedTooth, procedures: [] };
      
      const updatedProcedures = [
        ...currentTooth.procedures,
        {
          type: treatment as any,
          status: selectedWorkType,
          segments: allSegments
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

    toast.success(`${treatment} aplicado como ${selectedWorkType} al diente ${selectedTooth}`);
    
    // Reset estados
    setSelectedTooth(null);
    setSelectedWorkType(null);
    setSelectedProcedure(null);
  };

  const handleQuadrantConfirm = () => {
    console.log(`Confirmed selection of segment ${selectedSegment} for tooth ${selectedTooth}`);
    // Aquí puedes implementar la lógica para aplicar el procedimiento al cuadrante seleccionado
  };

  const handleTaskSelect = (tasks: string[]) => {
    console.log("Selected tasks:", tasks);
    // Aquí puedes implementar la lógica específica para cada tarea seleccionada
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
    { id: 'diagnostico', name: 'Diagnóstico' },
    { id: 'limpieza', name: 'Limpieza' },
    { id: 'obturacion', name: 'Obturación' },
    { id: 'extraccion', name: 'Extracción' },
    { id: 'blanqueamiento', name: 'Blanqueamiento' },
    { id: 'radiografias', name: 'Radiografías' },
    { id: 'selladores', name: 'Selladores' },
    { id: 'endodoncia', name: 'Endodoncia' },
    { id: 'implantes', name: 'Implantes' },
    { id: 'coronas', name: 'Coronas' },
    { id: 'puentes', name: 'Puentes' },
    { id: 'carillas', name: 'Carillas' },
    { id: 'apicectomia', name: 'Apicectomía' },
    { id: 'prostodoncia', name: 'Prostodoncia' },
    { id: 'cirugia', name: 'Cirugía maxilofacial' },
    { id: 'ortodoncia', name: 'Ortodoncia' },
    { id: 'placa', name: 'Placa antibruxismo' },
    { id: 'periodoncia', name: 'Periodoncia' },
    { id: 'fluor', name: 'Flúor' },
    { id: 'frenectomia', name: 'Frenectomía' }
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
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {teethNumbers.superior.slice(0, teethNumbers.superior.length / 2).map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  number={toothNumber}
                  procedures={toothStates[toothNumber]?.procedures || []}
                  onClick={() => handleToothClick(toothNumber)}
                  onSegmentClick={handleSegmentClick}
                  onNumberClick={handleNumberClick}
                  isSelected={selectedTooth === toothNumber}
                />
              ))}
            </div>
            
            {/* Separación central */}
            <div className="w-6 flex justify-center">
              <div className="w-0.5 h-16 bg-gray-400"></div>
            </div>
            
            <div className="flex gap-2">
              {teethNumbers.superior.slice(teethNumbers.superior.length / 2).map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  number={toothNumber}
                  procedures={toothStates[toothNumber]?.procedures || []}
                  onClick={() => handleToothClick(toothNumber)}
                  onSegmentClick={handleSegmentClick}
                  onNumberClick={handleNumberClick}
                  isSelected={selectedTooth === toothNumber}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Dientes inferiores */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {teethNumbers.inferior.slice(0, teethNumbers.inferior.length / 2).map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  number={toothNumber}
                  procedures={toothStates[toothNumber]?.procedures || []}
                  onClick={() => handleToothClick(toothNumber)}
                  onSegmentClick={handleSegmentClick}
                  onNumberClick={handleNumberClick}
                  isSelected={selectedTooth === toothNumber}
                />
              ))}
            </div>
            
            {/* Separación central */}
            <div className="w-6 flex justify-center">
              <div className="w-0.5 h-16 bg-gray-400"></div>
            </div>
            
            <div className="flex gap-2">
              {teethNumbers.inferior.slice(teethNumbers.inferior.length / 2).map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  number={toothNumber}
                  procedures={toothStates[toothNumber]?.procedures || []}
                  onClick={() => handleToothClick(toothNumber)}
                  onSegmentClick={handleSegmentClick}
                  onNumberClick={handleNumberClick}
                  isSelected={selectedTooth === toothNumber}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel de procedimientos */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="grid grid-cols-10 gap-4">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="flex flex-col items-center gap-2">
              <button
                className={`w-12 h-12 rounded-full border-2 transition-colors ${
                  selectedProcedure === procedure.id 
                    ? 'bg-blue-500 border-blue-600' 
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => handleProcedureSelect(procedure.id)}
              />
              <span className="text-xs text-center font-medium text-gray-700">{procedure.name}</span>
            </div>
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

      {/* Modal de selección de tareas */}
      <SegmentSelectionModal
        isOpen={isSegmentModalOpen}
        onClose={() => setIsSegmentModalOpen(false)}
        toothNumber={selectedTooth}
        segment={selectedSegment}
        onTaskSelect={handleTaskSelect}
      />

      {/* Modal de selección de cuadrante */}
      <QuadrantSelectionModal
        isOpen={isQuadrantModalOpen}
        onClose={() => setIsQuadrantModalOpen(false)}
        toothNumber={selectedTooth}
        segmentName={selectedSegment}
        onConfirm={handleQuadrantConfirm}
      />

      {/* Modal de selección de tipo de trabajo */}
      <WorkTypeModal
        isOpen={isWorkTypeModalOpen}
        onClose={() => setIsWorkTypeModalOpen(false)}
        toothNumber={selectedTooth}
        onWorkTypeSelect={handleWorkTypeSelect}
      />

      {/* Modal de selección de tratamiento */}
      <TreatmentSelectionModal
        isOpen={isTreatmentModalOpen}
        onClose={() => setIsTreatmentModalOpen(false)}
        toothNumber={selectedTooth}
        workType={selectedWorkType}
        onTreatmentSelect={handleTreatmentSelect}
      />
    </div>
  );
}
