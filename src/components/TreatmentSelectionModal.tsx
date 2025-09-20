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
  
  // Mapa de iconos: id de tratamiento -> nombre de archivo en public/Iconos tratamientos
  const iconMap: Record<string, string> = {
    diagnostico: "diagnosticos.svg",
    limpieza: "limpieza.svg",
    obturacion: "obstruccion.svg", // archivo disponible
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {treatments.map((treatment) => (
              <Button
                key={treatment.id}
                variant="outline"
                className="w-full justify-start gap-2 p-3 h-auto flex-col sm:flex-row text-xs sm:text-sm"
                onClick={() => handleTreatmentClick(treatment.id)}
              >
                <span className="text-primary flex-shrink-0">
                  {iconMap[treatment.id] ? (
                    <img
                      src={`/iconos_tratamientos/${iconMap[treatment.id]}`}
                      alt={treatment.name}
                      className="h-10 w-10"
                    />
                  ) : null}
                </span>
                <span className="text-center sm:text-left">{treatment.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}