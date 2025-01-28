import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNotices } from "@/services/notice.service";
import { useToast } from "@/hooks/use-toast";

interface CreateNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  onNoticeCreated: () => void;
}

const CreateNoticeDialog = ({
  open,
  onOpenChange,
  courseId,
  onNoticeCreated,
}: CreateNoticeDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNotice } = useNotices();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNotice(courseId, { title, content });
      toast({
        title: "Notice created successfully",
        variant: "default",
      });
      setTitle("");
      setContent("");
      onOpenChange(false);
      onNoticeCreated();
    } catch (error: any) {
      toast({
        title: "Error creating notice",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTitle("");
      setContent("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95%] p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Create New Notice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter notice content"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create Notice</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoticeDialog;
