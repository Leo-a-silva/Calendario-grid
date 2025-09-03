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
  useTheme
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
import { useSnackbar } from 'notistack';

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

interface AppointmentFormData {
  nombre: string;
  apellido: string;
  dni: string;
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

export function AppointmentModal({ open, onOpenChange }: AppointmentModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  
  const form = useForm<AppointmentFormData>({
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      sexo: "",
      telefono: "",
      motivo: "",
      fecha: null,
      hora: null,
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    console.log("Datos del turno:", data);
    enqueueSnackbar(`Turno agendado correctamente para ${data.nombre} ${data.apellido}`, { 
      variant: 'success',
      autoHideDuration: 3000,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <StyledDialog 
        open={open} 
        onClose={() => onOpenChange(false)}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          <Typography variant="h6">
            <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Agendar Turno
          </Typography>
          <IconButton 
            onClick={() => onOpenChange(false)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <StyledDialogContent>
          <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection>
              <SectionTitle variant="subtitle1">
                <PersonIcon />
                Datos del Paciente
              </SectionTitle>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
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
                
                <TextField
                  fullWidth
                  label="DNI"
                  variant="outlined"
                  size="small"
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
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <CancelButton 
                variant="text" 
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </CancelButton>
              <SubmitButton 
                variant="contained" 
                color="primary"
                type="submit"
              >
                Confirmar Turno
              </SubmitButton>
            </Box>
          </Box>
        </StyledDialogContent>
      </StyledDialog>
    </LocalizationProvider>
  );
}
