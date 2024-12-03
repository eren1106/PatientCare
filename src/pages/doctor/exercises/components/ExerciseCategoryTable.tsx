import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExerciseCategory } from '@/interfaces/exerciseCategory';
import { Eye, PenBox, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import SkeletonCard from '@/components/SkeletonCard';

interface ExerciseCategoriesTableProps {
  exerciseCategories: ExerciseCategory[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (exerciseCategory: ExerciseCategory) => void;
}

const ExerciseCategoriesTable = ({
  exerciseCategories,
  loading = false,
  onDelete,
  onEdit
}: ExerciseCategoriesTableProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedExerciseCategory, setSelectedExerciseCategory] = useState<ExerciseCategory | null>(null);

  const handleClickDeleteIcon = (exerciseCategory: ExerciseCategory) => {
    setSelectedExerciseCategory(exerciseCategory);
    setShowConfirmDialog(true);
  }

  const handleClickConfirmDelete = async () => {
    await onDelete?.(selectedExerciseCategory!.id);
    setShowConfirmDialog(false);
  }

  return (
    <>
      {
        loading ? <SkeletonCard /> :
          (
            <div className='rounded-lg border overflow-hidden'>
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[16rem]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[8rem]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exerciseCategories.map((exerciseCategory) => (
                    <TableRow
                      className=""
                      key={exerciseCategory.id}
                    >
                      <TableCell className="font-medium">{exerciseCategory.title}</TableCell>
                      <TableCell>{exerciseCategory.description}</TableCell>
                      <TableCell className="flex sm:flex-row flex-col items-center justify-start gap-2">
                        {/* <Link to={`${exerciseCategory.id}`}>
                          <Eye
                            size={36}
                            className="hover:bg-muted p-2 rounded-full"
                          />
                        </Link> */}
                        <PenBox
                          size={36}
                          className="hover:bg-muted p-2 rounded-full cursor-pointer"
                          onClick={() => onEdit?.(exerciseCategory)}
                        />
                        <Trash
                          size={36}
                          className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
                          onClick={() => handleClickDeleteIcon(exerciseCategory)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
      }

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {`Are you sure you want to delete this exercise category - ${selectedExerciseCategory?.title}?`}
          </DialogDescription>
          <DialogFooter>
            <Button variant="destructive" onClick={handleClickConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ExerciseCategoriesTable