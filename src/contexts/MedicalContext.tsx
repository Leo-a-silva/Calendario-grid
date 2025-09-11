import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MedicalRecord {
  id: number;
  patientId: number;
  date: string;
  type: 'consultation' | 'prescription' | 'lab_result' | 'evolution' | 'treatment_plan';
  title: string;
  description: string;
  medications?: Medication[];
  vitalSigns?: VitalSigns;
  diagnosis?: string;
  notes?: string;
  attachments?: string[];
  createdBy: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface VitalSigns {
  weight?: number;
  height?: number;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  bmi?: number;
}

export interface Prescription {
  id: number;
  patientId: number;
  date: string;
  medications: Medication[];
  instructions?: string;
  createdBy: string;
}

interface MedicalContextType {
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => MedicalRecord;
  updateMedicalRecord: (id: number, updates: Partial<MedicalRecord>) => void;
  deleteMedicalRecord: (id: number) => void;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Prescription;
  getPatientMedicalHistory: (patientId: number) => MedicalRecord[];
  getPatientPrescriptions: (patientId: number) => Prescription[];
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const MedicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('clinic-medical-records');
    return saved ? JSON.parse(saved) : [];
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('clinic-prescriptions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('clinic-medical-records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem('clinic-prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const addMedicalRecord = (recordData: Omit<MedicalRecord, 'id'>): MedicalRecord => {
    const newId = Math.max(0, ...medicalRecords.map(r => r.id)) + 1;
    const newRecord: MedicalRecord = {
      ...recordData,
      id: newId,
    };
    
    setMedicalRecords(prev => [...prev, newRecord]);
    return newRecord;
  };

  const updateMedicalRecord = (id: number, updates: Partial<MedicalRecord>) => {
    setMedicalRecords(prev => 
      prev.map(record => 
        record.id === id ? { ...record, ...updates } : record
      )
    );
  };

  const deleteMedicalRecord = (id: number) => {
    setMedicalRecords(prev => prev.filter(record => record.id !== id));
  };

  const addPrescription = (prescriptionData: Omit<Prescription, 'id'>): Prescription => {
    const newId = Math.max(0, ...prescriptions.map(p => p.id)) + 1;
    const newPrescription: Prescription = {
      ...prescriptionData,
      id: newId,
    };
    
    setPrescriptions(prev => [...prev, newPrescription]);
    return newPrescription;
  };

  const getPatientMedicalHistory = (patientId: number): MedicalRecord[] => {
    return medicalRecords.filter(record => record.patientId === patientId);
  };

  const getPatientPrescriptions = (patientId: number): Prescription[] => {
    return prescriptions.filter(prescription => prescription.patientId === patientId);
  };

  const value: MedicalContextType = {
    medicalRecords,
    prescriptions,
    addMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    addPrescription,
    getPatientMedicalHistory,
    getPatientPrescriptions,
  };

  return (
    <MedicalContext.Provider value={value}>
      {children}
    </MedicalContext.Provider>
  );
};

export const useMedical = (): MedicalContextType => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
};