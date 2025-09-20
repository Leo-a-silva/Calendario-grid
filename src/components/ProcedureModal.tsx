
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { 
  FileSearch, 
  Sparkles, 
  FileX, 
  Scissors, 
  Activity, 
  Crown,
  Wrench,
  Zap,
  CircleDot,
  Bone,
  Camera,
  Smile
} from "lucide-react";

interface ProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  onProcedureSelect: (procedure: string) => void;
}

export function ProcedureModal({ isOpen, onClose, toothNumber, onProcedureSelect }: ProcedureModalProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const tasks = [
    "Seleccionar diente completo",
    "Seleccionar cuadrantes o dentición completa", 
    "Seleccionar más dientes",
    "Seleccionar área del diente"
  ];

  const procedures = [
    { id: 'diagnostico', name: 'Diagnóstico', icon: <FileSearch className="h-6 w-6" /> },
    { id: 'limpieza', name: 'Limpieza', icon: <Sparkles className="h-6 w-6" /> },
    { id: 'obturacion', name: 'Obturación', icon: <FileX className="h-6 w-6" /> },
    { id: 'extraccion', name: 'Extracción', icon: <Scissors className="h-6 w-6" /> },
    { id: 'endodoncia', name: 'Endodoncia', icon: <Activity className="h-6 w-6" /> },
    { id: 'corona', name: 'Corona', icon: <Crown className="h-6 w-6" /> },
    { id: 'aparatologia', name: 'Aparatología', icon: <Wrench className="h-6 w-6" /> },
    { id: 'periodontologia', name: 'Periodontología', icon: <Zap className="h-6 w-6" /> },
    { id: 'cirugia', name: 'Cirugía', icon: <Scissors className="h-6 w-6" /> },
    { id: 'implante', name: 'Implante', icon: <Bone className="h-6 w-6" /> },
    { id: 'radiografia', name: 'Radiografía', icon: <Camera className="h-6 w-6" /> },
    { id: 'protesis', name: 'Prótesis', icon: <Smile className="h-6 w-6" /> }
  ];

  // Si existe un icono en public/Iconos tratamientos, úsalo
  const iconMap: Record<string, string> = {
    diagnostico: "diagnosticos.svg",
    limpieza: "limpieza.svg",
    obturacion: "obstruccion.svg",
    extraccion: "extraccion.svg",
    endodoncia: "endodoncia.svg",
    corona: "coronas.svg",
    cirugia: "cirugia_maxilofacial.svg",
    implante: "implantes.svg",
    radiografia: "radiografia.svg",
  };

  const handleTaskToggle = (task: string) => {
    setSelectedTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const handleProcedureClick = (procedureId: string) => {
    onProcedureSelect(procedureId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Diente {toothNumber} - Seleccionar tratamiento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Lista de tareas con checkboxes */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task} className="flex items-center space-x-3">
                <Checkbox 
                  id={task}
                  checked={selectedTasks.includes(task)}
                  onCheckedChange={() => handleTaskToggle(task)}
                />
                <label htmlFor={task} className="text-sm">{task}</label>
              </div>
            ))}
          </div>

          {/* Botón de seleccionar tarea */}
          <div className="flex justify-center">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8">
              Seleccionar tarea
            </Button>
          </div>

          {/* Panel de procedimientos similar a la imagen */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="grid grid-cols-6 gap-4">
              {procedures.map((procedure) => (
                <Button
                  key={procedure.id}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20 bg-white hover:bg-blue-100 border-blue-200"
                  onClick={() => handleProcedureClick(procedure.id)}
                  >
                    <span className="text-primary">
                      {iconMap[procedure.id] ? (
                        <img
                          src={`/iconos_tratamientos/${iconMap[procedure.id]}`}
                          alt={procedure.name}
                          className="h-10 w-10"
                        />
                      ) : (
                        procedure.icon
                      )}
                    </span>
                    <span className="text-xs text-center font-medium">{procedure.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
