
interface Procedure {
  type: 'diagnostico' | 'limpieza' | 'obturacion' | 'extraccion' | 'endodoncia' | 'corona' | 'ninguno';
  status: 'diagnostico' | 'realizado' | 'pendiente';
  segments: ('superior' | 'inferior' | 'izquierdo' | 'derecho' | 'centro')[];
}

interface ToothComponentProps {
  number: number;
  procedures: Procedure[];
  onSegmentClick: (segment: 'superior' | 'inferior' | 'izquierdo' | 'derecho' | 'centro') => void;
}

export function ToothComponent({ number, procedures, onSegmentClick }: ToothComponentProps) {
  const getSegmentColor = (segment: 'superior' | 'inferior' | 'izquierdo' | 'derecho' | 'centro') => {
    const procedure = procedures.find(p => p.segments.includes(segment));
    if (!procedure) return 'transparent';
    
    switch (procedure.status) {
      case 'diagnostico': return '#3B82F6'; // Azul
      case 'pendiente': return '#EF4444'; // Rojo
      case 'realizado': return '#10B981'; // Verde
      default: return 'transparent';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative w-12 h-12">
        <svg width="48" height="48" viewBox="0 0 48 48" className="cursor-pointer">
          {/* Círculo base */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="white"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Segmento superior */}
          <path
            d="M 24 4 A 20 20 0 0 1 39.28 14 L 24 24 Z"
            fill={getSegmentColor('superior')}
            stroke="#374151"
            strokeWidth="1"
            onClick={() => onSegmentClick('superior')}
            className="hover:opacity-80"
          />
          
          {/* Segmento derecho */}
          <path
            d="M 39.28 14 A 20 20 0 0 1 39.28 34 L 24 24 Z"
            fill={getSegmentColor('derecho')}
            stroke="#374151"
            strokeWidth="1"
            onClick={() => onSegmentClick('derecho')}
            className="hover:opacity-80"
          />
          
          {/* Segmento inferior */}
          <path
            d="M 39.28 34 A 20 20 0 0 1 8.72 34 L 24 24 Z"
            fill={getSegmentColor('inferior')}
            stroke="#374151"
            strokeWidth="1"
            onClick={() => onSegmentClick('inferior')}
            className="hover:opacity-80"
          />
          
          {/* Segmento izquierdo */}
          <path
            d="M 8.72 34 A 20 20 0 0 1 8.72 14 L 24 24 Z"
            fill={getSegmentColor('izquierdo')}
            stroke="#374151"
            strokeWidth="1"
            onClick={() => onSegmentClick('izquierdo')}
            className="hover:opacity-80"
          />
          
          {/* Centro */}
          <circle
            cx="24"
            cy="24"
            r="6"
            fill={getSegmentColor('centro')}
            stroke="#374151"
            strokeWidth="1"
            onClick={() => onSegmentClick('centro')}
            className="hover:opacity-80 cursor-pointer"
          />
          
          {/* Número del diente */}
          <text
            x="24"
            y="28"
            textAnchor="middle"
            className="text-xs font-bold fill-gray-700 pointer-events-none"
          >
            {number}
          </text>
        </svg>
      </div>
    </div>
  );
}
