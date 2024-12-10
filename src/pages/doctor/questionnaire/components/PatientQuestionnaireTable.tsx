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
import { useState, useMemo } from "react";
import { Assessment, Questionnaire } from "@/interfaces/questionnaire";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";
import { ArrowUpDown } from "lucide-react";
import { DropdownMenu,  DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PatientAssessment } from "@/services/assessment.service";

interface QuestionnaireTableProps {
  recordId: string;
  loading?: boolean;
  assessment: Assessment[];
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (questionnaire: Questionnaire) => void;
}

type SortCriteria = "type" | "dateAsc" | "dateDesc";

const PatientQuestionnaireTable = ({
  loading = false,
  assessment,
  recordId,
  onDelete,
}: QuestionnaireTableProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const handleClickDeleteIcon = (questionnaire: Assessment) => {
    setSelectedAssessment(questionnaire);
    setShowConfirmDialog(true);
  };

  const handleClickConfirmDelete = async () => {
    await onDelete?.(selectedAssessment!.id);
    setShowConfirmDialog(false);
  };

  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("dateDesc");

  const sortedAssessments = useMemo(() => {
    const sorted = [...assessment];

    switch (sortCriteria) {
      case "type":
        return sorted.sort((a, b) =>
          a.questionnaire.type.localeCompare(b.questionnaire.type)
        );
      case "dateAsc":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdDatetime).getTime() -
            new Date(b.createdDatetime).getTime()
        );
      case "dateDesc":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdDatetime).getTime() -
            new Date(a.createdDatetime).getTime()
        );
      default:
        return sorted;
    }
  }, [assessment, sortCriteria]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Table className="mt-2 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[8rem]">Title</TableHead>
              <TableHead className="w=[8rem] hidden sm:table-cell">
                Description
              </TableHead>
              <TableHead className="w=[8rem]">
                <div className="flex items-center gap-2">
                  General
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortCriteria("type")}>
                        Sort by Type
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortCriteria("dateAsc")}
                      >
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortCriteria("dateDesc")}
                      >
                        Newest First
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className="w-[8rem]">
                {assessment ? "Date Assigned" : "Date Created"}
              </TableHead>
              <TableHead className="w-[8rem]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssessments.map((assessment: Assessment) => (
              <TableRow className="" key={assessment.id}>
                <TableCell className="font-medium">
                  {assessment.questionnaire.title}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-ellipsis">
                  {assessment.questionnaire.description}
                </TableCell>
                <TableCell>
                  <Badge>{assessment.questionnaire.type}</Badge>
                </TableCell>
                <TableCell>
                  {formatDate(assessment.questionnaire.createdDatetime)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2 ">
                    <Link
                      to={
                        assessment
                          ? `/dashboard/patients/${recordId}/questionnaire/${
                              (assessment as Assessment).id
                            }/result`
                          : `/dashboard/questionnaire/${
                              (assessment as Assessment).questionnaire.id
                            }`
                      }
                      state={{ recordId: recordId }}
                    >
                      <Eye
                        size={36}
                        className="hover:bg-muted p-2 rounded-full"
                      />
                    </Link>
                    <Trash
                      size={36}
                      className="hover:bg-table-100 p-2 rounded-full cursor-pointer"
                      onClick={() => handleClickDeleteIcon(assessment)}
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
            {`Are you sure you want to delete this questionnaire - ${selectedAssessment?.questionnaire.title}?`}
          </DialogDescription>
          <div></div>
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

export default PatientQuestionnaireTable;
