import { useParams } from '@tanstack/react-router';
import { Principal } from '@dfinity/principal';
import { useGetPatientProfile, useGetVitalsReadings, useGetAlerts, useGetMedicationReminders, useGetAppointments } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VitalsList from '../../components/vitals/VitalsList';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, AlertCircle, Pill, Calendar } from 'lucide-react';
import { Variant_emergency_medication_vitals } from '../../backend';

export default function FamilyPatientStatus() {
  const { patientId: patientIdStr } = useParams({ from: '/authenticated/family/patient/$patientId' });
  const patientId = Principal.fromText(patientIdStr);

  const { data: profile } = useGetPatientProfile(patientId);
  const { data: vitals = [] } = useGetVitalsReadings(patientId);
  const { data: alerts = [] } = useGetAlerts(patientId);
  const { data: medications = [] } = useGetMedicationReminders(patientId);
  const { data: appointments = [] } = useGetAppointments(patientId);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const getAlertVariant = (type: Variant_emergency_medication_vitals): { variant: 'default' | 'destructive' | 'secondary'; className?: string } => {
    if (type === Variant_emergency_medication_vitals.emergency) {
      return { variant: 'destructive' };
    }
    if (type === Variant_emergency_medication_vitals.vitals) {
      return { variant: 'secondary', className: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' };
    }
    return { variant: 'default' };
  };

  const getAlertLabel = (type: Variant_emergency_medication_vitals): string => {
    if (type === Variant_emergency_medication_vitals.emergency) return 'Emergency';
    if (type === Variant_emergency_medication_vitals.vitals) return 'Vitals';
    if (type === Variant_emergency_medication_vitals.medication) return 'Medication';
    return 'Alert';
  };

  const sortedAlerts = [...alerts].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{profile?.name}'s Health Status</h1>
        <p className="text-muted-foreground">Read-only view of patient health information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{profile?.age.toString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No alerts</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sortedAlerts.slice(0, 5).map((alert) => {
                  const alertStyle = getAlertVariant(alert.alertType);
                  return (
                    <div key={alert.id.toString()} className="p-3 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-1">
                        <Badge variant={alertStyle.variant} className={alertStyle.className}>
                          {getAlertLabel(alert.alertType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vitals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vitals" className="gap-2">
            <Activity className="h-4 w-4" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="medications" className="gap-2">
            <Pill className="h-4 w-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="h-4 w-4" />
            Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals">
          <VitalsList vitals={vitals} />
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle>Medication Schedule</CardTitle>
              <CardDescription>Current medications</CardDescription>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No medications</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medications.map((med) => (
                      <TableRow key={med.id.toString()}>
                        <TableCell className="font-medium">{med.name}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                        <TableCell>{formatDate(med.nextDue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Appointments</CardTitle>
              <CardDescription>Upcoming follow-ups</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No appointments</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id.toString()}>
                        <TableCell className="font-medium">{formatDate(apt.dateTime)}</TableCell>
                        <TableCell>{apt.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
