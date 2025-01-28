import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useGetInstructorCourseDetails } from "@/services/courses.services";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseDetail {
  id: string;
  name: string;
  code: string;
  activeNotices: any[];
}

const InstructorCourses = () => {
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const { getInstructorCourseDetails, loading } =
    useGetInstructorCourseDetails();

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const data = await getInstructorCourseDetails();
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">My Courses</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="relative">
              <Badge
                className="absolute -top-2 -right-2 z-10"
                variant={
                  course.activeNotices.length > 0 ? "destructive" : "secondary"
                }
              >
                {course.activeNotices.length} notices
              </Badge>
              <Card className="hover:bg-accent transition-colors h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Code: {course.code}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses;
