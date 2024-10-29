import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast";
import { MOCK_EXERCISES } from "@/constants";
import { completePatientExercise } from "@/services/patientExercise.service";
import { Link } from "react-router-dom";

interface ExerciseCardProps {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  thumbnailUrl?: string;
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
        variant: "success"
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
    <Link to={to || id}>
      <Card className="sm:w-[22rem] w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={thumbnailUrl || MOCK_EXERCISES[0].thumbnailUrl} alt="exercise thumbnail" />
        </CardContent>
        <CardFooter>
          {
            isCompleted
              ? <p className="text-lg font-bold text-primary">Completed</p>
              : <Button onClick={handleMarkComplete}>Mark as complete</Button>
          }
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ExerciseCard