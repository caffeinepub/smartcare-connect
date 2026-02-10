import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { VitalsReading } from '../../backend';

interface VitalsListProps {
  vitals: VitalsReading[];
}

export default function VitalsList({ vitals }: VitalsListProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { label: 'Low', variant: 'secondary' as const, className: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' };
    if (hr > 100) return { label: 'High', variant: 'secondary' as const, className: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' };
    return { label: 'Normal', variant: 'default' as const, className: '' };
  };

  const getBPStatus = (bp: string) => {
    const [sys, dia] = bp.split('/').map(Number);
    if (sys > 140 || dia > 90) return { label: 'High', variant: 'destructive' as const, className: '' };
    if (sys < 90 || dia < 60) return { label: 'Low', variant: 'secondary' as const, className: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' };
    return { label: 'Normal', variant: 'default' as const, className: '' };
  };

  const sortedVitals = [...vitals].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Readings</CardTitle>
        <CardDescription>Your vitals history</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedVitals.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No vitals recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Heart Rate</TableHead>
                  <TableHead>Blood Pressure</TableHead>
                  <TableHead>Temperature</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedVitals.map((vital, idx) => {
                  const hrStatus = getHeartRateStatus(Number(vital.heartRate));
                  const bpStatus = getBPStatus(vital.bloodPressure);
                  
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{formatDate(vital.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {vital.heartRate.toString()} bpm
                          <Badge variant={hrStatus.variant} className={hrStatus.className}>{hrStatus.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {vital.bloodPressure}
                          <Badge variant={bpStatus.variant} className={bpStatus.className}>{bpStatus.label}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{vital.temperature.toFixed(1)}°F</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
