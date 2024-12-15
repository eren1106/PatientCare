import { useLocation, useNavigate } from 'react-router-dom';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Score } from '@/services/assessment.service';


interface SectionGraphProps {
  title: string;
  data: Array<{ date: string; score: number }>;
  color: string;
}

const SectionGraph = ({ title, data, color }: SectionGraphProps) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={color} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const AssessmentDetailGraph = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const scores: Score[] = state?.scores || [];
  const questionnaireName = state?.questionnaireName;

  // Transform and sort section scores
  const sectionData = scores.reduce((acc, score) => {
    score.sectionScores.forEach((section) => {
      if (!acc[section.sectionName]) {
        acc[section.sectionName] = [];
      }
      acc[section.sectionName].push({
        date: score.assignedDate,
        score: (section.sectionScore / section.sectionTotalScore) * 100
      });
    });
    return acc;
  }, {} as Record<string, Array<{ date: string; score: number }>>);

  // Sort data by date
  Object.values(sectionData).forEach(data => {
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{questionnaireName} - Section Scores</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/tracking')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(sectionData).map(([sectionName, data]) => (
          <SectionGraph 
            key={sectionName}
            title={`${sectionName} Section`}
            data={data}
            color={'#8884d8'}
          />
        ))}
      </div>
    </div>
  );
};

export default AssessmentDetailGraph;