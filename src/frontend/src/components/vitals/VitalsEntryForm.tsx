import { useState } from 'react';
import { useAddVitalsReading } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function VitalsEntryForm() {
  const addVitals = useAddVitalsReading();
  const [heartRate, setHeartRate] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [temperature, setTemperature] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addVitals.mutateAsync({
        heartRate: BigInt(parseInt(heartRate) || 0),
        bloodPressure: `${systolic}/${diastolic}`,
        temperature: parseFloat(temperature) || 0,
        timestamp: BigInt(Date.now() * 1000000),
      });
      toast.success('Vitals recorded successfully');
      setHeartRate('');
      setSystolic('');
      setDiastolic('');
      setTemperature('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to record vitals');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Vitals</CardTitle>
        <CardDescription>Enter your current health measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate" className="flex items-center gap-2">
                <img src="/assets/generated/icon-hr.dim_256x256.png" alt="Heart Rate" className="h-5 w-5" />
                Heart Rate (bpm)
              </Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-2">
                Temperature (°F)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <img src="/assets/generated/icon-bp.dim_256x256.png" alt="Blood Pressure" className="h-5 w-5" />
                Blood Pressure
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                />
                <span className="text-muted-foreground">/</span>
                <Input
                  type="number"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={addVitals.isPending} className="w-full sm:w-auto">
            {addVitals.isPending ? 'Recording...' : 'Record Vitals'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
