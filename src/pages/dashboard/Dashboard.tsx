import AdminDashboard from "@/components/dashboard/AdminDashboard";
import InstructorDashboard from "@/components/dashboard/InstructorDashboard";
import { getRole } from "@/lib/auth";

const Dashboard = () => {
  return (
    <div className="md:pl-[240px] pl-0 transition-[padding] duration-300">
      <div className="p-4 max-w-7xl mx-auto">
        {getRole() === 2 && <AdminDashboard />}
        {getRole() === 3 && <InstructorDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
