import DialogButton from "@/components/DialogButton";
import ExerciseCategoryForm from "./components/ExerciseCategoryForm";
import useLoading from "@/hooks/useLoading.hook";
import { useEffect, useState } from "react";
import { ExerciseCategory } from "@/interfaces/exerciseCategory";
import { deleteExerciseCategory, getAllExerciseCategories } from "@/services/exercise.service";
import { useToast } from "@/components/ui/use-toast";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import ExerciseCategoriesTable from "./components/ExerciseCategoryTable";
import { useIsAdmin } from "@/hooks/useIsAdmin.hook";

const ExerciseCategoriesPage = () => {
  const { toast } = useToast();
  const isUserAdmin = useIsAdmin();

  const { isLoading, withLoading } = useLoading();
  const [exerciseCategories, setExerciseCategories] = useState<ExerciseCategory[]>([]);
  const [selectedEditExerciseCategory, setSelectedEditExerciseCategory] = useState<ExerciseCategory | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const getData = async () => {
    const data = await getAllExerciseCategories();
    setExerciseCategories(data);
  }

  useEffect(() => {
    withLoading(getData);
  }, []);

  const handleClickDelete = async (id: string) => {
    try {
      await deleteExerciseCategory(id);

      toast({
        variant: "success",
        title: "ExerciseCategory Deleted Successfully",
      });
    }
    catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Failed",
        description: `${e}`,
      });
    }
  }

  const handleClickEdit = (exercise: ExerciseCategory) => {
    setSelectedEditExerciseCategory(exercise);
    setShowEditModal(true);
  }

  return (
    <>
      <Card className="p-5 flex flex-col gap-3">
        <div className="flex sm:flex-row flex-col justify-between gap-2">
          <span className="text-xl font-semibold">Exercise Categories</span>
          {
            isUserAdmin && (
              <DialogButton
                variant="default"
                title="Create Exercise Category"
                content={
                  <div className="flex flex-col gap-3">
                    <ExerciseCategoryForm />
                  </div>
                }>Create Exercise Category</DialogButton>
            )
          }
        </div>

        <ExerciseCategoriesTable
          exerciseCategories={exerciseCategories}
          loading={isLoading}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </Card>

      {/* TODO: MAKE CREATE & EDIT THE SAME COMPONENT */}
      {/* EDIT EXERCISE CATEGORY MODAL */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[42rem]">
          <DialogHeader>
            <DialogTitle>Edit Exercise Category</DialogTitle>
          </DialogHeader>
          {selectedEditExerciseCategory ? <ExerciseCategoryForm exerciseCategory={selectedEditExerciseCategory} /> : "No Exercise Category selected!"}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ExerciseCategoriesPage