import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type WorkType = 'pendiente' | 'realizado' | 'diagnostico' | 'select-area';

interface WorkTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  onWorkTypeSelect: (workType: WorkType) => void;
}

export function WorkTypeModal({ isOpen, onClose, toothNumber, onWorkTypeSelect }: WorkTypeModalProps) {
  const handleWorkTypeClick = (workType: WorkType) => {
    onWorkTypeSelect(workType);
    if (workType !== 'select-area') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar tipo de tarea - Diente {toothNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <p className="text-sm text-gray-600 mb-6">
            Seleccione el tipo de trabajo para el diente {toothNumber}:
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
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O seleccione área específica
                </span>
              </div>
            </div>
            
            <Button
              onClick={() => handleWorkTypeClick('select-area')}
              variant="outline"
              className="flex items-center justify-center gap-3 h-12 border-dashed border-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-3d">
                <path d="M5 3v16h16"/>
                <path d="m5 19 6-6"/>
                <path d="m2 6 3-3 3 3"/>
                <path d="m3 16 7-7 2 2 7-7"/>
              </svg>
              Seleccionar área del diente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}