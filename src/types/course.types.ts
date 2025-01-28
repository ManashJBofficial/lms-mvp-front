export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  instructors: Instructor[];
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
}
