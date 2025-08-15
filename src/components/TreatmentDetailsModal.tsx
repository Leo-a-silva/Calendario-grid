import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Procedure {
  type: string;
  status: string;
  segments: string[];
  date?: Date;
}

interface TreatmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number;
  procedures: Procedure[];
}

export function TreatmentDetailsModal({ isOpen, onClose, toothNumber, procedures }: TreatmentDetailsModalProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'diagnostico':
        return 'Diagnóstico';
      case 'realizado':
        return 'Realizado';
      case 'pendiente':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'diagnostico':
        return 'bg-blue-100 text-blue-800';
      case 'realizado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'diagnostico': 'Diagnóstico',
      'limpieza': 'Limpieza',
      'obturacion': 'Obturación',
      'extraccion': 'Extracción',
      'endodoncia': 'Endodoncia',
      'corona': 'Corona',
      'blanqueamiento': 'Blanqueamiento',
      'radiografias': 'Radiografías',
      'selladores': 'Selladores',
      'implantes': 'Implantes',
      'puentes': 'Puentes',
      'carillas': 'Carillas',
      'apicectomia': 'Apicectomía',
      'prostodoncia': 'Prostodoncia',
      'cirugia': 'Cirugía',
      'ninguno': 'Ninguno'
    };
    return types[type] || type;
  };

  if (!procedures || procedures.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Diente {toothNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {procedures.map((procedure, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{getTypeLabel(procedure.type)}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(procedure.status)}`}>
                      {getStatusLabel(procedure.status)}
                    </span>
                  </div>
                </div>
                {procedure.date && (
                  <div className="text-sm text-gray-500">
                    {format(new Date(procedure.date), "PPP", { locale: es })}
                  </div>
                )}
              </div>
              
              {procedure.segments && procedure.segments.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Caras tratadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {procedure.segments.map((segment, segIndex) => (
                      <span 
                        key={segIndex}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {segment === 'oclusal' ? 'Oclusal' : 
                         segment === 'vestibular' ? 'Vestibular' :
                         segment === 'lingual' ? 'Lingual' :
                         segment === 'mesial' ? 'Mesial' : 'Distal'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
