import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useRoleRouting } from '../hooks/useRoleRouting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Stethoscope, Users } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import type { UserRole } from '../backend';
import { toast } from 'sonner';

export default function OnboardingRole() {
  const [name, setName] = useState('');
  const [roleType, setRoleType] = useState<'patient' | 'doctor' | 'familyMember'>('patient');
  const [targetPatientPrincipal, setTargetPatientPrincipal] = useState('');
  const [error, setError] = useState('');
  
  const saveProfile = useSaveCallerUserProfile();
  const { getRoleRoute } = useRoleRouting();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (roleType === 'familyMember' && !targetPatientPrincipal.trim()) {
      setError('Please enter the patient principal ID');
      return;
    }

    let role: UserRole;
    
    if (roleType === 'patient') {
      role = { __kind__: 'patient', patient: null };
    } else if (roleType === 'doctor') {
      role = { __kind__: 'doctor', doctor: null };
    } else {
      try {
        const patientId = Principal.fromText(targetPatientPrincipal.trim());
        role = { __kind__: 'familyMember', familyMember: patientId };
      } catch (err) {
        setError('Invalid patient principal ID format');
        return;
      }
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim(), role });
      toast.success('Profile created successfully!');
      const route = getRoleRoute(role);
      navigate({ to: route });
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
      toast.error('Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-background to-emerald-50 dark:from-gray-900 dark:via-background dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/generated/smartcare-logo.dim_512x512.png" 
              alt="SmartCare Connect" 
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-3xl">Welcome to SmartCare Connect</CardTitle>
          <CardDescription className="text-base">
            Let's set up your profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base">I am a...</Label>
              <RadioGroup value={roleType} onValueChange={(value) => setRoleType(value as any)}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="flex items-center gap-3 cursor-pointer flex-1">
                    <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <div className="font-semibold">Patient</div>
                      <div className="text-sm text-muted-foreground">I'm monitoring my own health</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Stethoscope className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="font-semibold">Doctor / Clinician</div>
                      <div className="text-sm text-muted-foreground">I'm monitoring my patients</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="familyMember" id="familyMember" />
                  <Label htmlFor="familyMember" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="font-semibold">Family Member</div>
                      <div className="text-sm text-muted-foreground">I'm caring for a family member</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {roleType === 'familyMember' && (
              <div className="space-y-2">
                <Label htmlFor="patientPrincipal" className="text-base">Patient Principal ID</Label>
                <Input
                  id="patientPrincipal"
                  type="text"
                  placeholder="Enter the patient's principal ID"
                  value={targetPatientPrincipal}
                  onChange={(e) => setTargetPatientPrincipal(e.target.value)}
                  className="h-12 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Ask the patient to share their principal ID with you
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 text-base bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              disabled={saveProfile.isPending}
            >
              {saveProfile.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Profile...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
