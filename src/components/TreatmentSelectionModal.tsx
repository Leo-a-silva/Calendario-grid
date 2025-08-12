import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface TreatmentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  workType: 'pendiente' | 'realizado' | 'diagnostico' | null;
  onTreatmentSelect: (treatment: string) => void;
}

export function TreatmentSelectionModal({ 
  isOpen, 
  onClose, 
  toothNumber, 
  workType,
  onTreatmentSelect 
}: TreatmentSelectionModalProps) {
  
  const treatments = [
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

  const getWorkTypeColor = () => {
    switch (workType) {
      case 'pendiente': return 'border-red-200 bg-red-50';
      case 'realizado': return 'border-green-200 bg-green-50';
      case 'diagnostico': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getWorkTypeText = () => {
    switch (workType) {
      case 'pendiente': return 'trabajo pendiente';
      case 'realizado': return 'trabajo realizado';
      case 'diagnostico': return 'diagnóstico';
      default: return 'trabajo';
    }
  };

  const handleTreatmentClick = (treatmentId: string) => {
    onTreatmentSelect(treatmentId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seleccionar tratamiento - Diente {toothNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className={getWorkTypeColor()}>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ahora seleccione el tratamiento para aplicar como {getWorkTypeText()} al diente {toothNumber}.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {treatments.map((treatment) => (
              <Button
                key={treatment.id}
                onClick={() => handleTreatmentClick(treatment.id)}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center text-center p-2"
              >
                <span className="text-xs font-medium leading-tight">
                  {treatment.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}