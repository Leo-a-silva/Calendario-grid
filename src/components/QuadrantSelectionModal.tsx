
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuadrantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  segmentName: string | null;
  onConfirm: () => void;
}

export function QuadrantSelectionModal({ 
  isOpen, 
  onClose, 
  toothNumber, 
  segmentName,
  onConfirm
}: QuadrantSelectionModalProps) {
  const getSegmentDisplayName = (segment: string | null) => {
    const segmentNames: { [key: string]: string } = {
      'vestibular': 'Vestibular',
      'lingual': 'Lingual', 
      'mesial': 'Mesial',
      'distal': 'Distal',
      'oclusal': 'Oclusal'
    };
    return segment ? segmentNames[segment] || segment : '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-base text-gray-700">
            Seleccionar Cuadrante
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Desea seleccionar el cuadrante <strong>{getSegmentDisplayName(segmentName)}</strong> del diente <strong>{toothNumber}</strong>?
          </p>
          
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              Seleccionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
