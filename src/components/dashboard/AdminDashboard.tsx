import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const { toast } = useToast();
  const COLORS = ["#0088FE", "#FF8042"];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stats = await userService.getAdminDashboardStats();
        setDashboardStats(stats);
      } catch (error: any) {
        toast({
          title: "Error fetching dashboard statistics",
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    };

    fetchDashboardStats();
  }, []);

  if (!dashboardStats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Courses
          </h3>
          <p className="text-3xl font-bold">
            {dashboardStats.statistics.totalCourses}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Avg. Teachers per Course
          </h3>
          <p className="text-3xl font-bold">
            {dashboardStats.statistics.avgTeachersPerCourse.toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Noticeboard Viewership
          </h3>
          <p className="text-3xl font-bold">
            {dashboardStats.statistics.noticeboardStats.viewershipPercentage}%
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Response Rate
          </h3>
          <p className="text-3xl font-bold">
            {dashboardStats.statistics.noticeboardStats.responsePercentage}%
          </p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Teacher Gender Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Male",
                      value: dashboardStats.statistics.teacherGenderSplit.male,
                    },
                    {
                      name: "Female",
                      value:
                        dashboardStats.statistics.teacherGenderSplit.female,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Course Notice Updates</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardStats.courseWiseStats.map((course: any) => ({
                  course: course.courseName,
                  updates: course.recentNotices.length,
                }))}
              >
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="updates" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Course-wise Notice Board</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Total Updates</th>
                <th className="text-left py-3 px-4">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {dashboardStats.courseWiseStats.map((course: any) => (
                <tr key={course.courseId} className="border-b">
                  <td className="py-3 px-4">{course.courseName}</td>
                  <td className="py-3 px-4">{course.recentNotices.length}</td>
                  <td className="py-3 px-4">
                    {course.recentNotices.length > 0
                      ? new Date(
                          course.recentNotices[0].createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
