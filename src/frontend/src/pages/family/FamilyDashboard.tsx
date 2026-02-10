import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useGetPatientProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Users } from 'lucide-react';

export default function FamilyDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const patientId = userProfile?.role.__kind__ === 'familyMember' ? userProfile.role.familyMember : null;
  const { data: patientProfile } = useGetPatientProfile(patientId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Family Member Dashboard</h1>
        <p className="text-muted-foreground">Monitor your loved one's health status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Access
          </CardTitle>
          <CardDescription>You have read-only access to the following patient</CardDescription>
        </CardHeader>
        <CardContent>
          {patientProfile ? (
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium text-lg">{patientProfile.name}</p>
                <p className="text-sm text-muted-foreground">Age: {patientProfile.age.toString()}</p>
              </div>
              <Button onClick={() => navigate({ to: `/family/patient/${patientId?.toString()}` })}>
                View Health Status
              </Button>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No patient access configured. Please contact the patient to grant you access.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
