import { useState } from 'react';
import { useAddHomeNurseRequest } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function HomeNurseBookingForm() {
  const addRequest = useAddHomeNurseRequest();
  const [formData, setFormData] = useState({
    dateTime: '',
    details: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dateTime = new Date(formData.dateTime).getTime() * 1000000;
      await addRequest.mutateAsync({
        id: BigInt(0),
        patient: Principal.anonymous(),
        dateTime: BigInt(dateTime),
        details: formData.details,
      });
      toast.success('Home nurse request submitted');
      setFormData({ dateTime: '', details: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Request Home Nurse Visit
        </CardTitle>
        <CardDescription>Schedule a home nursing visit for additional care</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nurseDateTime">Preferred Date & Time</Label>
            <Input
              id="nurseDateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Details / Special Requirements</Label>
            <Textarea
              id="details"
              placeholder="Describe the care needed, address, and any special instructions..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              rows={4}
              required
            />
          </div>
          <Button type="submit" disabled={addRequest.isPending}>
            {addRequest.isPending ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
