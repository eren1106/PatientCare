import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom";

interface ExerciseCardProps {
  id: string;
  title: string;
  description: string;
  isCompleted?: boolean;
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
  // const handleMarkComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation(); // Prevent the event from bubbling up to parent elements
  //   e.preventDefault(); // Prevent the default action of the event (navigation)

  //   try {
  //     await completePatientExercise(id);
  //     toast({
  //       title: "Marked as complete!",
  //       description: "Congrats on completing this exercise for today!",
  //       variant: "success"
  //     })
  //   }
  //   catch (e) {
  //     console.error(e);
  //     toast({
  //       title: "Failed",
  //       description: "Something went wrong!",
  //       variant: "destructive",
  //     })
  //   }
  // };

  return (
    <Link to={to || id} className="w-full">
      <Card className="w-full overflow-hidden flex flex-col md:flex-row gap-4 p-4 shadow-md rounded-xl">
        <img
          src={thumbnailUrl}
          alt="exercise thumbnail"
          className="size-full sm:size-28 object-cover rounded-xl"
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center flex-wrap">
            <h3>{title}</h3>
            <Badge
              variant={isCompleted ? "default" : "destructive"}
              className="h-fit"
            >{isCompleted ? "Completed" : "Incomplete"}</Badge>
          </div>
          <p>{description}</p>
        </div>
      </Card>
    </Link>
  )
}

export default ExerciseCard