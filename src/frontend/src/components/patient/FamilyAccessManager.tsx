import { useState } from 'react';
import { useGetFamilyAccess, useGrantFamilyAccess, useRevokeFamilyAccess } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import type { PatientId } from '../../backend';

interface FamilyAccessManagerProps {
  patientId: PatientId | null;
}

export default function FamilyAccessManager({ patientId }: FamilyAccessManagerProps) {
  const { data: familyMembers = [] } = useGetFamilyAccess(patientId);
  const grantAccess = useGrantFamilyAccess();
  const revokeAccess = useRevokeFamilyAccess();

  const [principalInput, setPrincipalInput] = useState('');

  const handleGrant = async () => {
    try {
      const principal = Principal.fromText(principalInput.trim());
      await grantAccess.mutateAsync(principal);
      toast.success('Family access granted');
      setPrincipalInput('');
    } catch (error: any) {
      toast.error(error.message || 'Invalid principal ID');
    }
  };

  const handleRevoke = async (principal: Principal) => {
    try {
      await revokeAccess.mutateAsync(principal);
      toast.success('Family access revoked');
    } catch (error: any) {
      toast.error(error.message || 'Failed to revoke access');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Access
        </CardTitle>
        <CardDescription>Grant family members read-only access to your health data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="principalId">Family Member Principal ID</Label>
          <div className="flex gap-2">
            <Input
              id="principalId"
              placeholder="Enter principal ID"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="font-mono text-sm"
            />
            <Button onClick={handleGrant} disabled={grantAccess.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Grant
            </Button>
          </div>
        </div>

        {familyMembers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No family members have access yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Principal ID</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map((principal) => (
                  <TableRow key={principal.toString()}>
                    <TableCell className="font-mono text-sm">{principal.toString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(principal)}
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
