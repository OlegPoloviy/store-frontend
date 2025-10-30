"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/PhoneInput";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser, updateUserProfile, signOut } from "@/lib/auth";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function UserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await loadUserProfile();
      console.log(user);
      if (!user) {
        router.push("/");
      }
    };

    checkUser();
  }, []);

  const loadUserProfile = async () => {
    try {
      const user = await getCurrentUser();

      if (user) {
        setProfile({
          firstName: user.user_metadata?.firstName || "",
          lastName: user.user_metadata?.lastName || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          password: "••••••••",
          address: user.user_metadata?.address || "",
          city: user.user_metadata?.city || "",
          postalCode: user.user_metadata?.postalCode || "",
          country: user.user_metadata?.country || "",
        });
      }

      return user;
    } catch (error) {
      toast.error("Failed to load profile");
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      await updateUserProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        postalCode: profile.postalCode,
        country: profile.country,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    loadUserProfile();
    setIsEditing(false);
  };

  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen pt-[5%] bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <User className="w-6 h-6 mr-2" />
              User Profile
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage your personal information
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                      {profile.firstName || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                      {profile.lastName || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-md border text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {profile.email || "Not provided"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <PhoneInput
                      value={profile.phone}
                      onChange={(value) =>
                        setProfile({ ...profile, phone: value })
                      }
                      className="w-full"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {profile.phone || "Not provided"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Security
              </h3>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="p-3 bg-gray-50 rounded-md border text-gray-900 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="flex-1">
                    {showPassword ? "••••••••" : "••••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Password cannot be changed from this page
                </p>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Street Address
                  </Label>
                  {isEditing ? (
                    <Input
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      placeholder="Enter street address"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                      {profile.address || "Not provided"}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profile.city}
                        onChange={(e) =>
                          setProfile({ ...profile, city: e.target.value })
                        }
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                        {profile.city || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Postal Code
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profile.postalCode}
                        onChange={(e) =>
                          setProfile({ ...profile, postalCode: e.target.value })
                        }
                        placeholder="Enter postal code"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                        {profile.postalCode || "Not provided"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profile.country}
                        onChange={(e) =>
                          setProfile({ ...profile, country: e.target.value })
                        }
                        placeholder="Enter country"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md border text-gray-900">
                        {profile.country || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-3 pt-6 border-t">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center bg-gray-900 hover:bg-gray-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-gray-900 hover:bg-gray-800"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
              <Button
                className="bg-gray-900 hover:bg-gray-800"
                onClick={() => handleSignOut()}
              >
                <LogOut />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
