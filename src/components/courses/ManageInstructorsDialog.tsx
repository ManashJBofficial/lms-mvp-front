import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetInstructors,
  useManageCourseInstructors,
} from "@/services/courses.services";
import { Instructor } from "@/types/course.types";
import { useToast } from "@/hooks/use-toast";

interface ManageInstructorsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  currentInstructors: Instructor[];
  onRefreshCourses: () => Promise<void>;
}

export function ManageInstructorsDialog({
  open,
  onOpenChange,
  courseId,
  currentInstructors,
  onRefreshCourses,
}: ManageInstructorsDialogProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const { getInstructors, loading: loadingInstructors } = useGetInstructors();
  const { updateCourseInstructors, loading: updating } =
    useManageCourseInstructors();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchInstructors();
      setSelectedInstructors(
        currentInstructors.map((instructor) => instructor.id)
      );
    }
  }, [open, currentInstructors]);

  const fetchInstructors = async () => {
    try {
      const data = await getInstructors();
      setInstructors(data.users);
    } catch (error: any) {
      toast({
        title: "Error fetching instructors",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await updateCourseInstructors(
        courseId,
        selectedInstructors
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Course instructors updated successfully",
        });

        onOpenChange(false);

        await onRefreshCourses();
      }
    } catch (error: any) {
      console.error("Failed to update course instructors:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update instructors",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Course Instructors</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-[300px] pr-4">
            {loadingInstructors ? (
              <div className="flex items-center justify-center h-full">
                Loading instructors...
              </div>
            ) : (
              <div className="space-y-4">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={instructor.id}
                      checked={selectedInstructors.includes(instructor.id)}
                      onCheckedChange={(checked) => {
                        setSelectedInstructors(
                          checked
                            ? [...selectedInstructors, instructor.id]
                            : selectedInstructors.filter(
                                (id) => id !== instructor.id
                              )
                        );
                      }}
                    />
                    <Label htmlFor={instructor.id} className="flex flex-col">
                      <span>{instructor.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {instructor.email}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updating || loadingInstructors}
          >
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
