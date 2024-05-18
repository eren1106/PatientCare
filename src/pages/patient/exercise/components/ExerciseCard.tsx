import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ExerciseCardProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  isCompleted: boolean;
}

const ExerciseCard = ({
  title,
  description,
  thumbnailUrl,
  isCompleted,
}: ExerciseCardProps) => {
  return (
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
          isCompleted ? <p>Completed</p> : <Button>Mark as complete</Button>
        }
      </CardFooter>
    </Card>
  )
}

export default ExerciseCard