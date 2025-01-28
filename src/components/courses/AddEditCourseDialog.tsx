import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface CourseDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  mode: "create" | "edit";
}

const CourseDialog: React.FC<CourseDialogProps> = ({
  open,
  setOpen,
  handleSubmit,
  name,
  setName,
  description,
  setDescription,
  mode,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      setDescription("");
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95%] p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Course" : "Create New Course"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter course name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {mode === "edit" ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDialog;
