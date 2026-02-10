import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetPatientProfile, useSavePatientProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import ConnectedDevicesEditor from './ConnectedDevicesEditor';

export default function PatientProfileCard() {
  const { identity } = useInternetIdentity();
  const patientId = identity?.getPrincipal() || null;
  const { data: profile, isLoading } = useGetPatientProfile(patientId);
  const saveProfile = useSavePatientProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    medicalHistory: '',
    connectedDevices: [] as string[],
  });

  const handleEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        age: Number(profile.age),
        medicalHistory: profile.medicalHistory,
        connectedDevices: profile.connectedDevices,
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await saveProfile.mutateAsync({
        name: formData.name,
        age: BigInt(formData.age),
        medicalHistory: formData.medicalHistory,
        primaryDoctor: profile?.primaryDoctor,
        connectedDevices: formData.connectedDevices,
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Profile</CardTitle>
          <CardDescription>Set up your health profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleEdit}>Create Profile</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Patient Profile</CardTitle>
            <CardDescription>Your health information</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                rows={4}
              />
            </div>
            <ConnectedDevicesEditor
              devices={formData.connectedDevices}
              onChange={(devices) => setFormData({ ...formData, connectedDevices: devices })}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saveProfile.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{profile?.age.toString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medical History</p>
              <p className="font-medium">{profile?.medicalHistory || 'Not provided'}</p>
            </div>
            {profile?.connectedDevices && profile.connectedDevices.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Connected Devices</p>
                <div className="flex flex-wrap gap-2">
                  {profile.connectedDevices.map((device, idx) => (
                    <span key={idx} className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-sm">
                      {device}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
