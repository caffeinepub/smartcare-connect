import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface ConnectedDevicesEditorProps {
  devices: string[];
  onChange: (devices: string[]) => void;
}

export default function ConnectedDevicesEditor({ devices, onChange }: ConnectedDevicesEditorProps) {
  const [newDevice, setNewDevice] = useState('');

  const handleAdd = () => {
    if (newDevice.trim()) {
      onChange([...devices, newDevice.trim()]);
      setNewDevice('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(devices.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Connected Devices</Label>
      <div className="space-y-2">
        {devices.map((device, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input value={device} disabled className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Device name (e.g., Smart BP Monitor)"
          value={newDevice}
          onChange={(e) => setNewDevice(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
