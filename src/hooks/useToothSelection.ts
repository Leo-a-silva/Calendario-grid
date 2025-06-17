
import { useState } from 'react';

export interface ToothSelection {
  toothNumber: number;
  segments: string[];
  isComplete: boolean;
}

export interface SelectionState {
  selectedTeeth: ToothSelection[];
  selectionMode: 'single' | 'multiple' | 'quadrant' | 'complete';
}

export function useToothSelection() {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedTeeth: [],
    selectionMode: 'single'
  });

  const addToothSelection = (toothNumber: number, segments: string[] = [], isComplete: boolean = false) => {
    setSelectionState(prev => {
      const existingIndex = prev.selectedTeeth.findIndex(t => t.toothNumber === toothNumber);
      
      if (existingIndex >= 0) {
        // Update existing selection
        const updated = [...prev.selectedTeeth];
        if (isComplete) {
          updated[existingIndex] = { toothNumber, segments: ['oclusal', 'vestibular', 'lingual', 'mesial', 'distal'], isComplete: true };
        } else {
          const existingSegments = updated[existingIndex].segments;
          const newSegments = [...new Set([...existingSegments, ...segments])];
          updated[existingIndex] = { toothNumber, segments: newSegments, isComplete: false };
        }
        return { ...prev, selectedTeeth: updated };
      } else {
        // Add new selection
        const newSelection: ToothSelection = {
          toothNumber,
          segments: isComplete ? ['oclusal', 'vestibular', 'lingual', 'mesial', 'distal'] : segments,
          isComplete
        };
        return { ...prev, selectedTeeth: [...prev.selectedTeeth, newSelection] };
      }
    });
  };

  const removeToothSelection = (toothNumber: number) => {
    setSelectionState(prev => ({
      ...prev,
      selectedTeeth: prev.selectedTeeth.filter(t => t.toothNumber !== toothNumber)
    }));
  };

  const selectQuadrant = (quadrant: 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right', denticionType: 'permanente' | 'primaria') => {
    const permanentTeeth = {
      'upper-left': [18, 17, 16, 15, 14, 13, 12, 11],
      'upper-right': [21, 22, 23, 24, 25, 26, 27, 28],
      'lower-left': [48, 47, 46, 45, 44, 43, 42, 41],
      'lower-right': [31, 32, 33, 34, 35, 36, 37, 38]
    };

    const primaryTeeth = {
      'upper-left': [55, 54, 53, 52, 51],
      'upper-right': [61, 62, 63, 64, 65],
      'lower-left': [85, 84, 83, 82, 81],
      'lower-right': [71, 72, 73, 74, 75]
    };

    const teethToSelect = denticionType === 'permanente' ? permanentTeeth[quadrant] : primaryTeeth[quadrant];
    
    teethToSelect.forEach(toothNumber => {
      addToothSelection(toothNumber, [], true);
    });
  };

  const selectAllTeeth = (denticionType: 'permanente' | 'primaria') => {
    const permanentTeeth = [
      18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
      48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38
    ];

    const primaryTeeth = [
      55, 54, 53, 52, 51, 61, 62, 63, 64, 65,
      85, 84, 83, 82, 81, 71, 72, 73, 74, 75
    ];

    const allTeeth = denticionType === 'permanente' ? permanentTeeth : primaryTeeth;
    
    allTeeth.forEach(toothNumber => {
      addToothSelection(toothNumber, [], true);
    });
  };

  const clearSelection = () => {
    setSelectionState({
      selectedTeeth: [],
      selectionMode: 'single'
    });
  };

  const setSelectionMode = (mode: SelectionState['selectionMode']) => {
    setSelectionState(prev => ({ ...prev, selectionMode: mode }));
  };

  const isToothSelected = (toothNumber: number) => {
    return selectionState.selectedTeeth.some(t => t.toothNumber === toothNumber);
  };

  const isSegmentSelected = (toothNumber: number, segment: string) => {
    const tooth = selectionState.selectedTeeth.find(t => t.toothNumber === toothNumber);
    return tooth ? tooth.segments.includes(segment) : false;
  };

  return {
    selectionState,
    addToothSelection,
    removeToothSelection,
    selectQuadrant,
    selectAllTeeth,
    clearSelection,
    setSelectionMode,
    isToothSelected,
    isSegmentSelected
  };
}
