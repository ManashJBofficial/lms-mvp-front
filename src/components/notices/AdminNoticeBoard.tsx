import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCourses } from "@/services/courses.services";
import { Course } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateNoticeDialog from "@/components/notices/CreateNoticeDialog";
import { Notice } from "@/types/notice.types";
import { useNotices } from "@/services/notice.service";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminNoticeBoard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { getCourses } = useGetCourses();
  const { getAdminNotices } = useNotices();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchNotices();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      const transformedCourses = data.courses.map((course: any) => ({
        id: course.id,
        code: course.code,
        title: course.name,
        description: course.description,
        instructors: course.CourseInstructor.map((cu: any) => ({
          id: cu.User.id,
          name: cu.User.name,
          email: cu.User.email,
        })),
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      }));
      setCourses(transformedCourses);
      if (transformedCourses.length > 0 && !selectedCourse) {
        setSelectedCourse(transformedCourses[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching courses",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const fetchNotices = async () => {
    try {
      const data = await getAdminNotices();
      setNotices(data.notices);
    } catch (error: any) {
      toast({
        title: "Error fetching notices",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const filteredNotices = selectedCourse
    ? notices
        .filter((notice) => notice.courseId === selectedCourse)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    : notices.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

  const handleNoticeClick = (courseId: string, noticeId: string) => {
    navigate(`/notices/${courseId}/${noticeId}`);
  };

  const handleNoticeCreated = async () => {
    await fetchNotices();
  };

  return (
    <div className="h-full flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notice Board Management</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>

      <Card className="p-6">
        <Tabs
          value={selectedCourse}
          defaultValue={selectedCourse}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-4">
            {courses.map((course) => (
              <TabsTrigger
                key={course.id}
                value={course.id}
                onClick={() => setSelectedCourse(course.id)}
              >
                {course.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {courses.map((course) => (
            <TabsContent key={course.id} value={course.id}>
              <div className="space-y-4">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map(
                    (notice) => (
                      console.log("notice", notice),
                      (
                        <Card
                          key={notice.id}
                          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() =>
                            handleNoticeClick(course.id, notice.id)
                          }
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{notice.title}</h3>
                            <span className="text-sm text-muted-foreground">
                              {new Date(notice.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mb-4">{notice.content}</p>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Views: {notice?._count?.NoticeView}</span>
                            <span>Replies: {notice?.Response?.length}</span>
                          </div>
                        </Card>
                      )
                    )
                  )
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No notices available
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <CreateNoticeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        courseId={selectedCourse}
        onNoticeCreated={handleNoticeCreated}
      />
    </div>
  );
};

export default AdminNoticeBoard;
