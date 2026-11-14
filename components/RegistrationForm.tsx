"use client";
import { useTranslation } from "react-i18next";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/PhoneInput";
import { Eye, EyeOff, Mail, Lock, User, MapPin, UserCheck } from "lucide-react";
import Link from "next/link";
import { registrationSchema } from "@/schemas/registration.schema";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getDefaultCountry } from "@/lib/util/getDefaultLanguage";
import { registerUser } from "@/lib/auth";

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      console.log(data);
      setIsLoading(true);
      await registerUser(data);

      toast.success(t("Account created! Check your email to confirm."));
      router.push("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">{t("Sign Up")}</CardTitle>
        <CardDescription className="text-gray-600">{t("Fill in your details to get started")}</CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 lg:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2" />{t("Personal Information")}</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium text-gray-700">{t("First Name *")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder={t("Enter your first name")}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium text-gray-700">{t("Last Name *")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder={t("Enter your last name")}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="w-4 h-4 mr-2" />{t("Contact Information")}</h3>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium text-gray-700">{t("Email Address *")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="email"
                            placeholder={t("Enter your email address")}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="absolute top-[95%]  left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium text-gray-700">{t("Phone Number")}</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry={getDefaultCountry()}
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Security */}
            <div className="space-y-3">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="w-4 h-4 mr-2" />{t("Security")}</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium text-gray-700">{t("Password *")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("Create a password")}
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium text-gray-700">{t("Confirm Password *")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("Confirm your password")}
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
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
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-3">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />{t("Address Information")}</h3>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-sm font-medium text-gray-700">{t("Street Address")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="text"
                            placeholder={t("Enter your street address")}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-sm font-medium text-gray-700">{t("City")}</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder={t("City")} {...field} />
                        </FormControl>
                        <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-sm font-medium text-gray-700">{t("Postal Code")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("Postal Code")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="text-sm font-medium text-gray-700">{t("Country")}</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder={t("Country")} {...field} />
                        </FormControl>
                        <FormMessage className="absolute top-full left-0 text-xs text-red-500 mt-1 opacity-100 transition-opacity duration-200" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-4">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-gray-900 hover:underline">{t("Terms of Service")}</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-gray-900 hover:underline">{t("Privacy Policy")}</Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("Creating Account...")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5" />
                  <span>{t("Create Account")}</span>
                </div>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                {t("Already have an account?")}{" "}
                <Link
                  href="/login"
                  className="text-gray-900 hover:underline font-medium"
                >{t("Sign in here")}</Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
