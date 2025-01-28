import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDeleteCourse } from "@/services/courses.services";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  onRefreshCourses: () => Promise<void>;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onOpenChange,
  courseId,
  onRefreshCourses,
}) => {
  const { deleteCourse } = useDeleteCourse();
  const { toast } = useToast();

  const handleDeleteCourse = async () => {
    try {
      await deleteCourse(courseId);
      toast({
        title: "Course deleted successfully",
        variant: "default",
      });
      onOpenChange(false);
      onRefreshCourses();
    } catch (error: any) {
      toast({
        title: "Error deleting course",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95%] p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this course?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteCourse}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
