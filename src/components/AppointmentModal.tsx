import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Divider,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
  Alert,
  AlertTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useSnackbar } from 'notistack';
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";

// Mock patients data (in a real app, this would be from a database)
const mockPatients = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "12345678",
    numeroHistoriaClinica: "HC001",
    sexo: "masculino",
    telefono: "1234567890"
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    dni: "23456789",
    numeroHistoriaClinica: "HC002",
    sexo: "femenino",
    telefono: "2345678901"
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    dni: "34567890",
    numeroHistoriaClinica: "HC003",
    sexo: "masculino",
    telefono: "3456789012"
  },
];

// Estilos personalizados
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: 800,
    width: '100%',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTypography-root': {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FormSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 12,
  boxShadow: theme.shadows[1],
  '&:last-child': {
    marginBottom: 0,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    fontSize: '1.25rem',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: 12,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
}));

const CancelButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: 12,
  fontWeight: 500,
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  numeroHistoriaClinica: string;
  sexo?: string;
  telefono?: string;
}

interface AppointmentFormData {
  dni: string;
  nombre: string;
  apellido: string;
  sexo: string;
  telefono: string;
  motivo: string;
  fecha: Date | null;
  hora: Date | null;
}

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ModalStep = 'dni-search' | 'patient-form' | 'appointment-form';

export function AppointmentModal({ open, onOpenChange }: AppointmentModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { getPatientByDni, addPatient, addAppointment } = useData();
  
  const [currentStep, setCurrentStep] = useState<ModalStep>('dni-search');
  const [searchedDni, setSearchedDni] = useState('');
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  
  const form = useForm<AppointmentFormData>({
    defaultValues: {
      dni: "",
      nombre: "",
      apellido: "",
      sexo: "",
      telefono: "",
      motivo: "",
      fecha: null,
      hora: null,
    },
  });

  // Reset modal state when opening/closing
  const handleOpenChange = (openState: boolean) => {
    if (!openState) {
      setCurrentStep('dni-search');
      setSearchedDni('');
      setFoundPatient(null);
      setPatientNotFound(false);
      form.reset();
    }
    onOpenChange(openState);
  };

  // Search for patient by DNI
  const handleDniSearch = () => {
    const patient = getPatientByDni(searchedDni);
    
    if (patient) {
      setFoundPatient(patient);
      setPatientNotFound(false);
      // Fill form with existing patient data
      form.setValue('dni', patient.dni);
      form.setValue('nombre', patient.nombre);
      form.setValue('apellido', patient.apellido);
      form.setValue('sexo', patient.sexo || '');
      form.setValue('telefono', patient.telefono || '');
      setCurrentStep('appointment-form');
    } else {
      setFoundPatient(null);
      setPatientNotFound(true);
      // Set DNI in form for new patient
      form.setValue('dni', searchedDni);
      setCurrentStep('patient-form');
    }
  };

  // Create new patient and schedule appointment
  const onSubmit = (data: AppointmentFormData) => {
    let patient = foundPatient;
    
    if (!foundPatient) {
      // Create new patient
      const newPatient = addPatient({
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        numeroHistoriaClinica: "", // Will be auto-generated
        telefono: data.telefono,
      });
      
      patient = newPatient;
      
      enqueueSnackbar(`Nuevo paciente ${data.nombre} ${data.apellido} creado`, { 
        variant: 'success',
        autoHideDuration: 3000,
      });
    }
    
    // Create appointment
    if (patient && data.fecha && data.hora) {
      const appointmentDate = format(data.fecha, 'yyyy-MM-dd');
      const appointmentTime = format(data.hora, 'HH:mm');
      
      addAppointment({
        patientId: patient.id,
        patientName: `${patient.nombre} ${patient.apellido}`,
        patientDni: patient.dni,
        date: appointmentDate,
        time: appointmentTime,
        type: data.motivo,
        status: 'scheduled',
      });
      
      enqueueSnackbar(`Turno agendado correctamente para ${patient.nombre} ${patient.apellido}`, { 
        variant: 'success',
        autoHideDuration: 3000,
      });
    }
    
    handleOpenChange(false);
  };

  const renderDniSearch = () => (
    <FormSection>
      <SectionTitle variant="subtitle1">
        <SearchIcon />
        Buscar Paciente por DNI
      </SectionTitle>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ingrese el DNI del paciente para verificar si está registrado en el sistema
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          label="DNI del paciente"
          variant="outlined"
          size="small"
          value={searchedDni}
          onChange={(e) => setSearchedDni(e.target.value)}
          placeholder="Ej: 12345678"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleDniSearch}
          disabled={!searchedDni.trim()}
          sx={{ minWidth: 120 }}
        >
          <SearchIcon sx={{ mr: 1 }} />
          Buscar
        </Button>
      </Box>
    </FormSection>
  );

  const renderPatientForm = () => (
    <>
      {patientNotFound && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Paciente no encontrado</AlertTitle>
          El DNI <strong>{searchedDni}</strong> no coincide con ningún paciente registrado. 
          Complete los datos para crear un nuevo paciente.
        </Alert>
      )}
      
      <FormSection>
        <SectionTitle variant="subtitle1">
          <PersonAddIcon />
          Datos del Nuevo Paciente
        </SectionTitle>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="DNI"
            variant="outlined"
            size="small"
            disabled
            {...form.register('dni', { 
              required: 'Este campo es requerido',
              pattern: {
                value: /^\d{7,8}$/,
                message: 'Ingrese un DNI válido (7 u 8 dígitos)'
              }
            })}
            error={!!form.formState.errors.dni}
            helperText={form.formState.errors.dni?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box /> {/* Empty space for grid layout */}
          
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            size="small"
            {...form.register('nombre', { required: 'Este campo es requerido' })}
            error={!!form.formState.errors.nombre}
            helperText={form.formState.errors.nombre?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Apellido"
            variant="outlined"
            size="small"
            {...form.register('apellido', { required: 'Este campo es requerido' })}
            error={!!form.formState.errors.apellido}
            helperText={form.formState.errors.apellido?.message}
          />
          
          <FormControl fullWidth size="small" error={!!form.formState.errors.sexo}>
            <InputLabel>Sexo</InputLabel>
            <Select
              label="Sexo"
              {...form.register('sexo', { required: 'Este campo es requerido' })}
              defaultValue=""
            >
              <MenuItem value="masculino">Masculino</MenuItem>
              <MenuItem value="femenino">Femenino</MenuItem>
              <MenuItem value="otro">Otro</MenuItem>
            </Select>
            {form.formState.errors.sexo && (
              <FormHelperText>{form.formState.errors.sexo.message}</FormHelperText>
            )}
          </FormControl>
          
          <TextField
            fullWidth
            label="Teléfono"
            variant="outlined"
            size="small"
            {...form.register('telefono')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </FormSection>
      
      {renderAppointmentForm()}
    </>
  );

  const renderExistingPatient = () => (
    <>
      {foundPatient && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Paciente encontrado</AlertTitle>
          <strong>{foundPatient.nombre} {foundPatient.apellido}</strong> - DNI: {foundPatient.dni} - 
          HC: {foundPatient.numeroHistoriaClinica}
        </Alert>
      )}
      
      {renderAppointmentForm()}
    </>
  );

  const renderAppointmentForm = () => (
    <>
      <FormSection>
        <SectionTitle variant="subtitle1">
          <InfoIcon />
          Motivo de la Consulta
        </SectionTitle>
        
        <TextField
          fullWidth
          label="Motivo de la consulta"
          variant="outlined"
          size="small"
          multiline
          rows={3}
          {...form.register('motivo')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <InfoIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </FormSection>
      
      <FormSection>
        <SectionTitle variant="subtitle1">
          <EventIcon />
          Fecha y Hora
        </SectionTitle>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <DatePicker
            label="Fecha del turno"
            value={form.watch('fecha')}
            onChange={(date) => form.setValue('fecha', date)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                required: true,
                error: !!form.formState.errors.fecha,
                helperText: form.formState.errors.fecha?.message,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="action" />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
          
          <TimePicker
            label="Hora del turno"
            value={form.watch('hora')}
            onChange={(time) => form.setValue('hora', time)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                required: true,
                error: !!form.formState.errors.hora,
                helperText: form.formState.errors.hora?.message,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon color="action" />
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </Box>
      </FormSection>
    </>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'dni-search':
        return renderDniSearch();
      case 'patient-form':
        return renderPatientForm();
      case 'appointment-form':
        return renderExistingPatient();
      default:
        return renderDniSearch();
    }
  };

  const renderActions = () => {
    if (currentStep === 'dni-search') {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <CancelButton 
            variant="text" 
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </CancelButton>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setCurrentStep('dni-search');
            setPatientNotFound(false);
            setFoundPatient(null);
          }}
        >
          Volver
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CancelButton 
            variant="text" 
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </CancelButton>
          <SubmitButton 
            variant="contained" 
            color="primary"
            onClick={form.handleSubmit(onSubmit)}
          >
            {foundPatient ? 'Confirmar Turno' : 'Crear Paciente y Agendar'}
          </SubmitButton>
        </Box>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <StyledDialog 
        open={open} 
        onClose={() => handleOpenChange(false)}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          <Typography variant="h6">
            <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {currentStep === 'dni-search' ? 'Buscar Paciente' : 'Agendar Turno'}
          </Typography>
          <IconButton 
            onClick={() => handleOpenChange(false)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <StyledDialogContent>
          {renderContent()}
          {renderActions()}
        </StyledDialogContent>
      </StyledDialog>
    </LocalizationProvider>
  );
}
