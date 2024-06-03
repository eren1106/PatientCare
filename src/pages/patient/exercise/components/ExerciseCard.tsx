import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast";
import { MOCK_EXERCISES } from "@/constants";
import { completePatientExercise } from "@/services/patientExercise.service";
import { Link } from "react-router-dom";

interface ExerciseCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  isCompleted: boolean;
  to?: string;
}

const ExerciseCard = ({
  id,
  title,
  description,
  thumbnailUrl,
  isCompleted,
  to
}: ExerciseCardProps) => {
  const handleMarkComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the event from bubbling up to parent elements
    e.preventDefault(); // Prevent the default action of the event (navigation)

    try{
      await completePatientExercise(id);
      toast({
        title: "Marked as complete!",
        description: "Congrats on completing this exercise for today!",
      })
    }
    catch (e) {
      console.error(e);
      toast({
        title: "Failed",
        description: "Something went wrong!",
        variant: "destructive",
      })
    }
  };

  return (
    <Link to={to || String(id)}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={thumbnailUrl || MOCK_EXERCISES[0].thumnbailUrl} alt="exercise thumbnail" />
        </CardContent>
        <CardFooter>
          {
            isCompleted
              ? <p>Completed</p>
              : <Button onClick={handleMarkComplete}>Mark as complete</Button>
          }
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ExerciseCard