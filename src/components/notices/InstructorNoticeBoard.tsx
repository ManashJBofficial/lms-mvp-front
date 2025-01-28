import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotices } from "@/services/notice.service";
import { useToast } from "@/hooks/use-toast";
import { Notice } from "@/types/notice.types";
import { useNavigate } from "react-router-dom";

const InstructorNoticeBoard = () => {
  const navigate = useNavigate();
  const [noticeBoards, setNoticeBoards] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const {
    getInstructorNoticeBoards,
    incrementNoticeView,
  } = useNotices();
  const { toast } = useToast();

  useEffect(() => {
    fetchNoticeBoards();
  }, []);

  const fetchNoticeBoards = async () => {
    try {
      const data = await getInstructorNoticeBoards();
      setNoticeBoards(data.noticeBoards);
      if (data.noticeBoards.length > 0) {
        setSelectedCourse(data.noticeBoards[0].courseId);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching notice boards",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleNoticeClick = async (courseId: string, noticeId: string) => {
    try {
      await incrementNoticeView(noticeId);
      window.dispatchEvent(new Event('noticeViewed'));
      navigate(`/notices/${courseId}/${noticeId}`);
    } catch (error) {
      console.error("Error incrementing view count:", error);
      navigate(`/notices/${courseId}/${noticeId}`);
    }
  };

  return (
    <div className="h-full flex-1 space-y-6">
      <h1 className="text-2xl font-bold">Course Notice Boards</h1>

      <Card className="p-6">
        <Tabs
          value={selectedCourse}
          defaultValue={selectedCourse}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-4">
            {noticeBoards.map((board) => (
              <TabsTrigger
                key={board.courseId}
                value={board.courseId}
                onClick={() => setSelectedCourse(board.courseId)}
              >
                {board.courseName}
              </TabsTrigger>
            ))}
          </TabsList>

          {noticeBoards.map((board) => (
            <TabsContent key={board.courseId} value={board.courseId}>
              <div className="space-y-4">
                {board.notices.map((notice: Notice) => (
                  <Card
                    key={notice.id}
                    className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors relative ${
                      !notice.isViewed
                        ? "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                    onClick={() => handleNoticeClick(board.courseId, notice.id)}
                  >
                    {!notice.isViewed && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-sm" />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`font-semibold ${
                          !notice.isViewed
                            ? "text-blue-700 dark:text-blue-400"
                            : ""
                        }`}
                      >
                        {notice.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mb-4">{notice.content}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Views: {notice.viewCount}</span>
                      <span>Replies: {notice.responseCount}</span>
                    </div>
                  </Card>
                ))}
                {board.notices.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No notices available
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default InstructorNoticeBoard;
