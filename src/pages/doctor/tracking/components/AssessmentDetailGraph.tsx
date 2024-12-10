// components/AssessmentDetailGraph.tsx
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const mockData = {
  physical: [
    { date: '2024-01-01', score: 80 },
    { date: '2024-02-01', score: 85 },
    { date: '2024-03-01', score: 75 },
    { date: '2024-04-01', score: 90 },
  ],
  mental: [
    { date: '2024-01-01', score: 70 },
    { date: '2024-02-01', score: 75 },
    { date: '2024-03-01', score: 85 },
    { date: '2024-04-01', score: 80 },
  ],
  pain: [
    { date: '2024-01-01', score: 65 },
    { date: '2024-02-01', score: 70 },
    { date: '2024-03-01', score: 80 },
    { date: '2024-04-01', score: 75 },
  ],
  mobility: [
    { date: '2024-01-01', score: 85 },
    { date: '2024-02-01', score: 90 },
    { date: '2024-03-01', score: 85 },
    { date: '2024-04-01', score: 95 },
  ],
};

const SectionGraph = ({ title, data, color }: { title: string; data: any[]; color: string }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
            <YAxis domain={[0, 100]} />
            <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
            <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const AssessmentDetailGraph = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Section Score Progress</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/tracking')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionGraph title="Physical Section" data={mockData.physical} color="#82ca9d" />
        <SectionGraph title="Mental Section" data={mockData.mental} color="#8884d8" />
        <SectionGraph title="Pain Section" data={mockData.pain} color="#ff7300" />
        <SectionGraph title="Mobility Section" data={mockData.mobility} color="#0088fe" />
      </div>
    </div>
  );
};

export default AssessmentDetailGraph;