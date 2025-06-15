
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

  // Determinar si es diente anterior, premolar o molar basado en el número
  const getToothType = (num: number): 'anterior' | 'premolar' | 'molar' => {
    const lastDigit = num % 10;
    if (lastDigit >= 1 && lastDigit <= 3) return 'anterior';
    if (lastDigit >= 4 && lastDigit <= 5) return 'premolar';
    return 'molar';
  };

  const toothType = getToothType(number);

  // Determinar si es diente superior o inferior
  const isUpper = number >= 11 && number <= 28 || number >= 51 && number <= 65;

  const renderToothSegments = () => {
    if (toothType === 'anterior') {
      return (
        <g>
          {/* Forma base del diente anterior */}
          <path
            d="M25 10 C30 10, 35 12, 35 18 L35 45 C35 50, 30 52, 25 52 C20 52, 15 50, 15 45 L15 18 C15 12, 20 10, 25 10 Z"
            fill="#f3f4f6"
            stroke="#374151"
            strokeWidth="1"
          />
          
          {/* Segmento Vestibular */}
          <path
            d="M25 10 C30 10, 35 12, 35 18 L32 20 C30 15, 27 12, 25 12 C23 12, 20 15, 18 20 L15 18 C15 12, 20 10, 25 10 Z"
            fill={getSegmentColor('vestibular')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Mesial */}
          <path
            d="M15 18 L18 20 L20 35 L15 45 C15 35, 15 25, 15 18 Z"
            fill={getSegmentColor('mesial')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Distal */}
          <path
            d="M35 18 L32 20 L30 35 L35 45 C35 35, 35 25, 35 18 Z"
            fill={getSegmentColor('distal')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Oclusal/Incisal */}
          <path
            d="M18 20 L32 20 L30 35 L20 35 Z"
            fill={getSegmentColor('oclusal')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Lingual */}
          <path
            d="M20 35 L30 35 L32 45 C30 48, 27 50, 25 50 C23 50, 20 48, 18 45 L20 35 Z"
            fill={getSegmentColor('lingual')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
        </g>
      );
    }

    if (toothType === 'premolar') {
      return (
        <g>
          {/* Forma base del premolar */}
          <ellipse
            cx="25"
            cy="31"
            rx="12"
            ry="18"
            fill="#f3f4f6"
            stroke="#374151"
            strokeWidth="1"
          />
          
          {/* Segmento Vestibular */}
          <path
            d="M25 13 C30 13, 35 16, 37 22 L32 20 C30 16, 27 15, 25 15 C23 15, 20 16, 18 20 L13 22 C15 16, 20 13, 25 13 Z"
            fill={getSegmentColor('vestibular')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Mesial */}
          <path
            d="M13 22 L18 20 L20 31 L18 42 L13 40 C11 35, 11 27, 13 22 Z"
            fill={getSegmentColor('mesial')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Distal */}
          <path
            d="M37 22 L32 20 L30 31 L32 42 L37 40 C39 35, 39 27, 37 22 Z"
            fill={getSegmentColor('distal')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Oclusal */}
          <ellipse
            cx="25"
            cy="26"
            rx="7"
            ry="6"
            fill={getSegmentColor('oclusal')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
          
          {/* Segmento Lingual */}
          <path
            d="M18 42 L32 42 L37 40 C35 45, 30 49, 25 49 C20 49, 15 45, 13 40 L18 42 Z"
            fill={getSegmentColor('lingual')}
            stroke="#374151"
            strokeWidth="0.5"
            className="cursor-pointer hover:opacity-80"
            onClick={onClick}
          />
        </g>
      );
    }

    // Molar
    return (
      <g>
        {/* Forma base del molar */}
        <rect
          x="12"
          y="16"
          width="26"
          height="28"
          rx="8"
          ry="8"
          fill="#f3f4f6"
          stroke="#374151"
          strokeWidth="1"
        />
        
        {/* Segmento Vestibular */}
        <path
          d="M20 16 C25 16, 30 16, 30 16 L32 20 L28 22 L22 22 L18 20 L20 16 Z"
          fill={getSegmentColor('vestibular')}
          stroke="#374151"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={onClick}
        />
        
        {/* Segmento Mesial */}
        <path
          d="M12 24 L18 20 L22 22 L20 30 L18 38 L12 36 C12 32, 12 28, 12 24 Z"
          fill={getSegmentColor('mesial')}
          stroke="#374151"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={onClick}
        />
        
        {/* Segmento Distal */}
        <path
          d="M38 24 L32 20 L28 22 L30 30 L32 38 L38 36 C38 32, 38 28, 38 24 Z"
          fill={getSegmentColor('distal')}
          stroke="#374151"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={onClick}
        />
        
        {/* Segmento Oclusal */}
        <rect
          x="22"
          y="22"
          width="6"
          height="16"
          rx="2"
          ry="2"
          fill={getSegmentColor('oclusal')}
          stroke="#374151"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={onClick}
        />
        
        {/* Segmento Lingual */}
        <path
          d="M18 38 L32 38 L38 36 C36 40, 32 44, 25 44 C18 44, 14 40, 12 36 L18 38 Z"
          fill={getSegmentColor('lingual')}
          stroke="#374151"
          strokeWidth="0.5"
          className="cursor-pointer hover:opacity-80"
          onClick={onClick}
        />
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative">
        <svg width="50" height="60" viewBox="0 0 50 60" className="hover:opacity-90">
          {renderToothSegments()}
        </svg>
        
        {/* Número del diente */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="text-xs font-semibold text-gray-700 bg-white px-1 rounded">{number}</span>
        </div>
      </div>
    </div>
  );
}
