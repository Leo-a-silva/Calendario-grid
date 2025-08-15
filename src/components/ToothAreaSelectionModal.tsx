import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ToothAreaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAreaSelect: (area: string) => void;
  toothNumber: number;
}

export function ToothAreaSelectionModal({ isOpen, onClose, onAreaSelect, toothNumber }: ToothAreaSelectionModalProps) {
  const areas = [
    { id: 'oclusal', label: 'Oclusal' },
    { id: 'vestibular', label: 'Vestibular' },
    { id: 'lingual', label: 'Lingual' },
    { id: 'mesial', label: 'Mesial' },
    { id: 'distal', label: 'Distal' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar área - Diente {toothNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <p className="text-sm text-gray-600 mb-6">
            Seleccione el área del diente {toothNumber} que desea tratar:
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {areas.map((area) => (
              <Button
                key={area.id}
                variant="outline"
                className="h-16 flex items-center justify-center text-center"
                onClick={() => onAreaSelect(area.id)}
              >
                {area.label}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
