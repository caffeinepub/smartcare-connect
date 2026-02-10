import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetPatientProfile, useGetVitalsReadings, useGetMedicationReminders, useGetAppointments, useGetAlerts, useGetFamilyAccess } from '../../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientProfileCard from '../../components/patient/PatientProfileCard';
import VitalsEntryForm from '../../components/vitals/VitalsEntryForm';
import VitalsList from '../../components/vitals/VitalsList';
import MedicationRemindersPanel from '../../components/medications/MedicationRemindersPanel';
import AppointmentsPanel from '../../components/appointments/AppointmentsPanel';
import SOSButton from '../../components/patient/SOSButton';
import FamilyAccessManager from '../../components/patient/FamilyAccessManager';
import HomeNurseBookingForm from '../../components/patient/HomeNurseBookingForm';
import { Activity, Calendar, Users, Pill, AlertCircle } from 'lucide-react';

export default function PatientDashboard() {
  const { identity } = useInternetIdentity();
  const patientId = identity?.getPrincipal() || null;

  const { data: profile } = useGetPatientProfile(patientId);
  const { data: vitals } = useGetVitalsReadings(patientId);
  const { data: medications } = useGetMedicationReminders(patientId);
  const { data: appointments } = useGetAppointments(patientId);
  const { data: alerts } = useGetAlerts(patientId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
        <p className="text-muted-foreground">Monitor your health and manage your care</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <PatientProfileCard />
        </div>
        <div>
          <SOSButton />
        </div>
      </div>

      <Tabs defaultValue="vitals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="vitals" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="family" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Family Access</span>
          </TabsTrigger>
          <TabsTrigger value="nurse" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Home Nurse</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-6">
          <VitalsEntryForm />
          <VitalsList vitals={vitals || []} />
        </TabsContent>

        <TabsContent value="medications">
          <MedicationRemindersPanel patientId={patientId} />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsPanel patientId={patientId} />
        </TabsContent>

        <TabsContent value="family">
          <FamilyAccessManager patientId={patientId} />
        </TabsContent>

        <TabsContent value="nurse">
          <HomeNurseBookingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
