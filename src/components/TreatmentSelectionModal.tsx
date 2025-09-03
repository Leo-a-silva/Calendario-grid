import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  AlertCircle, 
  Bone, 
  Braces, 
  CheckCircle2, 
  CircleDashed, 
  FileSearch, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Beaker, 
  HeartPulse, 
  Home, 
  LayoutTemplate, 
  Pill, 
  Scissors, 
  Stethoscope, 
  Syringe, 
  Circle, 
  XCircle, 
  Zap, 
  Info 
} from "lucide-react";

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
    { id: 'diagnostico', name: 'Diagnóstico', icon: <FileSearch className="h-5 w-5" /> },
    { id: 'limpieza', name: 'Limpieza', icon: <Zap className="h-5 w-5" /> },
    { id: 'obturacion', name: 'Obturación', icon: <Activity className="h-5 w-5" /> },
    { id: 'extraccion', name: 'Extracción', icon: <XCircle className="h-5 w-5" /> },
    { id: 'blanqueamiento', name: 'Blanqueamiento', icon: <Zap className="h-5 w-5" /> },
    { id: 'radiografias', name: 'Radiografías', icon: <FileSpreadsheet className="h-5 w-5" /> },
    { id: 'selladores', name: 'Selladores', icon: <Filter className="h-5 w-5" /> },
    { id: 'endodoncia', name: 'Endodoncia', icon: <Circle className="h-5 w-5" /> },
    { id: 'implantes', name: 'Implantes', icon: <Bone className="h-5 w-5" /> },
    { id: 'coronas', name: 'Coronas', icon: <CircleDashed className="h-5 w-5" /> },
    { id: 'puentes', name: 'Puentes', icon: <LayoutTemplate className="h-5 w-5" /> },
    { id: 'carillas', name: 'Carillas', icon: <FileText className="h-5 w-5" /> },
    { id: 'apicectomia', name: 'Apicectomía', icon: <Scissors className="h-5 w-5" /> },
    { id: 'prostodoncia', name: 'Prostodoncia', icon: <Circle className="h-5 w-5" /> },
    { id: 'cirugia', name: 'Cirugía maxilofacial', icon: <Scissors className="h-5 w-5" /> },
    { id: 'ortodoncia', name: 'Ortodoncia', icon: <Braces className="h-5 w-5" /> },
    { id: 'placa', name: 'Placa antibruxismo', icon: <Home className="h-5 w-5" /> },
    { id: 'periodoncia', name: 'Periodoncia', icon: <HeartPulse className="h-5 w-5" /> },
    { id: 'fluor', name: 'Flúor', icon: <Pill className="h-5 w-5" /> },
    { id: 'frenectomia', name: 'Frenectomía', icon: <Scissors className="h-5 w-5" /> }
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {treatments.map((treatment) => (
              <Button
                key={treatment.id}
                variant="outline"
                className="w-full justify-start gap-2 p-3 h-auto flex-col sm:flex-row text-xs sm:text-sm"
                onClick={() => handleTreatmentClick(treatment.id)}
              >
                <span className="text-primary flex-shrink-0">{treatment.icon}</span>
                <span className="text-center sm:text-left">{treatment.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}