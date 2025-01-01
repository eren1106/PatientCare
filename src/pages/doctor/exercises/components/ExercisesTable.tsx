import Spinner from "@/components/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Exercise } from "@/interfaces/exercise";
import { Eye, PenBox, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDate, refreshPage } from "@/utils";
import SkeletonCard from "@/components/SkeletonCard";

interface ExercisesTableProps {
  exercises: Exercise[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (exercise: Exercise) => void;
}

const ExercisesTable = ({
  exercises,
  loading = false,
  onDelete,
  onEdit,
}: ExercisesTableProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  const handleClickDeleteIcon = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowConfirmDialog(true);
  };

  const handleClickConfirmDelete = async () => {
    await onDelete?.(selectedExercise!.id);
    setShowConfirmDialog(false);
    refreshPage();
  };

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[16rem]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[8rem]">Date Created</TableHead>
                <TableHead className="w-[8rem]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exercises.map((exercise) => (
                <TableRow className="" key={exercise.id}>
                  <TableCell className="font-medium">
                    {exercise.title}
                  </TableCell>
                  <TableCell>{exercise.description}</TableCell>
                  <TableCell>{formatDate(exercise.createdDatetime)}</TableCell>
                  <TableCell className="flex sm:flex-row flex-col items-center justify-start gap-2">
                    <Link to={`${exercise.id}`}>
                      <Eye
                        size={36}
                        className="hover:bg-muted p-2 rounded-full"
                      />
                    </Link>

                    <PenBox
                      size={36}
                      className="hover:bg-muted p-2 rounded-full cursor-pointer"
                      onClick={() => onEdit?.(exercise)}
                    />
                    <Trash
                      size={36}
                      className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
                      onClick={() => handleClickDeleteIcon(exercise)}
                    />

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {`Are you sure you want to delete this exercise - ${selectedExercise?.title}?`}
          </DialogDescription>
          <DialogFooter>
            <Button variant="destructive" onClick={handleClickConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExercisesTable;
