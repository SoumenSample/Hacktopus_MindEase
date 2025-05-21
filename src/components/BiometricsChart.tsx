
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface BiometricsChartProps {
  type: 'gsr' | 'heartbeat' | 'spo2' | 'temperature';
  title: string;
}

interface Biometric {
  id: string;
  gsr: number;
  heartbeat: number;
  spo2: number;
  temperature: number;
  recorded_at: string;
}

const BiometricsChart = ({ type, title }: BiometricsChartProps) => {
  const { authState } = useAuth();
  const [data, setData] = useState<Biometric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.user) return;

      try {
        const { data, error } = await supabase
          .from('biometrics')
          .select('*')
          .eq('user_id', authState.user.id)
          .order('recorded_at', { ascending: true });

        if (error) throw error;
        
        setData(data || []);
      } catch (error: any) {
        toast.error(`Error loading data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authState.user]);

  const formattedData = data.map(item => ({
    ...item,
    time: format(new Date(item.recorded_at), 'HH:mm'),
    date: format(new Date(item.recorded_at), 'MM/dd')
  }));

  const getChartConfig = () => {
    switch (type) {
      case 'gsr':
        return {
          yAxisLabel: 'µS',
          color: '#0ea5e9',
          domain: [0, 100]
        };
      case 'heartbeat':
        return {
          yAxisLabel: 'BPM',
          color: '#ef4444',
          domain: [40, 200]
        };
      case 'spo2':
        return {
          yAxisLabel: '%',
          color: '#8b5cf6',
          domain: [80, 100]
        };
      case 'temperature':
        return {
          yAxisLabel: '°C',
          color: '#f97316',
          domain: [35, 42]
        };
      default:
        return {
          yAxisLabel: '',
          color: '#3b82f6',
          domain: [0, 100]
        };
    }
  };

  const config = getChartConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Recent measurements over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            Loading chart data...
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available. Please log some measurements first.
          </div>
        ) : (
          <ChartContainer
            config={{
              [type]: {
                label: type.charAt(0).toUpperCase() + type.slice(1),
                color: config.color
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  domain={config.domain}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{
                    value: config.yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: 12 }
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Date:</div>
                            <div>{data.date}</div>
                            <div className="font-medium">Time:</div>
                            <div>{data.time}</div>
                            <div className="font-medium">Value:</div>
                            <div>{data[type]}</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={type}
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BiometricsChart;
