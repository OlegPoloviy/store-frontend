"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { loginSchema } from "@/schemas/login.schema";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase.client";
import { isAdminBySession, isAdminByToken } from "@/lib/util/isAdmin";

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const loginResponse = await loginUser(data);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Failed to verify user authentication");
      }

      const isAdmin = loginResponse.session?.access_token
        ? isAdminByToken(loginResponse.session.access_token)
        : false;

      if (isAdmin) {
        toast.success(`Login successful! Welcome back, ${user.email}`);
        router.replace("/dashboard");
      } else {
        toast.success("Login successful! Welcome back.");
        router.replace("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">
          Sign In
        </CardTitle>
        <CardDescription className="text-gray-600">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 lg:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Password *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-between w-[80%] pl-[20%]">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-medium">
                <FaGoogle />
                Sign in with Google
              </Button>
            </div>

            {/* Registration Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-gray-900 hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
