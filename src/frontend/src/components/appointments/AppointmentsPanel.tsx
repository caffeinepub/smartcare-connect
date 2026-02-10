import { useState } from 'react';
import { useGetAppointments, useAddAppointment, useDeleteAppointment } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import type { PatientId } from '../../backend';

interface AppointmentsPanelProps {
  patientId: PatientId | null;
}

export default function AppointmentsPanel({ patientId }: AppointmentsPanelProps) {
  const { data: appointments = [] } = useGetAppointments(patientId);
  const addAppointment = useAddAppointment();
  const deleteAppointment = useDeleteAppointment();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dateTime: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dateTime = new Date(formData.dateTime).getTime() * 1000000;
      await addAppointment.mutateAsync({
        id: BigInt(0),
        doctor: Principal.anonymous(),
        dateTime: BigInt(dateTime),
        reason: formData.reason,
      });
      toast.success('Appointment added');
      setOpen(false);
      setFormData({ dateTime: '', reason: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add appointment');
    }
  };

  const handleDelete = async (appointmentId: bigint) => {
    if (!patientId) return;
    
    try {
      await deleteAppointment.mutateAsync({ patientId, appointmentId });
      toast.success('Appointment deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete appointment');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const sortedAppointments = [...appointments].sort((a, b) => Number(a.dateTime - b.dateTime));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Follow-up Appointments
            </CardTitle>
            <CardDescription>Manage your upcoming appointments</CardDescription>
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
                  <DialogTitle>Add Appointment</DialogTitle>
                  <DialogDescription>Schedule a new follow-up appointment</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateTime">Date & Time</Label>
                    <Input
                      id="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason / Notes</Label>
                    <Textarea
                      id="reason"
                      placeholder="e.g., Follow-up checkup, Lab results review"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addAppointment.isPending}>
                    {addAppointment.isPending ? 'Adding...' : 'Add Appointment'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAppointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No appointments scheduled</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Reason / Notes</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAppointments.map((apt) => (
                  <TableRow key={apt.id.toString()}>
                    <TableCell className="font-medium">{formatDate(apt.dateTime)}</TableCell>
                    <TableCell>{apt.reason}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(apt.id)}
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
