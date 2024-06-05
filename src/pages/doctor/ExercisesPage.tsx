import DialogButton from "@/components/DialogButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_EXERCISES } from "@/constants"
import { useNavigate } from "react-router-dom";
import ExerciseForm from "./exercises/components/ExerciseForm";

const ExercisesPage = () => {
  const navigate = useNavigate();

  const handleNavigateToExerciseDetail = (id: string) => {
    navigate(id);
  }

  return (
    <div>
      <div className="border border-gray-300 rounded-lg p-5 gap-2">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">Exercises</span>
          <DialogButton
            variant="default"
            content={
              <div className="flex flex-col gap-3">
                <h2 className="text-center">Create Exercise</h2>
                <ExerciseForm />
              </div>
            }>Add Exercise</DialogButton>
        </div>

        <Table className="mt-2 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[16rem]">Exercise</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[8rem]">Date Created</TableHead>
              {/* <TableHead className="w-[8rem]">Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_EXERCISES.map((exercise) => (
              <TableRow
                className="cursor-pointer hover:bg-muted"
                key={exercise.id}
                onClick={() => handleNavigateToExerciseDetail(exercise.id)}
              >
                <TableCell className="font-medium">{exercise.title}</TableCell>
                <TableCell>{exercise.description}</TableCell>
                <TableCell>{exercise.createdDatetime.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ExercisesPage