import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  numeroHistoriaClinica: string;
  telefono?: string;
  email?: string;
  fechaNacimiento?: string;
  direccion?: string;
  sexo?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientDni: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'canceled';
  notes?: string;
}

interface DataContextType {
  patients: Patient[];
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id'>) => Patient;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  getPatientByDni: (dni: string) => Patient | undefined;
  getAppointmentsByDate: (date: string) => Appointment[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialPatients: Patient[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    numeroHistoriaClinica: "HC001",
    telefono: "11-1234-5678",
    email: "juan.perez@email.com",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    dni: "23456789",
    numeroHistoriaClinica: "HC002",
    telefono: "11-2345-6789",
    email: "maria.gonzalez@email.com",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    dni: "34567890",
    numeroHistoriaClinica: "HC003",
    telefono: "11-3456-7890",
    email: "carlos.rodriguez@email.com",
  },
];

const initialAppointments: Appointment[] = [];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('clinic-patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('clinic-appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('clinic-patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('clinic-appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addPatient = (patientData: Omit<Patient, 'id'>): Patient => {
    const newId = Math.max(0, ...patients.map(p => p.id)) + 1;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      numeroHistoriaClinica: patientData.numeroHistoriaClinica || `HC${newId.toString().padStart(3, '0')}`,
    };
    
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>): Appointment => {
    const newId = Math.max(0, ...appointments.map(a => a.id)) + 1;
    const newAppointment: Appointment = {
      ...appointmentData,
      id: newId,
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const getPatientByDni = (dni: string): Patient | undefined => {
    return patients.find(patient => patient.dni === dni);
  };

  const getAppointmentsByDate = (date: string): Appointment[] => {
    return appointments.filter(appointment => appointment.date === date);
  };

  const value: DataContextType = {
    patients,
    appointments,
    addPatient,
    addAppointment,
    getPatientByDni,
    getAppointmentsByDate,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};