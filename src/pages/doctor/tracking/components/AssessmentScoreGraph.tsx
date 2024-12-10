import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockData = [
  { date: '2024-01-01', totalScore: 85 },
  { date: '2024-02-01', totalScore: 78 },
  { date: '2024-03-01', totalScore: 92 },
  { date: '2024-04-01', totalScore: 88 },
];

const AssessmentScoreGraph = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Assessment Score Trend</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/tracking/assessment-details')}
        >
          <BarChart2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalScore"
                stroke="#8884d8"
                strokeWidth={2}
                name="Total Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentScoreGraph;