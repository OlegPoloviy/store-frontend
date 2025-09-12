"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FooterSection } from "@/components/FooterSection";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Registration data:", formData);
    setIsLoading(false);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="pt-20">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left side - Registration Form */}
          <div className="flex flex-col justify-center w-full p-6 lg:p-8 xl:p-12">
            <div className="w-full max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Create Your Account
                </h1>
                <p className="text-base lg:text-lg text-gray-600">
                  Join our community and discover premium hand-made furniture
                </p>
              </div>

              {/* Registration Form */}
              <Card className="shadow-lg border-0">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">
                    Sign Up
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Fill in your details to get started
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Personal Information */}
                    <div className="space-y-3">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Personal Information
                      </h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label
                            htmlFor="firstName"
                            className="text-sm font-medium text-gray-700"
                          >
                            First Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="firstName"
                              name="firstName"
                              type="text"
                              placeholder="Enter your first name"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="lastName"
                            className="text-sm font-medium text-gray-700"
                          >
                            Last Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="lastName"
                              name="lastName"
                              type="text"
                              placeholder="Enter your last name"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Information
                      </h3>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Enter your email address"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security */}
                    <div className="space-y-3">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Security
                      </h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                          >
                            Password *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                              className="pl-10 pr-10"
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
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-700"
                          >
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              required
                              className="pl-10 pr-10"
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
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-3">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Address Information
                      </h3>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label
                            htmlFor="address"
                            className="text-sm font-medium text-gray-700"
                          >
                            Street Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="address"
                              name="address"
                              type="text"
                              placeholder="Enter your street address"
                              value={formData.address}
                              onChange={handleInputChange}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <label
                              htmlFor="city"
                              className="text-sm font-medium text-gray-700"
                            >
                              City
                            </label>
                            <Input
                              id="city"
                              name="city"
                              type="text"
                              placeholder="City"
                              value={formData.city}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="postalCode"
                              className="text-sm font-medium text-gray-700"
                            >
                              Postal Code
                            </label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              type="text"
                              placeholder="Postal Code"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="country"
                              className="text-sm font-medium text-gray-700"
                            >
                              Country
                            </label>
                            <Input
                              id="country"
                              name="country"
                              type="text"
                              placeholder="Country"
                              value={formData.country}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-3">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-gray-900 hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-gray-900 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </label>
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
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-5 h-5" />
                          <span>Create Account</span>
                        </div>
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                      <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                          href="/login"
                          className="text-gray-900 hover:underline font-medium"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative hidden lg:block">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/sink.jpg')",
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 via-gray-800/10 to-gray-900/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
