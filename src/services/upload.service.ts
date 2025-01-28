import axios from "axios";

export const useUploadService = () => {
  const uploadTeachers = async (file: File) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/courses/upload-teachers`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  return { uploadTeachers };
};
