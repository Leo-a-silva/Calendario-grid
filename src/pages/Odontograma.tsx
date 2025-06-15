
import { useState } from "react";
import { OdontogramaChart } from "@/components/OdontogramaChart";
import { Card, CardContent } from "@/components/ui/card";

const Odontograma = () => {
  const [denticionType, setDenticionType] = useState<'permanente' | 'primaria'>('permanente');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <OdontogramaChart denticionType={denticionType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Odontograma;
