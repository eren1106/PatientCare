import { useNavigate } from 'react-router-dom';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import { Score } from '@/services/assessment.service';


interface QuestionnaireGraphProps {
  title: string;
  data: Array<{
    date: string;
    totalScore: number;
  }>;
  color: string;
  scores: Score[];
}

const QuestionnaireGraph = ({ title, data, color, scores }: QuestionnaireGraphProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/tracking/assessment-details', { 
            state: { 
              questionnaireName: title,
              scores: scores.filter(score => score.questionnaireName === title)
            } 
          })}
        >
          <BarChart2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
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
                dataKey="totalScore" 
                stroke={color} 
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

export default QuestionnaireGraph;