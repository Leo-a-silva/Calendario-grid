
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
  const getSegmentColor = (segment: string) => {
    const procedureForSegment = procedures.find(p => p.segments.includes(segment as any));
    if (!procedureForSegment) return 'white';
    
    switch (procedureForSegment.status) {
      case 'diagnostico': return '#3B82F6'; // Azul
      case 'pendiente': return '#EF4444'; // Rojo
      case 'realizado': return '#10B981'; // Verde
      default: return 'white';
    }
  };

  // Determinar si es diente superior o inferior
  const isUpper = number >= 11 && number <= 28 || number >= 51 && number <= 65;

  // Determinar el tipo de diente basado en el número
  const getToothType = (num: number): 'incisor' | 'canine' | 'premolar' | 'molar' => {
    const lastDigit = num % 10;
    if (lastDigit === 1 || lastDigit === 2) return 'incisor';
    if (lastDigit === 3) return 'canine';
    if (lastDigit === 4 || lastDigit === 5) return 'premolar';
    return 'molar';
  };

  const toothType = getToothType(number);

  const renderToothDrawing = () => {
    const commonProps = {
      fill: "#e5e7eb",
      stroke: "#9ca3af",
      strokeWidth: "1"
    };

    if (toothType === 'incisor') {
      return (
        <path
          d="M15 5 C20 5, 25 5, 30 5 C32 5, 35 7, 35 12 L35 35 C35 42, 30 45, 22.5 45 C15 45, 10 42, 10 35 L10 12 C10 7, 13 5, 15 5 Z"
          {...commonProps}
        />
      );
    }

    if (toothType === 'canine') {
      return (
        <path
          d="M15 8 C18 5, 22 3, 22.5 3 C23 3, 27 5, 30 8 C33 10, 35 15, 35 20 L35 35 C35 42, 30 45, 22.5 45 C15 45, 10 42, 10 35 L10 20 C10 15, 12 10, 15 8 Z"
          {...commonProps}
        />
      );
    }

    if (toothType === 'premolar') {
      return (
        <ellipse
          cx="22.5"
          cy="25"
          rx="12"
          ry="15"
          {...commonProps}
        />
      );
    }

    // Molar
    return (
      <rect
        x="8"
        y="12"
        width="29"
        height="26"
        rx="6"
        ry="6"
        {...commonProps}
      />
    );
  };

  const renderCircleSegments = () => {
    const centerX = 22.5;
    const centerY = 25;
    const radius = 15;

    return (
      <g>
        {/* Círculo base */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="white"
          stroke="#9ca3af"
          strokeWidth="1"
        />
        
        {/* Segmento Superior (Vestibular) */}
        <path
          d={`M ${centerX} ${centerY} L ${centerX} ${centerY - radius} A ${radius} ${radius} 0 0 1 ${centerX + radius * 0.707} ${centerY - radius * 0.707} Z`}
          fill={getSegmentColor('vestibular')}
          stroke="#9ca3af"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
        
        {/* Segmento Derecho (Distal) */}
        <path
          d={`M ${centerX} ${centerY} L ${centerX + radius * 0.707} ${centerY - radius * 0.707} A ${radius} ${radius} 0 0 1 ${centerX + radius * 0.707} ${centerY + radius * 0.707} Z`}
          fill={getSegmentColor('distal')}
          stroke="#9ca3af"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
        
        {/* Segmento Inferior (Lingual) */}
        <path
          d={`M ${centerX} ${centerY} L ${centerX + radius * 0.707} ${centerY + radius * 0.707} A ${radius} ${radius} 0 0 1 ${centerX - radius * 0.707} ${centerY + radius * 0.707} Z`}
          fill={getSegmentColor('lingual')}
          stroke="#9ca3af"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
        
        {/* Segmento Izquierdo (Mesial) */}
        <path
          d={`M ${centerX} ${centerY} L ${centerX - radius * 0.707} ${centerY + radius * 0.707} A ${radius} ${radius} 0 0 1 ${centerX - radius * 0.707} ${centerY - radius * 0.707} Z`}
          fill={getSegmentColor('mesial')}
          stroke="#9ca3af"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
        
        {/* Segmento Central (Oclusal) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.4}
          fill={getSegmentColor('oclusal')}
          stroke="#9ca3af"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        />
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Dibujo del diente arriba */}
      <svg width="45" height="50" viewBox="0 0 45 50" className="hover:opacity-90">
        {renderToothDrawing()}
      </svg>
      
      {/* Círculo con segmentos abajo */}
      <div className="relative">
        <svg width="45" height="50" viewBox="0 0 45 50" className="hover:opacity-90">
          {renderCircleSegments()}
        </svg>
        
        {/* Número del diente */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-semibold text-blue-600 bg-white px-1 rounded border">{number}</span>
        </div>
      </div>
    </div>
  );
}
