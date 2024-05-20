import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom";

interface ExerciseCardProps {
  id: string;
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
  const handleMarkComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the event from bubbling up to parent elements
    e.preventDefault(); // Prevent the default action of the event (navigation)
  };

  return (
    <Link to={to || id}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={thumbnailUrl} alt="exercise thumbnail" />
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