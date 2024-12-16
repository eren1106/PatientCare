import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAssessmentAnalytics, Score } from '@/services/assessment.service';
import Spinner from '@/components/Spinner';
import QuestionnaireGraph from './QuestionnaireGraph';

interface AssessmentScoreGraphProps {
  selectedPatientId: string | null;
}

const AssessmentScoreGraph = ({ selectedPatientId }: AssessmentScoreGraphProps) => {
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      if (!selectedPatientId) return;
      setLoading(true);
      try {
        const data = await getAssessmentAnalytics(selectedPatientId);
        setScores(data);
      } catch (error) {
        setScores([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [selectedPatientId]);

  const sortByDate = (a: any, b: any) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  };

   // Group data by questionnaire name
   // Update groupedData with sorting
  const groupedData = scores.reduce((acc, score) => {
    const name = score.questionnaireName;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push({
      date: score.assignedDate,
      totalScore: parseInt(score.totalScore)
    });
    // Sort after adding new data
    acc[name].sort(sortByDate);
    return acc;
  }, {} as Record<string, any[]>);

  // Colors for different questionnaires
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];


  if (loading) return <Card className="w-full"><CardContent><Spinner /></CardContent></Card>;


  if (scores.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-semibold text-gray-700">No Assessment Found</p>
          <p className="text-sm text-gray-500">This patient has not completed any assessments yet.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
    <div className="flex items-center">
      <h2 className="text-2xl font-bold">Assessment Scores</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedData).map(([name, data], index) => (
        <QuestionnaireGraph 
          key={name}
          title={name}
          data={data}
          color={colors[index % colors.length]}
          scores={scores.filter(score => score.questionnaireName === name)}
        />
      ))}
    </div>
  </div>
  );
};

export default AssessmentScoreGraph;