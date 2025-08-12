import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WorkTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  onWorkTypeSelect: (workType: 'pendiente' | 'realizado' | 'diagnostico') => void;
}

export function WorkTypeModal({ isOpen, onClose, toothNumber, onWorkTypeSelect }: WorkTypeModalProps) {
  const handleWorkTypeClick = (workType: 'pendiente' | 'realizado' | 'diagnostico') => {
    onWorkTypeSelect(workType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar tipo de tarea - Diente {toothNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <p className="text-sm text-gray-600 mb-6">
            Seleccione el tipo de trabajo para el diente completo:
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={() => handleWorkTypeClick('pendiente')}
              className="flex items-center justify-start gap-3 h-12 bg-red-500 hover:bg-red-600 text-white"
            >
              <div className="w-4 h-4 bg-red-700 rounded"></div>
              Trabajo pendiente
            </Button>
            
            <Button
              onClick={() => handleWorkTypeClick('realizado')}
              className="flex items-center justify-start gap-3 h-12 bg-green-500 hover:bg-green-600 text-white"
            >
              <div className="w-4 h-4 bg-green-700 rounded"></div>
              Trabajo realizado
            </Button>
            
            <Button
              onClick={() => handleWorkTypeClick('diagnostico')}
              className="flex items-center justify-start gap-3 h-12 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <div className="w-4 h-4 bg-blue-700 rounded"></div>
              Diagnóstico
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}