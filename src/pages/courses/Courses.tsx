import AdminCourses from "@/components/courses/AdminCourses";
import InstructorCourses from "@/components/courses/InstructorCourses";

import { getRole } from "@/lib/auth";

const Courses = () => {
  return (
    <div className="md:pl-[240px] pl-0 transition-[padding] duration-300">
      <div className="p-4 max-w-7xl mx-auto">
        {getRole() === 2 && <AdminCourses />}
        {getRole() === 3 && <InstructorCourses />}
      </div>
    </div>
  );
};

export default Courses;
