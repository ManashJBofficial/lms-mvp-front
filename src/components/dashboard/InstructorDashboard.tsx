import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useJoinCourse } from "@/services/courses.services";
import { useToast } from "@/hooks/use-toast";

const InstructorDashboard = () => {
  const [courseId, setCourseId] = useState("");
  const { joinCourse, loading } = useJoinCourse();
  const { toast } = useToast();

  const handleJoinCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a course ID",
        variant: "destructive",
      });
      return;
    }

    try {
      await joinCourse(courseId);
      toast({
        title: "Success",
        description: "Successfully joined the course",
        variant: "default",
      });
      setCourseId("");
    } catch (error: any) {
      toast({
        title: "Error joining course",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleJoinCourse} className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Join a Course</h2>
              <p className="text-sm text-muted-foreground">
                Enter the course ID to join as an instructor
              </p>
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Enter course ID"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="max-w-sm"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Joining..." : "Join Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorDashboard;
