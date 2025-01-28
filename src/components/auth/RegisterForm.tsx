import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schema/auth.schema";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useRegister } from "@/services/auth.services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { RegisterFormData } from "@/types/auth.types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  let navigate = useNavigate();
  const { register, error, loading } = useRegister();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      gender: undefined,
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await register({
        name: data.name,
        gender: data.gender,
        email: data.email,
        password: data.password,
      });

      if (response?.status === 201) {
        toast({
          title: "Registration successfull!",
          description: "You can login now.",
          variant: "default",
        });
        navigate("/login");
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
        title: error || "Registration Error",
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
            src="/images/learnhill.jpg"
            alt="Logo"
            className="mx-auto mb-4 w-16 h-16"
          />
          <CardTitle>LearnHill LMS</CardTitle>
          <p className="text-sm text-gray-600">Be a part of our community</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      className="mt-1 block w-full shadow-sm"
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <div className="mt-1 block w-full shadow-sm">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="mail@website.com"
                    className="mt-1 block w-full shadow-sm"
                  />
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="mt-1 block w-full shadow-sm"
                    />
                  )}
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
              {loading ? "Signing you up..." : "Sign up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#22c55e] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
