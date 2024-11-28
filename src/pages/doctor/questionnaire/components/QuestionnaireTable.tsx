import Spinner from "@/components/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash } from "lucide-react";
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
import { Questionnaire } from "@/interfaces/questionnaire";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";
import SkeletonCard from '@/components/SkeletonCard';

interface QuestionnaireTableProps {
  questionnaires: Questionnaire[];
  loading?: boolean;
  assessment?: Questionnaire[];
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (questionnaire: Questionnaire) => void;
}

const QuestionnaireTable = ({
  questionnaires,
  loading = false,
  assessment,
  onDelete,
}: QuestionnaireTableProps) => {
  // Display either questionnaire assigned to patient or all questionnaire
  const dataToRender = assessment ?? questionnaires;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire | null>(null);

  const handleClickDeleteIcon = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setShowConfirmDialog(true);
  };

  const handleClickConfirmDelete = async () => {
    await onDelete?.(selectedQuestionnaire!.id);
    setShowConfirmDialog(false);
  };

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <Table className="mt-2 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[8rem]">Title</TableHead>
              <TableHead className=" w-[8rem]">Type</TableHead>
              <TableHead className="hidden sm:table-cell w-[8rem]">Index</TableHead>
              <TableHead className="hidden sm:table-cell">Description</TableHead>
              <TableHead className="w-[8rem]">
                {assessment ? "Date Assigned" : "Date Created"}
              </TableHead>
              <TableHead className="w-[8rem]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataToRender.map((questionnaire) => (
              <TableRow className="" key={questionnaire.id}>
                <TableCell className="font-medium">
                  {questionnaire.title}
                </TableCell>
                <TableCell >
                  <Badge>{questionnaire.type}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">{questionnaire.index}</Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell md:truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                  {questionnaire.description}
                </TableCell>

                <TableCell>
                  {formatDate(questionnaire.createdDatetime)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 ">
                    <Link to={`${questionnaire.id}`}>
                      <Eye
                        size={36}
                        className="hover:bg-muted p-2 rounded-full"
                      />
                    </Link>
                    <Trash
                      size={36}
                      className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
                      onClick={() => handleClickDeleteIcon(questionnaire)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {`Are you sure you want to delete this questionnaire - ${selectedQuestionnaire?.title}?`}
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

export default QuestionnaireTable;
