import Spinner from '@/components/Spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PatientExercise } from '@/interfaces/exercise';
import { Eye, Pen, PenBox, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

interface PatientExercisesTableProps {
  patientExercises: PatientExercise[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (patientExercise: PatientExercise) => void;
}

const PatientExercisesTable = ({
  patientExercises,
  loading = false,
  onDelete,
  onEdit,
}: PatientExercisesTableProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPatientExercise, setSelectedPatientExercise] = useState<PatientExercise | null>(null);

  const handleClickDeleteIcon = (exercise: PatientExercise) => {
    setSelectedPatientExercise(exercise);
    setShowConfirmDialog(true);
  }

  const handleClickConfirmDelete = async () => {
    await onDelete?.(selectedPatientExercise!.id);
    setShowConfirmDialog(false);
  }

  return (
    <>
      {
        loading ? <Spinner /> : <Table className="mt-2 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[14rem]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[6rem]">Sets</TableHead>
              <TableHead className="w-[8rem]">Date Created</TableHead>
              <TableHead className="w-[8rem]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientExercises.map((patientExercise) => {
              const exercise = patientExercise.exercise;
              return (
                (
                  <TableRow
                    className=""
                    key={patientExercise.id}
                  >
                    <TableCell className="font-medium">{exercise.title}</TableCell>
                    <TableCell>{exercise.description}</TableCell>
                    <TableCell>{patientExercise.sets}</TableCell>
                    <TableCell>{new Date(exercise.createdDatetime).toLocaleDateString()}</TableCell>
                    <TableCell className="flex items-center justify-start gap-2 ">
                      <Link to={`/dashboard/exercises/${exercise.id}`}>
                        <Eye
                          size={36}
                          className="hover:bg-muted p-2 rounded-full"
                        />
                      </Link>
                      <PenBox
                        size={36}
                        className="hover:bg-muted p-2 rounded-full cursor-pointer"
                        onClick={() => onEdit?.(patientExercise)}
                      />
                      <Trash
                        size={36}
                        className="hover:bg-muted p-2 rounded-full cursor-pointer"
                        onClick={() => handleClickDeleteIcon(patientExercise)}
                      />
                    </TableCell>
                  </TableRow>
                )
              )
            })}
          </TableBody>
        </Table>
      }

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Unassign Exercise</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {`Are you sure you want to unassign this exercise (${selectedPatientExercise?.exercise.title}) to patient ?`}
          </DialogDescription>
          <div></div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleClickConfirmDelete}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PatientExercisesTable