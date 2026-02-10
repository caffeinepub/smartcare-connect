import { useGetMyPatients, useGetMyPatientsAlerts } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { Users, AlertCircle, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Variant_emergency_medication_vitals } from '../../backend';

export default function DoctorDashboard() {
  const { data: patients = [] } = useGetMyPatients();
  const { data: alerts = [] } = useGetMyPatientsAlerts();
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Monitor your patients and respond to alerts</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Alerts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(a => a.alertType === Variant_emergency_medication_vitals.emergency).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Patients</CardTitle>
            <CardDescription>Patients under your care</CardDescription>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No patients assigned yet</p>
            ) : (
              <div className="space-y-2">
                {patients.map(([patientId, profile]) => (
                  <div
                    key={patientId.toString()}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">Age: {profile.age.toString()}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate({ to: `/doctor/patient/${patientId.toString()}` })}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest notifications from your patients</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No alerts</p>
            ) : (
              <div className="space-y-3">
                {sortedAlerts.slice(0, 10).map((alert) => {
                  const alertStyle = getAlertVariant(alert.alertType);
                  return (
                    <div
                      key={alert.id.toString()}
                      className="p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
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
    </div>
  );
}
