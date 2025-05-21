
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Slider } from '@/components/ui/slider';

const BiometricsForm = () => {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    gsr: '50',
    heartbeat: '70',
    spo2: '98',
    temperature: '36.5'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0].toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('biometrics')
        .insert({
          user_id: authState.user?.id,
          gsr: parseFloat(formData.gsr),
          heartbeat: parseInt(formData.heartbeat),
          spo2: parseInt(formData.spo2),
          temperature: parseFloat(formData.temperature),
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Biometric data logged successfully!');
    } catch (error: any) {
      toast.error(`Error saving data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="gsr">Galvanic Skin Response (µS)</Label>
        <div className="flex flex-col space-y-2">
          <Slider
            value={[parseFloat(formData.gsr)]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSliderChange('gsr', value)}
          />
          <Input
            id="gsr"
            name="gsr"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.gsr}
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="heartbeat">Heart Rate (BPM)</Label>
        <div className="flex flex-col space-y-2">
          <Slider
            value={[parseFloat(formData.heartbeat)]}
            min={40}
            max={200}
            step={1}
            onValueChange={(value) => handleSliderChange('heartbeat', value)}
          />
          <Input
            id="heartbeat"
            name="heartbeat"
            type="number"
            min="40"
            max="200"
            value={formData.heartbeat}
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="spo2">Blood Oxygen - SpO₂ (%)</Label>
        <div className="flex flex-col space-y-2">
          <Slider
            value={[parseFloat(formData.spo2)]}
            min={80}
            max={100}
            step={1}
            onValueChange={(value) => handleSliderChange('spo2', value)}
          />
          <Input
            id="spo2"
            name="spo2"
            type="number"
            min="80"
            max="100"
            value={formData.spo2}
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="temperature">Body Temperature (°C)</Label>
        <div className="flex flex-col space-y-2">
          <Slider
            value={[parseFloat(formData.temperature)]}
            min={35}
            max={42}
            step={0.1}
            onValueChange={(value) => handleSliderChange('temperature', value)}
          />
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            min="35"
            max="42"
            value={formData.temperature}
            onChange={handleChange}
            className="mt-2"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Log Biometric Data'}
      </Button>
    </form>
  );
};

export default BiometricsForm;
