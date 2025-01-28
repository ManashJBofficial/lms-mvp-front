import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNotices } from "@/services/notice.service";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Notice } from "@/types/notice.types";
import { ScrollArea } from "@/components/ui/scroll-area";

const NoticeDetail = () => {
  const { courseId, noticeId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { addReply, getNoticesByCourseId } = useNotices();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoticeDetails();
  }, [courseId]);

  const fetchNoticeDetails = async () => {
    try {
      const data = await getNoticesByCourseId(courseId!, noticeId!);
      if (data) {
        setNotice(data.notice);
      } else {
        toast({
          title: "Notice not found",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching notice details",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      await addReply(noticeId!, replyContent);
      toast({
        title: "Reply added successfully",
        variant: "default",
      });
      setReplyContent("");
      fetchNoticeDetails();
    } catch (error: any) {
      toast({
        title: "Error adding reply",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="md:pl-[240px] pl-0 transition-[padding] duration-300">
        <div className="p-4 max-w-7xl mx-auto">
          <div className="h-full flex-1 space-y-6">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="md:pl-[240px] pl-0 transition-[padding] duration-300">
        <div className="p-4 max-w-7xl mx-auto">
          <div className="h-full flex-1 space-y-6">
            <p>Notice not found</p>
          </div>
        </div>
      </div>
    );
  }
  console.log("notice--", notice);
  return (
    <div className="md:pl-[240px] pl-0 transition-[padding] duration-300 h-screen flex flex-col">
      <div className="p-4 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center justify-start gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notices
          </Button>

          <Card className="p-6 bg-muted/50 border-2">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{notice.title}</h2>
                <span className="text-sm text-muted-foreground">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-lg">{notice.content}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Posted by: {notice?.User.name}</span>
                <span>Views: {notice._count?.NoticeView || 0}</span>
              </div>
            </div>
          </Card>

          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-xl font-semibold mb-4">Replies</h3>
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-4">
                {notice.Response && notice.Response.length > 0 ? (
                  notice.Response.map((reply) => (
                    <Card key={reply.id} className="p-4">
                      <p className="mb-2">{reply.content}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{reply.User.name}</span>
                        <span>
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No replies yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>

          <Card className="p-4 sticky bottom-0 bg-background mt-4">
            <h3 className="font-semibold mb-4">Add Reply</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
              />
              <Button onClick={handleReply}>Post Reply</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
