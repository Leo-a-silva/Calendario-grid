import { useEffect, useMemo, useState } from "react";
import { ToothComponent } from "./ToothComponent";
import { SegmentSelectionModal } from "./SegmentSelectionModal";
import { QuadrantSelectionModal } from "./QuadrantSelectionModal";
import { WorkTypeModal } from "./WorkTypeModal";
import { TreatmentSelectionModal } from "./TreatmentSelectionModal";
import { TreatmentDetailsModal } from "./TreatmentDetailsModal";
import { ToothAreaSelectionModal } from "./ToothAreaSelectionModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

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
  pacienteId?: string | number;
}

export function OdontogramaChart({ denticionType, pacienteId }: OdontogramaChartProps) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false);
  const [isQuadrantModalOpen, setIsQuadrantModalOpen] = useState(false);
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [isAreaSelectionModalOpen, setIsAreaSelectionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState<'pendiente' | 'realizado' | 'diagnostico' | null>(null);
  const [toothStates, setToothStates] = useState<{ [key: number]: ToothState }>({});
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    diagnostico: true,
    realizados: true,
    pendientes: true
  });

  // Clave de almacenamiento por paciente y tipo de dentición
  const storageKey = useMemo(
    () => `odontograma:${pacienteId ?? 'default'}:${denticionType}`,
    [pacienteId, denticionType]
  );

  // Cargar desde localStorage cuando cambia la clave (paciente/dentición)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Revivir fechas si existieran
        const revived = Object.fromEntries(
          Object.entries(parsed).map(([tooth, state]: any) => {
            const procedures = (state.procedures || []).map((p: any) => ({
              ...p,
              date: p.date ? new Date(p.date) : undefined,
            }));
            return [Number(tooth), { ...state, procedures }];
          })
        );
        setToothStates(revived);
      } else {
        setToothStates({});
      }
    } catch (e) {
      console.error('Error loading odontograma from localStorage', e);
    }
  }, [storageKey]);

  // Guardar en localStorage cuando cambien los estados
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(toothStates));
    } catch (e) {
      console.error('Error saving odontograma to localStorage', e);
    }
  }, [storageKey, toothStates]);

  // Números de dientes según el tipo de dentición
  const permanentTeeth = {
    superior: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    inferior: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
  };

  // Eliminar una cara (segmento) específica de un procedimiento; si queda sin segmentos, eliminar el procedimiento
  const deleteProcedureSegmentAtIndex = (
    index: number,
    segment: 'oclusal' | 'vestibular' | 'lingual' | 'mesial' | 'distal'
  ) => {
    if (selectedTooth == null) return;
    setToothStates(prev => {
      const currentTooth = prev[selectedTooth];
      if (!currentTooth) return prev;
      const proc = currentTooth.procedures[index];
      if (!proc) return prev;
      const newSegments = proc.segments.filter(s => s !== segment);
      let updatedProcedures;
      if (newSegments.length === 0) {
        // eliminar el procedimiento completo si se quedaron sin segmentos
        updatedProcedures = currentTooth.procedures.filter((_, i) => i !== index);
      } else {
        updatedProcedures = currentTooth.procedures.map((p, i) =>
          i === index ? { ...p, segments: newSegments, date: new Date() } : p
        );
      }
      return {
        ...prev,
        [selectedTooth]: { ...currentTooth, procedures: updatedProcedures }
      };
    });
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

  const handleWorkTypeSelect = (workType: 'pendiente' | 'realizado' | 'diagnostico' | 'select-area') => {
    if (workType === 'select-area') {
      // Mostrar modal de selección de área
      setIsAreaSelectionModalOpen(true);
      return;
    }
    
    setSelectedWorkType(workType);
    setIsWorkTypeModalOpen(false);
    
    // Mostrar advertencia para seleccionar tratamiento de abajo
    toast({
      title: "Tipo de trabajo seleccionado",
      description: `Ahora seleccione uno de los tratamientos de abajo para aplicar como ${workType} al diente ${selectedTooth}`,
    });
  };
  
  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setSelectedWorkType('diagnostico'); // Establecer un tipo de trabajo por defecto
    setIsAreaSelectionModalOpen(false);
    
    // Mostrar advertencia para seleccionar tratamiento
    toast({
      title: "Área seleccionada",
      description: `Ahora seleccione uno de los tratamientos de abajo para aplicar al área ${area} del diente ${selectedTooth}`,
    });
  };

  const handleTreatmentSelect = (treatment: string) => {
    if (!selectedTooth) return;

    // Si hay un área seleccionada, aplicamos solo a esa área
    // Si no, aplicamos a todo el diente (todos los segmentos)
    const segmentsToApply = selectedArea 
      ? [selectedArea as 'oclusal' | 'vestibular' | 'lingual' | 'mesial' | 'distal']
      : ['oclusal', 'vestibular', 'lingual', 'mesial', 'distal'];

    // Usamos el workType seleccionado o asumimos 'diagnostico' si estamos en modo área
    const status = selectedWorkType || 'diagnostico';

    setToothStates(prev => {
      const currentTooth = prev[selectedTooth] || { number: selectedTooth, procedures: [] };
      
      // Buscar si ya existe un procedimiento del mismo tipo y estado para combinar segmentos
      const existingProcedureIndex = currentTooth.procedures.findIndex(
        p => p.type === treatment && p.status === status
      );

      let updatedProcedures;
      
      if (existingProcedureIndex >= 0) {
        // Si ya existe un procedimiento del mismo tipo, actualizamos los segmentos
        const existingProcedure = currentTooth.procedures[existingProcedureIndex];
        const combinedSegments = [...new Set([...existingProcedure.segments, ...segmentsToApply])];
        
        updatedProcedures = [...currentTooth.procedures];
        updatedProcedures[existingProcedureIndex] = {
          ...existingProcedure,
          segments: combinedSegments,
          date: new Date() // Actualizamos la fecha
        };
      } else {
        // Si no existe, añadimos un nuevo procedimiento
        updatedProcedures = [
          ...currentTooth.procedures,
          {
            type: treatment as any,
            status,
            segments: segmentsToApply,
            date: new Date()
          }
        ];
      }

      return {
        ...prev,
        [selectedTooth]: {
          ...currentTooth,
          procedures: updatedProcedures
        }
      };
    });

    const statusText = status;
    
    toast({
      title: "Tratamiento aplicado",
      description: `${treatment} aplicado ${selectedArea ? `al área ${selectedArea} ` : ''}del diente ${selectedTooth} como ${statusText}`,
    });
    
    // Reset estados
    setSelectedWorkType(null);
    setSelectedProcedure(null);
    setSelectedArea(null);
  };

  const handleQuadrantConfirm = () => {
    console.log(`Confirmed selection of segment ${selectedSegment} for tooth ${selectedTooth}`);
    // Aquí puedes implementar la lógica para aplicar el procedimiento al cuadrante seleccionado
  };

  const handleTaskSelect = (tasks: string[]) => {
    console.log("Selected tasks:", tasks);
    setIsSegmentModalOpen(false);
    setIsWorkTypeModalOpen(true);
  };

  const handleProcedureSelect = (procedure: string) => {
    setSelectedProcedure(procedure);
  };

  const applyProcedureToTooth = () => {
    if (!selectedTooth || !selectedProcedure || !selectedWorkType) return;

    handleTreatmentSelect(selectedProcedure);
  };

  // Abrir detalles del diente seleccionado
  const openDetailsForSelectedTooth = () => {
    if (!selectedTooth) return;
    setIsDetailsModalOpen(true);
  };

  // Eliminar procedimiento por índice
  const deleteProcedureAtIndex = (index: number) => {
    if (selectedTooth == null) return;
    setToothStates(prev => {
      const currentTooth = prev[selectedTooth];
      if (!currentTooth) return prev;
      const updated = currentTooth.procedures.filter((_, i) => i !== index);
      return {
        ...prev,
        [selectedTooth]: { ...currentTooth, procedures: updated }
      };
    });
  };

  // Cambiar estado del procedimiento
  const updateProcedureStatusAtIndex = (index: number, status: 'diagnostico' | 'realizado' | 'pendiente') => {
    if (selectedTooth == null) return;
    setToothStates(prev => {
      const currentTooth = prev[selectedTooth];
      if (!currentTooth) return prev;
      const updated = currentTooth.procedures.map((p, i) =>
        i === index ? { ...p, status, date: new Date() } : p
      );
      return {
        ...prev,
        [selectedTooth]: { ...currentTooth, procedures: updated }
      };
    });
  };

  const procedures = [
    { id: 'diagnostico', name: 'Diagnóstico', icon: '🔍' },
    { id: 'limpieza', name: 'Limpieza', icon: '✨' },
    { id: 'obturacion', name: 'Obturación', icon: '🔧' },
    { id: 'extraccion', name: 'Extracción', icon: '✂️' },
    { id: 'blanqueamiento', name: 'Blanqueamiento', icon: '✨' },
    { id: 'radiografias', name: 'Radiografías', icon: '📸' },
    { id: 'selladores', name: 'Selladores', icon: '🛡️' },
    { id: 'endodoncia', name: 'Endodoncia', icon: '⚕️' },
    { id: 'implantes', name: 'Implantes', icon: '🔩' },
    { id: 'coronas', name: 'Coronas', icon: '👑' },
    { id: 'puentes', name: 'Puentes', icon: '🌉' },
    { id: 'carillas', name: 'Carillas', icon: '💎' },
    { id: 'apicectomia', name: 'Apicectomía', icon: '🔬' },
    { id: 'prostodoncia', name: 'Prostodoncia', icon: '🦷' },
    { id: 'cirugia', name: 'Cirugía maxilofacial', icon: '⚕️' },
    { id: 'ortodoncia', name: 'Ortodoncia', icon: '🔧' },
    { id: 'placa', name: 'Placa antibruxismo', icon: '🛡️' },
    { id: 'periodoncia', name: 'Periodoncia', icon: '🦠' },
    { id: 'fluor', name: 'Flúor', icon: '💧' },
    { id: 'frenectomia', name: 'Frenectomía', icon: '✂️' }
  ];

  // Iconos desde public/Iconos tratamientos
  const iconMap: Record<string, string> = {
    diagnostico: "diagnosticos.svg",
    limpieza: "limpieza.svg",
    obturacion: "obstruccion.svg",
    extraccion: "extraccion.svg",
    blanqueamiento: "blanqueamiento.svg",
    radiografias: "radiografia.svg",
    selladores: "selladores.svg",
    endodoncia: "endodoncia.svg",
    implantes: "implantes.svg",
    coronas: "coronas.svg",
    puentes: "puentes.svg",
    carillas: "carillas.svg",
    apicectomia: "apicectomia.svg",
    prostodoncia: "prostodoncia.svg",
    cirugia: "cirugia_maxilofacial.svg",
    ortodoncia: "ortodoncia.svg",
    placa: "placa_antibruxismo.svg",
    periodoncia: "periodoncia.svg",
    fluor: "fluor.svg",
    frenectomia: "frenectomia.svg",
  };

  return (
    <div className="space-y-6">
      {/* Responsive header with filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-xl font-bold">Odontograma</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-4">
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
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Seleccionar dentición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="permanente">Dentición permanente</SelectItem>
              <SelectItem value="primaria">Dentición primaria</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Responsive Odontogram Container */}
      <div className="bg-white p-4 md:p-6 rounded-lg border shadow-sm">
        <div className="space-y-6 md:space-y-8">
          {/* Upper quadrants */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Dientes Superiores</h3>
            
            {/* Desktop: side by side, Mobile: stacked */}
            <div className="flex flex-col lg:flex-row lg:justify-center gap-2 lg:gap-8">
              {/* Right upper quadrant (18-11) */}
              <div className="flex justify-center">
                <div className="flex gap-0.5 sm:gap-1 md:gap-2">
                  {teethNumbers.superior.slice(0, teethNumbers.superior.length / 2).map((toothNumber) => (
                    <ToothComponent
                      key={toothNumber}
                      number={toothNumber}
                      procedures={toothStates[toothNumber]?.procedures || []}
                      onClick={() => handleToothClick(toothNumber)}
                      onSegmentClick={handleSegmentClick}
                      onNumberClick={handleNumberClick}
                      isSelected={selectedTooth === toothNumber}
                      onDeleteProcedure={deleteProcedureAtIndex}
                      onUpdateProcedureStatus={updateProcedureStatusAtIndex}
                      onDeleteProcedureSegment={deleteProcedureSegmentAtIndex}
                    />
                  ))}
                </div>
              </div>
              
              {/* Vertical separator on desktop, horizontal on mobile */}
              <div className="flex justify-center py-1 lg:py-0">
                <div className="lg:w-0.5 lg:h-16 w-12 h-0.5 bg-border"></div>
              </div>
              
              {/* Left upper quadrant (21-28) */}
              <div className="flex justify-center">
                <div className="flex gap-0.5 sm:gap-1 md:gap-2">
                  {teethNumbers.superior.slice(teethNumbers.superior.length / 2).map((toothNumber) => (
                    <ToothComponent
                      key={toothNumber}
                      number={toothNumber}
                      procedures={toothStates[toothNumber]?.procedures || []}
                      onClick={() => handleToothClick(toothNumber)}
                      onSegmentClick={handleSegmentClick}
                      onNumberClick={handleNumberClick}
                      isSelected={selectedTooth === toothNumber}
                      onDeleteProcedure={deleteProcedureAtIndex}
                      onUpdateProcedureStatus={updateProcedureStatusAtIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main horizontal separator */}
          <div className="border-t border-border"></div>

          {/* Lower quadrants */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Dientes Inferiores</h3>
            
            {/* Desktop: side by side, Mobile: stacked */}
            <div className="flex flex-col lg:flex-row lg:justify-center gap-2 lg:gap-8">
              {/* Right lower quadrant (48-41) */}
              <div className="flex justify-center">
                <div className="flex gap-0.5 sm:gap-1 md:gap-2">
                  {teethNumbers.inferior.slice(0, teethNumbers.inferior.length / 2).map((toothNumber) => (
                    <ToothComponent
                      key={toothNumber}
                      number={toothNumber}
                      procedures={toothStates[toothNumber]?.procedures || []}
                      onClick={() => handleToothClick(toothNumber)}
                      onSegmentClick={handleSegmentClick}
                      onNumberClick={handleNumberClick}
                      isSelected={selectedTooth === toothNumber}
                      onDeleteProcedure={deleteProcedureAtIndex}
                      onUpdateProcedureStatus={updateProcedureStatusAtIndex}
                    />
                  ))}
                </div>
              </div>
              
              {/* Vertical separator on desktop, horizontal on mobile */}
              <div className="flex justify-center py-1 lg:py-0">
                <div className="lg:w-0.5 lg:h-16 w-12 h-0.5 bg-border"></div>
              </div>
              
              {/* Left lower quadrant (31-38) */}
              <div className="flex justify-center">
                <div className="flex gap-0.5 sm:gap-1 md:gap-2">
                  {teethNumbers.inferior.slice(teethNumbers.inferior.length / 2).map((toothNumber) => (
                    <ToothComponent
                      key={toothNumber}
                      number={toothNumber}
                      procedures={toothStates[toothNumber]?.procedures || []}
                      onClick={() => handleToothClick(toothNumber)}
                      onSegmentClick={handleSegmentClick}
                      onNumberClick={handleNumberClick}
                      isSelected={selectedTooth === toothNumber}
                      onDeleteProcedure={deleteProcedureAtIndex}
                      onUpdateProcedureStatus={updateProcedureStatusAtIndex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive procedures panel */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 md:p-6">
        <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Tratamientos</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-4">
          {procedures.map((procedure) => (
            <div key={procedure.id} className="flex flex-col items-center gap-1 md:gap-2">
              <button
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 transition-colors flex items-center justify-center ${
                  selectedProcedure === procedure.id 
                    ? 'bg-blue-500 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => handleProcedureSelect(procedure.id)}
              >
                <span className="text-xs sm:text-sm">
                  {iconMap[procedure.id] ? (
                    <img
                      src={`/iconos_tratamientos/${iconMap[procedure.id]}`}
                      alt={procedure.name}
                      className="h-10 w-10"
                    />
                  ) : (
                    procedure.icon
                  )}
                </span>
              </button>
              <span className="text-xs text-center font-medium text-gray-700 leading-tight">
                {procedure.name}
              </span>
            </div>
          ))}
        </div>
        
        {selectedTooth && selectedWorkType && selectedProcedure && (
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={applyProcedureToTooth}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm md:text-base"
            >
              Aplicar {procedures.find(p => p.id === selectedProcedure)?.name} como {selectedWorkType} al diente {selectedTooth}
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

      {/* Modal de selección de área del diente */}
      <ToothAreaSelectionModal
        isOpen={isAreaSelectionModalOpen}
        onClose={() => {
          setIsAreaSelectionModalOpen(false);
          setIsWorkTypeModalOpen(true);
        }}
        onAreaSelect={handleAreaSelect}
        toothNumber={selectedTooth || 0}
      />

    </div>
  );
}
