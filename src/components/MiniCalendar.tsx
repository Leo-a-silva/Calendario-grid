
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="w-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            {format(selectedDate, "MMMM yyyy", { locale: es })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            className="rounded-none border-none p-3"
            locale={es}
          />
        </CardContent>
      </Card>

      <Card className="w-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Mi calendario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="decoraciones" defaultChecked />
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <label htmlFor="decoraciones" className="text-sm text-gray-700">
              Decoraciones
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="turnos" defaultChecked />
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <label htmlFor="turnos" className="text-sm text-gray-700">
              Turnos
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="tareas" defaultChecked />
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <label htmlFor="tareas" className="text-sm text-gray-700">
              Tareas
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="inhabilitado" defaultChecked />
            <div className="w-3 h-3 bg-gray-500 rounded-sm"></div>
            <label htmlFor="inhabilitado" className="text-sm text-gray-700">
              Inhabilitado
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
