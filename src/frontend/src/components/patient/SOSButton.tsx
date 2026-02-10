import { useState } from 'react';
import { useSendEmergencyAlert } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SOSButton() {
  const sendAlert = useSendEmergencyAlert();
  const [open, setOpen] = useState(false);

  const handleSOS = async () => {
    try {
      await sendAlert.mutateAsync('Emergency SOS activated by patient');
      toast.success('Emergency alert sent to your care team');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send emergency alert');
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Emergency SOS
        </CardTitle>
        <CardDescription>Get immediate help from your care team</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="w-full">
              <AlertCircle className="h-5 w-5 mr-2" />
              Send SOS Alert
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send Emergency Alert?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately notify your doctor and care team that you need urgent assistance.
                Use this only in case of a medical emergency.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSOS} className="bg-destructive hover:bg-destructive/90">
                {sendAlert.isPending ? 'Sending...' : 'Send SOS'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
