import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schema/auth.schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import type { LoginFormData } from "@/types/auth.types";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/services/auth.services";

const LoginForm = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  let navigate = useNavigate();
  const { login, error, loading } = useLogin();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      console.log("response", response);
      if (response?.status == 200) {
        toast({
          title: "Successfully logged in",
          description: "",
          variant: "default",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Login failed",
        variant: "destructive",
      });
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  useEffect(() => {
    if (error) {
      toast({
        title: error || "Login Error",
        description: "Please try again later!",
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 sha">
        <CardHeader className="text-center">
          <img
            width={100}
            height={100}
            src={"/images/learnhill.jpg"}
            alt="Logo"
            className="mx-auto mb-4 w-16 h-16"
          />
          <CardTitle>LearnHill LMS</CardTitle>
          <p className="text-sm text-gray-600">Welcome back!</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="mail@website.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative ">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="mt-1 block w-full shadow-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {showNewPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white shadow-sm"
              disabled={loading}
            >
              {loading ? "Signing you in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-[#22c55e] hover:underline">
                Register
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
