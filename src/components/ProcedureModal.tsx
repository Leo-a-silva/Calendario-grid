
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
}

export function ProcedureModal({ isOpen, onClose, toothNumber }: ProcedureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Procedimientos para el diente {toothNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Modal para futuras funcionalidades del diente {toothNumber}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
