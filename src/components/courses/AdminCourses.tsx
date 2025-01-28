import { Course } from "@/types/course.types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import {
  useGetCourses,
  useCreateCourse,
  useUpdateCourse,
} from "@/services/courses.services";
import { useToast } from "@/hooks/use-toast";
import CourseDialog from "./AddEditCourseDialog";

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { getCourses } = useGetCourses();
  const { createCourse } = useCreateCourse();
  const { updateCourse } = useUpdateCourse();
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      console.log(data);
      const transformedCourses = data.courses
        .map((course: any) => ({
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
        }))
        .sort(
          (a: Course, b: Course) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setCourses(transformedCourses);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error fetching courses",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setName("");
    setDescription("");
    setEditingCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, { name, description });
        toast({
          title: "Course updated successfully",
          variant: "default",
        });
      } else {
        await createCourse({ name, description });
        toast({
          title: "Course created successfully",
          variant: "default",
        });
      }
      handleModalClose();
      fetchCourses();
    } catch (error: any) {
      toast({
        title: `Error ${editingCourse ? "updating" : "creating"} course`,
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setName(course.title);
    setDescription(course.description);
    setOpen(true);
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  useEffect(() => {
    console.log("Dialog open state:", open);
  }, [open]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses Management</h1>
        <CourseDialog
          open={open}
          setOpen={setOpen}
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          mode={editingCourse ? "edit" : "create"}
        />
      </div>

      <DataTable
        columns={columns(fetchCourses, handleEditCourse)}
        data={courses}
      />
    </div>
  );
};

export default AdminCourses;
