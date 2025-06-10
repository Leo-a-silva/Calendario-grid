
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  return (
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
          className="rounded-none border-none p-3 pointer-events-auto"
          locale={es}
        />
      </CardContent>
    </Card>
  );
}
