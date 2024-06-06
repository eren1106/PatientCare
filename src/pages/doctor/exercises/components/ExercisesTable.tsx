import Spinner from '@/components/Spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Exercise } from '@/interfaces/exercise';
import { Eye, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExercisesTableProps {
  exercises: Exercise[];
  loading?: boolean;
  onDelete?: () => void;
}

const ExercisesTable = ({
  exercises,
  loading = false,
  onDelete,
}: ExercisesTableProps) => {
  return (
    <>
      {
        loading ? <Spinner /> : <Table className="mt-2 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[16rem]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[8rem]">Date Created</TableHead>
              <TableHead className="w-[8rem]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise) => (
              <TableRow
                className="hover:bg-muted"
                key={exercise.id}
              >
                <TableCell className="font-medium">{exercise.title}</TableCell>
                <TableCell>{exercise.description}</TableCell>
                <TableCell>{new Date(exercise.createdDatetime).toLocaleDateString()}</TableCell>
                <TableCell className="flex items-center justify-start gap-3 ">
                  <Link to={`${exercise.id}`}>
                    <Eye
                      size={36}
                      className="hover:bg-table-100 p-2 rounded-full"
                    />
                  </Link>
                  <Trash
                    size={36}
                    className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
                    onClick={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    </>
  )
}

export default ExercisesTable