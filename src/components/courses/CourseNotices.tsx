import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotices } from "@/services/notice.service";
import { useToast } from "@/hooks/use-toast";
import { Notice } from "@/types/notice.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface CourseNoticesProps {
  courseId: string;
}

export const CourseNotices = ({ courseId }: CourseNoticesProps) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNotice, getCourseNotices } = useNotices();
  const { toast } = useToast();

  const fetchNotices = async () => {
    try {
      const data = await getCourseNotices(courseId);
      setNotices(data.notices);
    } catch (error: any) {
      toast({
        title: "Error fetching notices",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNotice(courseId, { title, content });
      toast({
        title: "Notice created successfully",
        variant: "default",
      });
      setTitle("");
      setContent("");
      fetchNotices();
    } catch (error: any) {
      toast({
        title: "Error creating notice",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Create Notice</h3>
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <div>
            <Input
              placeholder="Notice Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Notice Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Post Notice</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Course Notices</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {notices.map((notice) => (
              <Card key={notice.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{notice.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(notice.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm mb-4">{notice.content}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Views: {notice.views}</span>
                  <span>Replies: {notice.replies.length}</span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};
