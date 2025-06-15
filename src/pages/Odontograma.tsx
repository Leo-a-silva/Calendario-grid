
import { useState } from "react";
import { OdontogramaChart } from "@/components/OdontogramaChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Odontograma = () => {
  const [denticionType, setDenticionType] = useState<'permanente' | 'primaria'>('permanente');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Odontograma Digital
            </CardTitle>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                variant={denticionType === 'permanente' ? 'default' : 'outline'}
                onClick={() => setDenticionType('permanente')}
              >
                Dentición Permanente
              </Button>
              <Button
                variant={denticionType === 'primaria' ? 'default' : 'outline'}
                onClick={() => setDenticionType('primaria')}
              >
                Dentición Primaria
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OdontogramaChart denticionType={denticionType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Odontograma;
