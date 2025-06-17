
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
  const [showQuadrants, setShowQuadrants] = useState(false);
  const [showSegmentSelection, setShowSegmentSelection] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [showSegmentStatusSelection, setShowSegmentStatusSelection] = useState(false);
  const [selectedSegmentForStatus, setSelectedSegmentForStatus] = useState<string>('');
  
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

  const segments = [
    { id: 'oclusal', name: 'Oclusal (centro)' },
    { id: 'vestibular', name: 'Vestibular (exterior)' },
    { id: 'lingual', name: 'Lingual (interior)' },
    { id: 'mesial', name: 'Mesial (izquierda)' },
    { id: 'distal', name: 'Distal (derecha)' }
  ];

  const workStatuses = [
    { id: 'diagnostico', name: 'Diagnóstico', color: '#3B82F6' },
    { id: 'pendiente', name: 'Trabajo pendiente', color: '#EF4444' },
    { id: 'realizado', name: 'Trabajo realizado', color: '#10B981' }
  ];

  const handleTaskToggle = (task: string) => {
    setSelectedTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(s => s !== segmentId)
        : [...prev, segmentId]
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
          showMultipleSelectionPopup();
          return;
          
        case "Seleccionar cuadrantes o dentición completa":
          setShowQuadrants(true);
          return;
          
        case "Seleccionar área del diente":
          setShowSegmentSelection(true);
          return;
      }
    });

    onApplySelection();
    onClose();
    resetModal();
  };

  const showMultipleSelectionPopup = () => {
    // Crear popup temporal para selección múltiple
    const popup = document.createElement('div');
    popup.className = 'fixed top-4 right-4 bg-white border border-blue-300 rounded-lg p-4 shadow-lg z-50';
    popup.innerHTML = `
      <div class="flex items-center gap-3 mb-3">
        <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <span class="text-sm font-medium">Seleccione más dientes haciendo click sobre el número del diente</span>
      </div>
      <div class="flex gap-2">
        <button id="finalize-btn" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
          Finalizar selección
        </button>
        <button id="cancel-btn" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
          Omitir selección
        </button>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    const finalizeBtn = popup.querySelector('#finalize-btn');
    const cancelBtn = popup.querySelector('#cancel-btn');
    
    finalizeBtn?.addEventListener('click', () => {
      document.body.removeChild(popup);
      onApplySelection();
    });
    
    cancelBtn?.addEventListener('click', () => {
      document.body.removeChild(popup);
      clearSelection();
    });
    
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 10000);
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
    resetModal();
  };

  const handleSegmentSelection = () => {
    if (!toothNumber || selectedSegments.length === 0) return;
    
    addToothSelection(toothNumber, selectedSegments);
    setSelectionMode('single');
    onApplySelection();
    onClose();
    resetModal();
  };

  const handleSegmentForStatusSelection = (segmentId: string) => {
    setSelectedSegmentForStatus(segmentId);
    setShowSegmentStatusSelection(true);
  };

  const handleStatusSelection = (status: string) => {
    if (!toothNumber || !selectedSegmentForStatus) return;
    
    // Aquí aplicamos el estado al segmento - esto se puede conectar con el sistema de procedimientos
    addToothSelection(toothNumber, [selectedSegmentForStatus]);
    
    // Crear un popup temporal para mostrar la selección
    const statusInfo = workStatuses.find(s => s.id === status);
    const popup = document.createElement('div');
    popup.className = 'fixed top-4 right-4 bg-white border border-green-300 rounded-lg p-4 shadow-lg z-50';
    popup.innerHTML = `
      <div class="flex items-center gap-3 mb-2">
        <div class="w-4 h-4 rounded" style="background-color: ${statusInfo?.color}"></div>
        <span class="text-sm font-medium">Área marcada como: ${statusInfo?.name}</span>
      </div>
      <div class="text-xs text-gray-600">Diente ${toothNumber} - ${selectedSegmentForStatus}</div>
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 3000);

    setSelectionMode('single');
    onApplySelection();
    onClose();
    resetModal();
  };

  const resetModal = () => {
    setSelectedTasks([]);
    setShowQuadrants(false);
    setShowSegmentSelection(false);
    setSelectedSegments([]);
    setShowSegmentStatusSelection(false);
    setSelectedSegmentForStatus('');
  };

  const handleCancel = () => {
    onClose();
    resetModal();
  };

  const handleBackToSegmentSelection = () => {
    setShowSegmentStatusSelection(false);
    setSelectedSegmentForStatus('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-base text-gray-700">
            {showQuadrants ? 'Seleccionar cuadrante' : 
             showSegmentSelection ? 'Seleccionar área del diente' :
             showSegmentStatusSelection ? 'Estado del trabajo' :
             `Diente ${toothNumber}${segment ? ` - ${segment}` : ''}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!showQuadrants && !showSegmentSelection && !showSegmentStatusSelection ? (
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
          ) : showQuadrants ? (
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
          ) : showSegmentSelection && !showSegmentStatusSelection ? (
            <>
              {/* Selección de segmentos para trabajar */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  Selecciona las áreas del diente que deseas trabajar:
                </p>
                {segments.map((segment) => (
                  <Button
                    key={segment.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleSegmentForStatusSelection(segment.id)}
                  >
                    {segment.name}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowSegmentSelection(false)}
                >
                  Volver
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Selección de estado del trabajo */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  ¿Cuál es el estado del trabajo en {segments.find(s => s.id === selectedSegmentForStatus)?.name}?
                </p>
                {workStatuses.map((status) => (
                  <Button
                    key={status.id}
                    variant="outline"
                    className="w-full justify-start flex items-center gap-3"
                    onClick={() => handleStatusSelection(status.id)}
                  >
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: status.color }}
                    />
                    {status.name}
                  </Button>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline"
                  onClick={handleBackToSegmentSelection}
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
