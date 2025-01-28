import { LoginFormData, RegisterFormData } from "@/types/auth.types";
import { useState } from "react";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", response.data.token);
        return { status: response?.status, data: response.data };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, error, loading };
};

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const register = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/auth/register`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
console.log("response",response)
      if (response.data) {
        return { status: response?.status, data: response.data };
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { register, error, loading };
};
