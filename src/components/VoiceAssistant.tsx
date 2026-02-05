 import { useState, useCallback } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Mic, MicOff, Loader2, Volume2, AlertCircle, CheckCircle2, X } from 'lucide-react';
 import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from '@/hooks/use-toast';
 import { cn } from '@/lib/utils';
 
 interface DentalCommand {
   action: 'apply_treatment' | 'remove_treatment' | 'change_status' | 'unknown';
   toothNumber: number | null;
   treatment: string | null;
   area: string | null;
   status: 'diagnostico' | 'pendiente' | 'realizado' | null;
   confidence: number;
   message: string;
 }
 
 interface VoiceAssistantProps {
   onCommand: (command: DentalCommand) => void;
   availableTreatments?: string[];
   availableTeeth?: number[];
   className?: string;
 }
 
 export function VoiceAssistant({ 
   onCommand, 
   availableTreatments,
   availableTeeth,
   className 
 }: VoiceAssistantProps) {
   const [isProcessing, setIsProcessing] = useState(false);
   const [lastCommand, setLastCommand] = useState<DentalCommand | null>(null);
   const [showFeedback, setShowFeedback] = useState(false);
 
   const processTranscript = useCallback(async (transcript: string) => {
     if (!transcript.trim()) return;
     
     setIsProcessing(true);
     setShowFeedback(true);
     
     try {
       console.log('Processing transcript:', transcript);
       
       const { data, error } = await supabase.functions.invoke('parse-dental-command', {
         body: { 
           transcript,
           availableTreatments,
           availableTeeth
         }
       });
 
       if (error) {
         console.error('Error from edge function:', error);
         toast({
           title: "Error al procesar comando",
           description: error.message || "No se pudo interpretar el comando de voz",
           variant: "destructive"
         });
         return;
       }
 
       const command = data as DentalCommand;
       setLastCommand(command);
       
       if (command.action === 'unknown') {
         toast({
           title: "Comando no reconocido",
           description: command.message || "Por favor, intente de nuevo con un comando más claro",
           variant: "destructive"
         });
       } else {
         // Execute the command
         onCommand(command);
         
         toast({
           title: "Comando ejecutado",
           description: command.message,
         });
       }
     } catch (error) {
       console.error('Error processing voice command:', error);
       toast({
         title: "Error",
         description: "Error al procesar el comando de voz",
         variant: "destructive"
       });
     } finally {
       setIsProcessing(false);
     }
   }, [onCommand, availableTreatments, availableTeeth]);
 
   const {
     isListening,
     isSupported,
     transcript,
     startListening,
     stopListening,
     error
   } = useVoiceRecognition({
     onResult: (result) => {
       console.log('Voice result received:', result);
       processTranscript(result.transcript);
     },
     onError: (errorMessage) => {
       toast({
         title: "Error de micrófono",
         description: errorMessage,
         variant: "destructive"
       });
     }
   });
 
   const handleToggleListening = () => {
     if (isListening) {
       stopListening();
     } else {
       setLastCommand(null);
       setShowFeedback(false);
       startListening();
     }
   };
 
   if (!isSupported) {
     return (
       <Card className={cn("bg-yellow-50 border-yellow-200", className)}>
         <CardContent className="p-4 flex items-center gap-3">
           <AlertCircle className="h-5 w-5 text-yellow-600" />
           <p className="text-sm text-yellow-700">
             Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.
           </p>
         </CardContent>
       </Card>
     );
   }
 
   return (
     <Card className={cn(
       "transition-all duration-300",
       isListening && "ring-2 ring-primary ring-offset-2",
       className
     )}>
       <CardContent className="p-4">
         <div className="flex flex-col gap-4">
           {/* Main controls */}
           <div className="flex items-center gap-4">
             <Button
               size="lg"
               variant={isListening ? "destructive" : "default"}
               className={cn(
                 "h-14 w-14 rounded-full p-0 transition-all",
                 isListening && "animate-pulse"
               )}
               onClick={handleToggleListening}
               disabled={isProcessing}
             >
               {isProcessing ? (
                 <Loader2 className="h-6 w-6 animate-spin" />
               ) : isListening ? (
                 <MicOff className="h-6 w-6" />
               ) : (
                 <Mic className="h-6 w-6" />
               )}
             </Button>
 
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-semibold text-sm">Asistente de Voz</h3>
                 {isListening && (
                   <Badge variant="secondary" className="bg-red-100 text-red-700 animate-pulse">
                     <Volume2 className="h-3 w-3 mr-1" />
                     Escuchando...
                   </Badge>
                 )}
                 {isProcessing && (
                   <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                     <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                     Procesando...
                   </Badge>
                 )}
               </div>
               
               <p className="text-xs text-muted-foreground">
                 {isListening 
                   ? "Diga un comando como: \"Caries en vestibular del diente 15\""
                   : "Presione el botón para comenzar"}
               </p>
             </div>
           </div>
 
           {/* Transcript display */}
           {(transcript || isListening) && (
             <div className="bg-muted/50 rounded-lg p-3 min-h-[40px]">
               <p className="text-sm text-foreground">
                 {transcript || (
                   <span className="text-muted-foreground italic">Esperando...</span>
                 )}
               </p>
             </div>
           )}
 
           {/* Error display */}
           {error && (
             <div className="flex items-center gap-2 text-destructive text-sm">
               <AlertCircle className="h-4 w-4" />
               <span>{error}</span>
             </div>
           )}
 
           {/* Command feedback */}
           {showFeedback && lastCommand && (
             <div className={cn(
               "rounded-lg p-3 flex items-start gap-3",
               lastCommand.action === 'unknown' 
                 ? "bg-yellow-50 border border-yellow-200" 
                 : "bg-green-50 border border-green-200"
             )}>
               {lastCommand.action === 'unknown' ? (
                 <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
               ) : (
                 <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
               )}
               
               <div className="flex-1 min-w-0">
                 <p className={cn(
                   "text-sm font-medium",
                   lastCommand.action === 'unknown' ? "text-yellow-800" : "text-green-800"
                 )}>
                   {lastCommand.message}
                 </p>
                 
                 {lastCommand.action !== 'unknown' && (
                   <div className="flex flex-wrap gap-2 mt-2">
                     {lastCommand.toothNumber && (
                       <Badge variant="outline" className="text-xs">
                         Diente: {lastCommand.toothNumber}
                       </Badge>
                     )}
                     {lastCommand.treatment && (
                       <Badge variant="outline" className="text-xs">
                         Tratamiento: {lastCommand.treatment}
                       </Badge>
                     )}
                     {lastCommand.area && (
                       <Badge variant="outline" className="text-xs">
                         Área: {lastCommand.area}
                       </Badge>
                     )}
                     {lastCommand.status && (
                       <Badge variant="outline" className="text-xs">
                         Estado: {lastCommand.status}
                       </Badge>
                     )}
                   </div>
                 )}
               </div>
 
               <Button
                 variant="ghost"
                 size="icon"
                 className="h-6 w-6 shrink-0"
                 onClick={() => setShowFeedback(false)}
               >
                 <X className="h-4 w-4" />
               </Button>
             </div>
           )}
 
           {/* Example commands */}
           {!isListening && !showFeedback && (
             <div className="text-xs text-muted-foreground space-y-1">
               <p className="font-medium">Ejemplos de comandos:</p>
               <ul className="list-disc list-inside space-y-0.5 pl-2">
                 <li>"Caries en vestibular del diente 15"</li>
                 <li>"Obturación realizada en oclusal del 36"</li>
                 <li>"Endodoncia pendiente en el 11"</li>
                 <li>"Extracción en el diente 48"</li>
               </ul>
             </div>
           )}
         </div>
       </CardContent>
     </Card>
   );
 }