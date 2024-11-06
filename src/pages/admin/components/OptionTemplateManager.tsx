import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  getAllOptionTemplates,
  createOptionTemplate,
  deleteOptionTemplate,
} from "@/services/questionnaire.service";
import { OptionTemplate } from "@/interfaces/questionnaire";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import GenericFormField from "@/components/GenericFormField";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Card } from "@/components/ui/card";

const OptionTemplateSchema = z.object({
  scaleType: z.string().min(1, "Scale type is required"),
  options: z
    .array(
      z.object({
        scaleValue: z.coerce.number().min(1, "Scale value is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .min(1, "At least one option is required"),
});

type OptionTemplateFormValues = z.infer<typeof OptionTemplateSchema>;

const OptionTemplateManager = () => {
  const [optionTemplates, setOptionTemplates] = useState<OptionTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);

  const form = useForm<OptionTemplateFormValues>({
    resolver: zodResolver(OptionTemplateSchema),
    defaultValues: {
      scaleType: "",
      options: [{ scaleValue: 0, content: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    const fetchOptionTemplates = async () => {
      try {
        const data = await getAllOptionTemplates();
        setOptionTemplates(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchOptionTemplates();
  }, []);

  const handleCreate = async (data: OptionTemplateFormValues) => {
    try {
      await createOptionTemplate(data);
      toast({
        title: "Option Template Created",
        variant: "success",
      });
      // Refresh the list of option templates
      const updatedTemplates = await getAllOptionTemplates();
      setOptionTemplates(updatedTemplates);
      setIsModalOpen(false);
      form.reset();
    } catch (e : any) {
      toast({
        title: "Failed to create option template",
        description: `${e.response.data.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async ()=> {
    if (!deletingTemplateId) return;
    try {
      await deleteOptionTemplate(deletingTemplateId);
      toast({
        title: "Option Template Deleted",
        variant: "success",
      });

      const updatedTemplates = await getAllOptionTemplates();
      setOptionTemplates(updatedTemplates);
      setIsDeleteDialogOpen(false);
      setDeletingTemplateId(null);

    } catch (e : any) {
      toast({
        title: "Failed to delete option template",
        description: `${e.response.data.message}`,
        variant: "destructive",
      });
    }
  };

  const openModal = () => {
    form.reset({
      scaleType: '',
      options: [{ scaleValue: 1, content: '' }],
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingTemplateId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="mt-5 p-6">
        <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Admin - Option Template</h1>
        <Button variant="secondary" onClick={() => openModal()}>Create Option Template</Button>
        </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Scale Type</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optionTemplates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.scaleType}</TableCell>
              <TableCell className="flex gap-2 items-center ">
                {template.option.map((option) => (
                  <Badge variant="secondary" key={option.id}>
                    {option.scaleValue} {option.content? `:` : ""} {option.content}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
              <TableCell>
                <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(template.id)}>Delete Template</Button>
              </TableCell>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create Option Template</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreate)}
            >
              <div className="flex flex-col gap-5 bg-slate-100 p-5 rounded-md mb-5">
                <GenericFormField
                  control={form.control}
                  name="scaleType"
                  label="Scale Type"
                  placeholder="Enter scale type"
                />
                <label>Options</label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center justify-center">
                    <GenericFormField
                      control={form.control}
                      name={`options.${index}.scaleValue`}
                      label="Scale Value"
                      type="number"
                      placeholder="Scale Value"
                    />
                    <GenericFormField
                      control={form.control}
                      name={`options.${index}.content`}
                      label="Content"
                      placeholder="Content"
                    />
                    <Trash
                        size={30}
                        className="hover:bg-table-400 rounded-full mt-5"
                        color="red"
                        onClick={() => remove(index)}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => append({ scaleValue: 1, content: "" })}
                >
                  Add Option
                </Button>
              </div>
              <SheetFooter>
                <Button type="submit">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this option template? This action cannot be undone and will fail if the option is used in any questionnaire.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default OptionTemplateManager;
