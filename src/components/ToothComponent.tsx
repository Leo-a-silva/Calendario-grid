
interface Procedure {
  type: 'diagnostico' | 'limpieza' | 'obturacion' | 'extraccion' | 'endodoncia' | 'corona' | 'ninguno';
  status: 'diagnostico' | 'realizado' | 'pendiente';
  segments: ('oclusal' | 'vestibular' | 'lingual' | 'mesial' | 'distal')[];
}

interface ToothComponentProps {
  number: number;
  procedures: Procedure[];
  onClick: () => void;
}

export function ToothComponent({ number, procedures, onClick }: ToothComponentProps) {
  const getToothColor = () => {
    if (procedures.length === 0) return 'white';
    
    const latestProcedure = procedures[procedures.length - 1];
    switch (latestProcedure.status) {
      case 'diagnostico': return '#3B82F6'; // Azul
      case 'pendiente': return '#EF4444'; // Rojo
      case 'realizado': return '#10B981'; // Verde
      default: return 'white';
    }
  };

  // Determinar si es diente anterior, premolar o molar basado en el número
  const getToothType = (num: number): 'anterior' | 'premolar' | 'molar' => {
    const lastDigit = num % 10;
    if (lastDigit >= 1 && lastDigit <= 3) return 'anterior';
    if (lastDigit >= 4 && lastDigit <= 5) return 'premolar';
    return 'molar';
  };

  const toothType = getToothType(number);
  const toothColor = getToothColor();

  // SVG path para diferentes tipos de dientes
  const getToothPath = () => {
    switch (toothType) {
      case 'anterior':
        return "M20 5 C25 5, 30 8, 30 15 L30 35 C30 42, 25 45, 20 45 C15 45, 10 42, 10 35 L10 15 C10 8, 15 5, 20 5 Z";
      case 'premolar':
        return "M20 8 C26 8, 32 10, 32 16 L32 34 C32 40, 26 42, 20 42 C14 42, 8 40, 8 34 L8 16 C8 10, 14 8, 20 8 Z";
      case 'molar':
        return "M20 10 C28 10, 35 12, 35 18 L35 32 C35 38, 28 40, 20 40 C12 40, 5 38, 5 32 L5 18 C5 12, 12 10, 20 10 Z";
      default:
        return "M20 8 C26 8, 32 10, 32 16 L32 34 C32 40, 26 42, 20 42 C14 42, 8 40, 8 34 L8 16 C8 10, 14 8, 20 8 Z";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1 cursor-pointer" onClick={onClick}>
      <div className="relative">
        <svg width="40" height="50" viewBox="0 0 40 50" className="hover:opacity-80">
          {/* Forma del diente */}
          <path
            d={getToothPath()}
            fill={toothColor}
            stroke="#374151"
            strokeWidth="1.5"
            opacity={procedures.length > 0 ? "0.8" : "1"}
          />
          
          {/* Contorno del diente */}
          <path
            d={getToothPath()}
            fill="none"
            stroke="#374151"
            strokeWidth="1.5"
          />
        </svg>
        
        {/* Número del diente */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-semibold text-gray-700">{number}</span>
        </div>
      </div>
    </div>
  );
}
