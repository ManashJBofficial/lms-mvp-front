import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from "@/types/course.types";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ManageInstructorsDialog } from "@/components/courses/ManageInstructorsDialog";
import ConfirmDeleteDialog from "./DeleteInstructorDialog";

export const columns = (
  fetchCourses: () => Promise<void>,
  onEdit: (course: Course) => void
): ColumnDef<Course>[] => [
  {
    accessorKey: "code",
    header: "Course Code",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "instructors",
    header: "Instructors",
    cell: ({ row }) => {
      const instructors = row.original.instructors;
      return (
        <div className="space-y-1">
          {instructors.length > 0
            ? instructors.map((instructor) => (
                <div key={instructor.id} className="text-sm">
                  {instructor.name}
                </div>
              ))
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      const [manageInstructorsOpen, setManageInstructorsOpen] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(course.code)}
              >
                Copy course code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(course)}>
                Edit course
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setManageInstructorsOpen(true)}>
                Manage instructors
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ManageInstructorsDialog
            open={manageInstructorsOpen}
            onOpenChange={setManageInstructorsOpen}
            courseId={course.id}
            currentInstructors={course.instructors}
            onRefreshCourses={fetchCourses}
          />

          <ConfirmDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            courseId={course.id}
            onRefreshCourses={fetchCourses}
          />
        </>
      );
    },
  },
];
