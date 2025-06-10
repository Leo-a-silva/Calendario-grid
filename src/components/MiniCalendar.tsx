
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

     <div className="w-80 bg-white rounded-md border p-4">
  <h2 className="text-sm font-medium text-gray-700 mb-2">Mi calendario</h2>

  <div className="space-y-2">
    {/* Recordatorio */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="recordatorio"
        defaultChecked
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      <div className="w-3 h-3 bg-cyan-500 rounded-sm"></div>
      <label htmlFor="recordatorio" className="text-sm text-gray-700">
        Recordatorio
      </label>
    </div>

    {/* Turnos */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="turnos"
        defaultChecked
        className="form-checkbox h-4 w-4 text-green-600"
      />
      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
      <label htmlFor="turnos" className="text-sm text-gray-700">
        Turnos
      </label>
    </div>

    {/* Tareas */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="tareas"
        defaultChecked
        className="form-checkbox h-4 w-4 text-cyan-600"
      />
      <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
      <label htmlFor="tareas" className="text-sm text-gray-700">
        Tareas
      </label>
    </div>

    {/* Inhabilitado */}
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="inhabilitado"
        defaultChecked
        className="form-checkbox h-4 w-4 text-gray-600"
      />
      <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
      <label htmlFor="inhabilitado" className="text-sm text-gray-700">
        Inhabilitado
      </label>
    </div>
  </div>
</div>

    </div>
  );
}
