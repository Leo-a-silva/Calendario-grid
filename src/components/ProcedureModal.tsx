
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

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
    { id: 'diagnostico', name: 'Diagnóstico', icon: '🔍' },
    { id: 'limpieza', name: 'Limpieza', icon: '🧽' },
    { id: 'extraccion', name: 'Extracción', icon: '🔧' },
    { id: 'endodoncia', name: 'Endodoncia', icon: '⚕️' },
    { id: 'restauracion', name: 'Restauración', icon: '🦷' },
    { id: 'radiologia', name: 'Radiología', icon: '📱' },
    { id: 'oclusion', name: 'Oclusión', icon: '🦷' },
    { id: 'emergencia', name: 'Emergencia', icon: '🚨' },
    { id: 'implante', name: 'Implante', icon: '🔩' },
    { id: 'estetica', name: 'Estética', icon: '✨' },
    { id: 'puente', name: 'Puente', icon: '🌉' },
    { id: 'cortico', name: 'Cortico', icon: '🛡️' },
    { id: 'aparatologia', name: 'Aparatología', icon: '🔧' },
    { id: 'periodontologia', name: 'Periodontología', icon: '🦷' },
    { id: 'cirugia', name: 'Cirugía', icon: '⚕️' },
    { id: 'ortodoncia', name: 'Ortodoncia', icon: '🔧' },
    { id: 'prevencion', name: 'Prevención', icon: '🛡️' },
    { id: 'fluor', name: 'Flúor', icon: '💧' },
    { id: 'prequirurgico', name: 'Prequirúrgico', icon: '⚕️' }
  ];

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Seleccionar la tarea que desea realizar
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

          {/* Grid de procedimientos */}
          <div className="grid grid-cols-5 gap-3">
            {procedures.map((procedure) => (
              <Button
                key={procedure.id}
                variant="outline"
                className="flex flex-col items-center gap-2 h-20 hover:bg-gray-50"
                onClick={() => handleProcedureClick(procedure.id)}
              >
                <span className="text-2xl">{procedure.icon}</span>
                <span className="text-xs text-center">{procedure.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
