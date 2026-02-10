import { useState } from 'react';
import { useGetMedicationReminders, useAddMedicationReminder, useDeleteMedicationReminder } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Pill } from 'lucide-react';
import { toast } from 'sonner';
import type { PatientId, MedicationReminder } from '../../backend';

interface MedicationRemindersPanelProps {
  patientId: PatientId | null;
}

export default function MedicationRemindersPanel({ patientId }: MedicationRemindersPanelProps) {
  const { data: medications = [] } = useGetMedicationReminders(patientId);
  const addMedication = useAddMedicationReminder();
  const deleteMedication = useDeleteMedicationReminder();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addMedication.mutateAsync({
        id: BigInt(0),
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        nextDue: BigInt(Date.now() * 1000000),
      });
      toast.success('Medication reminder added');
      setOpen(false);
      setFormData({ name: '', dosage: '', frequency: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add medication');
    }
  };

  const handleDelete = async (medicationId: bigint) => {
    if (!patientId) return;
    
    try {
      await deleteMedication.mutateAsync({ patientId, medicationId });
      toast.success('Medication reminder deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete medication');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const sortedMedications = [...medications].sort((a, b) => Number(a.nextDue - b.nextDue));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medication Reminders
            </CardTitle>
            <CardDescription>Manage your medication schedule</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Medication Reminder</DialogTitle>
                  <DialogDescription>Set up a new medication schedule</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="medName">Medication Name</Label>
                    <Input
                      id="medName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage & Instructions</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 1 tablet, 500mg"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      placeholder="e.g., Twice daily, Every 8 hours"
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMedication.isPending}>
                    {addMedication.isPending ? 'Adding...' : 'Add Reminder'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedMedications.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No medication reminders set</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMedications.map((med) => (
                  <TableRow key={med.id.toString()}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{formatDate(med.nextDue)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(med.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
