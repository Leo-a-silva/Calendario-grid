import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, X } from 'lucide-react';
import { useMedical, MedicalRecord, Medication, VitalSigns } from '@/contexts/MedicalContext';
import { useAuth } from '@/contexts/AuthContext';

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  patientName: string;
  editingRecord?: MedicalRecord;
}

export const MedicalRecordModal = ({ isOpen, onClose, patientId, patientName, editingRecord }: MedicalRecordModalProps) => {
  const { addMedicalRecord, updateMedicalRecord } = useMedical();
  const { user } = useAuth();
  const [recordType, setRecordType] = useState<MedicalRecord['type']>('consultation');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  
  // Vital Signs
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({});
  
  // Medications
  const [medications, setMedications] = useState<Medication[]>([]);

  // Load data when editing
  useEffect(() => {
    if (editingRecord && isOpen) {
      setRecordType(editingRecord.type);
      setTitle(editingRecord.title);
      setDescription(editingRecord.description);
      setDiagnosis(editingRecord.diagnosis || '');
      setNotes(editingRecord.notes || '');
      setVitalSigns(editingRecord.vitalSigns || {});
      setMedications(editingRecord.medications || []);
    } else if (isOpen && !editingRecord) {
      resetForm();
    }
  }, [editingRecord, isOpen]);

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setMedications([...medications, newMedication]);
  };

  const updateMedication = (id: number, field: keyof Medication, value: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const removeMedication = (id: number) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const resetForm = () => {
    setRecordType('consultation');
    setTitle('');
    setDescription('');
    setDiagnosis('');
    setNotes('');
    setVitalSigns({});
    setMedications([]);
  };

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;

    const recordData = {
      patientId,
      date: editingRecord?.date || new Date().toISOString(),
      type: recordType,
      title: title.trim(),
      description: description.trim(),
      diagnosis: diagnosis.trim() || undefined,
      notes: notes.trim() || undefined,
      medications: medications.length > 0 ? medications : undefined,
      vitalSigns: Object.keys(vitalSigns).length > 0 ? vitalSigns : undefined,
      createdBy: editingRecord?.createdBy || user?.username || 'Usuario'
    };

    if (editingRecord) {
      updateMedicalRecord(editingRecord.id, recordData);
    } else {
      addMedicalRecord(recordData);
    }
    
    resetForm();
    onClose();
  };

  const getTypeLabel = (type: MedicalRecord['type']) => {
    const labels = {
      consultation: 'Consulta',
      prescription: 'Receta',
      lab_result: 'Resultado de Laboratorio',
      evolution: 'Evolución',
      treatment_plan: 'Plan de Tratamiento'
    };
    return labels[type];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRecord ? 'Editar Registro Médico' : 'Nuevo Registro Médico'} - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tipo de registro */}
          <div className="space-y-2">
            <Label>Tipo de Registro</Label>
            <Select value={recordType} onValueChange={(value: MedicalRecord['type']) => setRecordType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consulta</SelectItem>
                <SelectItem value="prescription">Receta</SelectItem>
                <SelectItem value="lab_result">Resultado de Laboratorio</SelectItem>
                <SelectItem value="evolution">Evolución</SelectItem>
                <SelectItem value="treatment_plan">Plan de Tratamiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Ej: ${getTypeLabel(recordType)} ${new Date().toLocaleDateString()}`}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los síntomas, motivo de consulta o hallazgos..."
              rows={3}
            />
          </div>

          {/* Signos vitales */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Signos Vitales</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="weight" className="text-sm">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={vitalSigns.weight || ''}
                  onChange={(e) => setVitalSigns({...vitalSigns, weight: parseFloat(e.target.value) || undefined})}
                  placeholder="70"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="height" className="text-sm">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={vitalSigns.height || ''}
                  onChange={(e) => setVitalSigns({...vitalSigns, height: parseFloat(e.target.value) || undefined})}
                  placeholder="170"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bp" className="text-sm">Presión (mmHg)</Label>
                <Input
                  id="bp"
                  value={vitalSigns.bloodPressure || ''}
                  onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hr" className="text-sm">FC (lpm)</Label>
                <Input
                  id="hr"
                  type="number"
                  value={vitalSigns.heartRate || ''}
                  onChange={(e) => setVitalSigns({...vitalSigns, heartRate: parseFloat(e.target.value) || undefined})}
                  placeholder="72"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="temp" className="text-sm">Temperatura (°C)</Label>
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  value={vitalSigns.temperature || ''}
                  onChange={(e) => setVitalSigns({...vitalSigns, temperature: parseFloat(e.target.value) || undefined})}
                  placeholder="36.5"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sat" className="text-sm">Sat. O2 (%)</Label>
                <Input
                  id="sat"
                  type="number"
                  value={vitalSigns.oxygenSaturation || ''}
                  onChange={(e) => setVitalSigns({...vitalSigns, oxygenSaturation: parseFloat(e.target.value) || undefined})}
                  placeholder="98"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Diagnóstico */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Diagnóstico médico..."
              rows={2}
            />
          </div>

          {/* Medicamentos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Medicamentos</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            
            {medications.map((med) => (
              <div key={med.id} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Medicamento</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedication(med.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={med.name}
                    onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                    placeholder="Nombre del medicamento"
                  />
                  <Input
                    value={med.dosage}
                    onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                    placeholder="Dosis (ej: 500mg)"
                  />
                  <Input
                    value={med.frequency}
                    onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                    placeholder="Frecuencia (ej: cada 8hs)"
                  />
                  <Input
                    value={med.duration}
                    onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                    placeholder="Duración (ej: 7 días)"
                  />
                </div>
                
                <Input
                  value={med.instructions || ''}
                  onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                  placeholder="Instrucciones adicionales"
                />
              </div>
            ))}
          </div>

          <Separator />

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observaciones, recomendaciones, próximas citas..."
              rows={2}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={!title.trim() || !description.trim()}>
              {editingRecord ? 'Actualizar Registro' : 'Guardar Registro'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};