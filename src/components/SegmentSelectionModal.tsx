
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToothSelection } from "@/hooks/useToothSelection";

interface SegmentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  segment: string | null;
  denticionType: 'permanente' | 'primaria';
  onApplySelection: () => void;
}

export function SegmentSelectionModal({ 
  isOpen, 
  onClose, 
  toothNumber, 
  segment, 
  denticionType,
  onApplySelection
}: SegmentSelectionModalProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const { 
    selectionState, 
    addToothSelection, 
    selectQuadrant, 
    selectAllTeeth, 
    clearSelection,
    setSelectionMode 
  } = useToothSelection();

  const tasks = [
    "Seleccionar diente completo",
    "Seleccionar más dientes", 
    "Seleccionar cuadrantes o dentición completa",
    "Seleccionar área del diente"
  ];

  const handleTaskToggle = (task: string) => {
    setSelectedTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const handleExecuteTask = () => {
    if (!toothNumber) return;

    selectedTasks.forEach(task => {
      switch (task) {
        case "Seleccionar diente completo":
          addToothSelection(toothNumber, [], true);
          setSelectionMode('single');
          break;
          
        case "Seleccionar más dientes":
          if (segment) {
            addToothSelection(toothNumber, [segment]);
          } else {
            addToothSelection(toothNumber, [], true);
          }
          setSelectionMode('multiple');
          // No cerramos el modal para permitir más selecciones
          return;
          
        case "Seleccionar cuadrantes o dentición completa":
          showQuadrantSelection();
          return;
          
        case "Seleccionar área del diente":
          if (segment) {
            addToothSelection(toothNumber, [segment]);
          }
          setSelectionMode('single');
          break;
      }
    });

    onApplySelection();
    onClose();
    setSelectedTasks([]);
  };

  const [showQuadrants, setShowQuadrants] = useState(false);

  const showQuadrantSelection = () => {
    setShowQuadrants(true);
  };

  const handleQuadrantSelection = (quadrant: string) => {
    if (quadrant === 'complete') {
      selectAllTeeth(denticionType);
    } else {
      selectQuadrant(quadrant as any, denticionType);
    }
    setSelectionMode('quadrant');
    onApplySelection();
    onClose();
    setShowQuadrants(false);
    setSelectedTasks([]);
  };

  const handleCancel = () => {
    onClose();
    setSelectedTasks([]);
    setShowQuadrants(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-base text-gray-700">
            {showQuadrants ? 'Seleccionar cuadrante' : `Diente ${toothNumber}${segment ? ` - ${segment}` : ''}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!showQuadrants ? (
            <>
              {/* Lista de tareas con checkboxes */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task} className="flex items-center space-x-3">
                    <Checkbox 
                      id={task}
                      checked={selectedTasks.includes(task)}
                      onCheckedChange={() => handleTaskToggle(task)}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <label htmlFor={task} className="text-sm text-gray-700">{task}</label>
                  </div>
                ))}
              </div>

              {/* Estado de selección actual */}
              {selectionState.selectedTeeth.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Seleccionados: {selectionState.selectedTeeth.length} dientes
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSelection}
                    className="mt-2 text-xs"
                  >
                    Limpiar selección
                  </Button>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex justify-center gap-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleExecuteTask}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 rounded-lg"
                  disabled={selectedTasks.length === 0}
                >
                  Ejecutar
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Selección de cuadrantes */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuadrantSelection('upper-left')}
                >
                  Cuadrante superior izquierdo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuadrantSelection('upper-right')}
                >
                  Cuadrante superior derecho
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuadrantSelection('lower-left')}
                >
                  Cuadrante inferior izquierdo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuadrantSelection('lower-right')}
                >
                  Cuadrante inferior derecho
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start font-semibold"
                  onClick={() => handleQuadrantSelection('complete')}
                >
                  Dentición completa
                </Button>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowQuadrants(false)}
                >
                  Volver
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
