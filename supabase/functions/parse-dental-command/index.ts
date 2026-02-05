 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 interface DentalCommand {
   action: 'apply_treatment' | 'remove_treatment' | 'change_status' | 'unknown';
   toothNumber: number | null;
   treatment: string | null;
   area: string | null;
   status: 'diagnostico' | 'pendiente' | 'realizado' | null;
   confidence: number;
   message: string;
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { transcript, availableTreatments, availableTeeth } = await req.json();
     
     if (!transcript) {
       return new Response(
         JSON.stringify({ error: "Transcript is required" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     if (!LOVABLE_API_KEY) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     const systemPrompt = `Eres un asistente especializado en odontología que interpreta comandos de voz para un odontograma digital.
 
 Tu tarea es analizar el comando de voz del odontólogo y extraer la información estructurada.
 
 TRATAMIENTOS DISPONIBLES (usa exactamente estos IDs):
 ${availableTreatments?.join(', ') || 'diagnostico, limpieza, obturacion, extraccion, blanqueamiento, radiografias, selladores, endodoncia, implantes, coronas, puentes, carillas, apicectomia, prostodoncia, cirugia, ortodoncia, placa, periodoncia, fluor, frenectomia'}
 
 ÁREAS DEL DIENTE (usa exactamente estos nombres):
 - oclusal (cara superior/masticatoria)
 - vestibular (cara externa/frente)
 - lingual o palatino (cara interna/lengua)
 - mesial (cara hacia el centro de la boca)
 - distal (cara hacia el fondo de la boca)
 
 ESTADOS POSIBLES:
 - diagnostico (hallazgo/observación)
 - pendiente (trabajo por hacer)
 - realizado (trabajo completado)
 
 NÚMEROS DE DIENTES VÁLIDOS (Sistema FDI):
 - Permanentes superiores: 18-11 (derecho), 21-28 (izquierdo)
 - Permanentes inferiores: 48-41 (derecho), 31-38 (izquierdo)
 - Temporales superiores: 55-51 (derecho), 61-65 (izquierdo)
 - Temporales inferiores: 85-81 (derecho), 71-75 (izquierdo)
 
 SINÓNIMOS COMUNES:
 - "caries" = obturacion (como diagnóstico)
 - "empaste" = obturacion
 - "limpieza dental", "profilaxis" = limpieza
 - "sacar el diente", "extraer" = extraccion
 - "conducto", "matar el nervio" = endodoncia
 - "funda", "tapa" = coronas
 - "implante dental" = implantes
 - "frenos", "brackets" = ortodoncia
 - "blanquear" = blanqueamiento
 - "placa de descanso", "férula" = placa
 - "rayos", "placa" (en contexto de diagnóstico) = radiografias
 
 Responde SIEMPRE en formato JSON con esta estructura exacta:
 {
   "action": "apply_treatment" | "remove_treatment" | "change_status" | "unknown",
   "toothNumber": número o null,
   "treatment": "id_del_tratamiento" o null,
   "area": "nombre_del_area" o null (si no se especifica, se aplicará a todo el diente),
   "status": "diagnostico" | "pendiente" | "realizado" | null,
   "confidence": número entre 0 y 1,
   "message": "descripción breve de la acción a realizar"
 }
 
 Si el comando no es claro o no tiene sentido, usa action: "unknown" y explica en message qué información falta.`;
 
     const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${LOVABLE_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "google/gemini-3-flash-preview",
         messages: [
           { role: "system", content: systemPrompt },
           { role: "user", content: `Interpreta este comando de voz: "${transcript}"` }
         ],
         temperature: 0.1,
       }),
     });
 
     if (!response.ok) {
       if (response.status === 429) {
         return new Response(
           JSON.stringify({ error: "Límite de solicitudes excedido, intente más tarde" }),
           { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       if (response.status === 402) {
         return new Response(
           JSON.stringify({ error: "Créditos agotados, por favor recargue" }),
           { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
       const errorText = await response.text();
       console.error("AI gateway error:", response.status, errorText);
       throw new Error("Error en el servicio de AI");
     }
 
     const aiResponse = await response.json();
     const content = aiResponse.choices?.[0]?.message?.content;
 
     if (!content) {
       throw new Error("No response from AI");
     }
 
     // Parse JSON from the response
     let parsedCommand: DentalCommand;
     try {
       // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
       const jsonMatch = content.match(/\{[\s\S]*\}/);
       if (jsonMatch) {
         parsedCommand = JSON.parse(jsonMatch[0]);
       } else {
         throw new Error("No JSON found in response");
       }
     } catch (parseError) {
       console.error("Failed to parse AI response:", content);
       parsedCommand = {
         action: 'unknown',
         toothNumber: null,
         treatment: null,
         area: null,
         status: null,
         confidence: 0,
         message: 'No se pudo interpretar el comando'
       };
     }
 
     console.log("Parsed dental command:", parsedCommand);
 
     return new Response(
       JSON.stringify(parsedCommand),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
 
   } catch (error) {
     console.error("Error parsing dental command:", error);
     return new Response(
       JSON.stringify({ 
         error: error instanceof Error ? error.message : "Error desconocido",
         action: 'unknown',
         toothNumber: null,
         treatment: null,
         area: null,
         status: null,
         confidence: 0,
         message: 'Error al procesar el comando'
       }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });