 import { useState, useCallback, useRef, useEffect } from 'react';
 
 interface VoiceRecognitionResult {
   transcript: string;
   confidence: number;
 }
 
 interface UseVoiceRecognitionProps {
   onResult?: (result: VoiceRecognitionResult) => void;
   onError?: (error: string) => void;
   language?: string;
 }
 
 interface UseVoiceRecognitionReturn {
   isListening: boolean;
   isSupported: boolean;
   transcript: string;
   startListening: () => void;
   stopListening: () => void;
   error: string | null;
 }
 
 // Web Speech API types
 interface SpeechRecognitionResultItem {
   transcript: string;
   confidence: number;
 }
 
 interface SpeechRecognitionResultList {
   readonly length: number;
   item(index: number): SpeechRecognitionResult;
   [index: number]: SpeechRecognitionResult;
 }
 
 interface SpeechRecognitionResult {
   readonly length: number;
   readonly isFinal: boolean;
   item(index: number): SpeechRecognitionResultItem;
   [index: number]: SpeechRecognitionResultItem;
 }
 
 interface SpeechRecognitionEventType {
   readonly resultIndex: number;
   readonly results: SpeechRecognitionResultList;
 }
 
 interface SpeechRecognitionErrorEventType {
   readonly error: string;
   readonly message: string;
 }
 
 interface SpeechRecognitionInstance {
   continuous: boolean;
   interimResults: boolean;
   lang: string;
   onstart: (() => void) | null;
   onend: (() => void) | null;
   onresult: ((event: SpeechRecognitionEventType) => void) | null;
   onerror: ((event: SpeechRecognitionErrorEventType) => void) | null;
   start: () => void;
   stop: () => void;
   abort: () => void;
 }
 
 // Extend Window interface for SpeechRecognition
 declare global {
   interface Window {
     SpeechRecognition: new () => SpeechRecognitionInstance;
     webkitSpeechRecognition: new () => SpeechRecognitionInstance;
   }
 }
 
 export function useVoiceRecognition({
   onResult,
   onError,
   language = 'es-ES'
 }: UseVoiceRecognitionProps = {}): UseVoiceRecognitionReturn {
   const [isListening, setIsListening] = useState(false);
   const [transcript, setTranscript] = useState('');
   const [error, setError] = useState<string | null>(null);
   const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
 
   const isSupported = typeof window !== 'undefined' && 
     ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
 
   useEffect(() => {
     if (!isSupported) return;
 
     const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
     const recognition = new SpeechRecognitionConstructor();
     
     recognition.continuous = true;
     recognition.interimResults = true;
     recognition.lang = language;
 
     recognition.onstart = () => {
       setIsListening(true);
       setError(null);
       console.log('Voice recognition started');
     };
 
     recognition.onend = () => {
       setIsListening(false);
       console.log('Voice recognition ended');
     };
 
     recognition.onresult = (event: SpeechRecognitionEventType) => {
       const lastResult = event.results[event.results.length - 1];
       
       if (lastResult.isFinal) {
         const finalTranscript = lastResult[0].transcript.trim();
         const confidence = lastResult[0].confidence;
         
         setTranscript(finalTranscript);
         console.log('Voice recognition result:', finalTranscript, 'confidence:', confidence);
         
         onResult?.({ transcript: finalTranscript, confidence });
       } else {
         // Interim result - show partial transcript
         const interimTranscript = lastResult[0].transcript;
         setTranscript(interimTranscript);
       }
     };
 
     recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
       console.error('Voice recognition error:', event.error);
       let errorMessage = 'Error de reconocimiento de voz';
       
       switch (event.error) {
         case 'no-speech':
           errorMessage = 'No se detectó ninguna voz';
           break;
         case 'audio-capture':
           errorMessage = 'No se encontró micrófono';
           break;
         case 'not-allowed':
           errorMessage = 'Permiso de micrófono denegado';
           break;
         case 'network':
           errorMessage = 'Error de red';
           break;
         case 'aborted':
           errorMessage = 'Reconocimiento cancelado';
           break;
       }
       
       setError(errorMessage);
       setIsListening(false);
       onError?.(errorMessage);
     };
 
     recognitionRef.current = recognition;
 
     return () => {
       recognition.stop();
     };
   }, [isSupported, language, onResult, onError]);
 
   const startListening = useCallback(() => {
     if (!recognitionRef.current || !isSupported) return;
     
     setTranscript('');
     setError(null);
     
     try {
       recognitionRef.current.start();
     } catch (err) {
       console.error('Failed to start recognition:', err);
       setError('Error al iniciar el reconocimiento de voz');
     }
   }, [isSupported]);
 
   const stopListening = useCallback(() => {
     if (!recognitionRef.current) return;
     
     try {
       recognitionRef.current.stop();
     } catch (err) {
       console.error('Failed to stop recognition:', err);
     }
   }, []);
 
   return {
     isListening,
     isSupported,
     transcript,
     startListening,
     stopListening,
     error
   };
 }