
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface SegmentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
  segment: string | null;
  onTaskSelect: (tasks: string[]) => void;
}

export function SegmentSelectionModal({ 
  isOpen, 
  onClose, 
  toothNumber, 
  segment, 
  onTaskSelect 
}: SegmentSelectionModalProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const tasks = [
    "Seleccionar diente completo",
    "Seleccionar más dientes", 
    "Seleccionar cuadrantes o dentición completa",
    "Seleccionar área del diente"
  ];

  const handleTaskToggle = (task: string) => {
    setSelectedTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const handleSelectTask = () => {
    onTaskSelect(selectedTasks);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-base text-gray-700">
            Seleccione la tarea que desea realizar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Lista de tareas con checkboxes */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task} className="flex items-center space-x-3">
                <Checkbox 
                  id={task}
                  checked={selectedTasks.includes(task)}
                  onCheckedChange={() => handleTaskToggle(task)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <label htmlFor={task} className="text-sm text-gray-700">{task}</label>
              </div>
            ))}
          </div>

          {/* Botón de seleccionar tarea */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSelectTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 rounded-lg"
              disabled={selectedTasks.length === 0}
            >
              Seleccionar tarea
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
