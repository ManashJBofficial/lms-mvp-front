interface User {
  id: string;
  gender: "MALE" | "FEMALE";
}

interface UsersResponse {
  users: User[];
}

interface GenderDistribution {
  male: number;
  female: number;
}

interface DashboardStats {
  statistics: {
    totalCourses: number;
    avgTeachersPerCourse: number;
    teacherGenderSplit: {
      male: number;
      female: number;
    };
    noticeboardStats: {
      totalNotices: number;
      viewershipPercentage: number;
      responsePercentage: number;
    };
  };
  courseWiseStats: {
    courseId: string;
    courseName: string;
    courseCode: string;
    instructorCount: number;
    genderSplit: {
      male: number;
      female: number;
    };
    recentNotices: {
      id: string;
      title: string;
      createdAt: string;
      viewCount: number;
      responseCount: number;
    }[];
  }[];
}

export const userService = {
  async getGenderDistribution(): Promise<GenderDistribution> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const users: UsersResponse = await response.json();
      console.log("users", users);
      const totalUsers = users.users.length;
      const maleUsers = users.users.filter(
        (user) => user.gender === "MALE"
      ).length;
      const femaleUsers = users.users.filter(
        (user) => user.gender === "FEMALE"
      ).length;

      return {
        male: Math.round((maleUsers / totalUsers) * 100),
        female: Math.round((femaleUsers / totalUsers) * 100),
      };
    } catch (error) {
      console.error("Error fetching gender distribution:", error);
      return { male: 0, female: 0 };
    }
  },

  async getAdminDashboardStats(): Promise<DashboardStats> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/dashboard/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};
