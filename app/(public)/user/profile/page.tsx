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
  Edit3,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  X,
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

function ReadOnlyField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-stone-500">{label}</Label>
      <div className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-stone-900 shadow-sm">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-stone-400">
          {icon}
        </span>
        <span className="min-w-0 break-words">{value || "Not provided yet"}</span>
      </div>
    </div>
  );
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
      if (!user) {
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

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
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load profile";
      toast.error(errorMessage);
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    loadUserProfile();
    setIsEditing(false);
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const profileName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Carpathians Member";
  const initials = `${profile.firstName?.[0] || "C"}${profile.lastName?.[0] || "M"}`;
  const completionItems = [
    profile.firstName,
    profile.lastName,
    profile.phone,
    profile.address,
    profile.city,
    profile.country,
  ].filter(Boolean).length;
  const completion = Math.round((completionItems / 6) * 100);

  if (isLoading && !isEditing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#d9d6d1]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-stone-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d9d6d1] px-4 py-32 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.72),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.58),_transparent_28%)]" />
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <Card className="rounded-[32px] border border-white/60 bg-[#f7f4ef]/92 py-0 shadow-[0_24px_80px_rgba(70,61,50,0.12)] backdrop-blur">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#d7c6b3] text-2xl font-semibold text-stone-900 shadow-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
                        Personal space
                      </p>
                      <h1 className="mt-2 break-words text-3xl font-medium tracking-tight text-stone-950">
                        {profileName}
                      </h1>
                      <p className="mt-2 text-sm leading-6 text-stone-500">
                        Keep delivery details, contact info and account basics
                        in one calm place.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 shrink-0 rounded-full bg-white text-stone-700 shadow-sm hover:bg-stone-100"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>

                <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        Profile completeness
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        A fuller profile makes checkout and support feel much
                        smoother.
                      </p>
                    </div>
                    <div className="shrink-0 rounded-full bg-[#f3eee7] px-4 py-2 text-sm font-medium text-stone-800">
                      {completion}%
                    </div>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-stone-100">
                    <div
                      className="h-3 rounded-full bg-stone-900 transition-all duration-300"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3eee7] text-stone-700">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">
                          Primary email
                        </p>
                        <p className="break-words text-sm text-stone-500">
                          {profile.email || "Not provided yet"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3eee7] text-stone-700">
                        <ShieldCheck className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-900">
                          Account status
                        </p>
                        <p className="text-sm text-stone-500">
                          Active and ready for orders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3eee7] text-stone-700">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900">
                        Thoughtful details matter here
                      </p>
                      <p className="mt-1 text-sm leading-6 text-stone-500">
                        Keep your phone, city and address current so delivery
                        coordination and custom order follow-ups stay easy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border border-white/60 bg-[#f7f4ef]/92 py-0 shadow-[0_24px_80px_rgba(70,61,50,0.12)] backdrop-blur">
            <CardHeader className="border-b border-stone-200/70 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-3xl font-medium tracking-tight text-stone-950">
                    Profile details
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                    Update the essentials that shape your account, delivery
                    details and communication preferences.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-3">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        className="h-12 rounded-full border-stone-300 bg-white px-5 text-stone-800 hover:bg-stone-100"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        className="h-12 rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"
                        onClick={handleSave}
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4" />
                        Save changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="h-12 rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-6 py-6 sm:px-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-stone-900">
                    <User className="h-5 w-5 shrink-0" />
                    <span className="min-w-0">Personal information</span>
                  </div>

                  {isEditing ? (
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-stone-500">
                          First name
                        </Label>
                        <Input
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Enter first name"
                          className="h-12 rounded-2xl border-stone-200 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-stone-500">
                          Last name
                        </Label>
                        <Input
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Enter last name"
                          className="h-12 rounded-2xl border-stone-200 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <ReadOnlyField
                        icon={<User className="h-4 w-4" />}
                        label="First name"
                        value={profile.firstName}
                      />
                      <ReadOnlyField
                        icon={<User className="h-4 w-4" />}
                        label="Last name"
                        value={profile.lastName}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-stone-900">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span className="min-w-0">Contact information</span>
                  </div>

                  <div className="grid gap-4">
                    <ReadOnlyField
                      icon={<Mail className="h-4 w-4" />}
                      label="Email address"
                      value={profile.email}
                    />

                    {isEditing ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-stone-500">
                          Phone number
                        </Label>
                        <PhoneInput
                          value={profile.phone}
                          onChange={(value) =>
                            setProfile({ ...profile, phone: value })
                          }
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <ReadOnlyField
                        icon={<Phone className="h-4 w-4" />}
                        label="Phone number"
                        value={profile.phone}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-stone-900">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <span className="min-w-0">Security</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-stone-500">
                      Password
                    </Label>
                    <div className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-stone-900 shadow-sm">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-stone-400">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 break-words">
                          {showPassword ? "Password hidden" : profile.password}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="shrink-0 text-stone-400 transition-colors hover:text-stone-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium text-stone-900">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span className="min-w-0">Address</span>
                  </div>

                  {isEditing ? (
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-stone-500">
                          Street address
                        </Label>
                        <Input
                          value={profile.address}
                          onChange={(e) =>
                            setProfile({ ...profile, address: e.target.value })
                          }
                          placeholder="Enter address"
                          className="h-12 rounded-2xl border-stone-200 bg-white"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-500">
                            City
                          </Label>
                          <Input
                            value={profile.city}
                            onChange={(e) =>
                              setProfile({ ...profile, city: e.target.value })
                            }
                            placeholder="City"
                            className="h-12 rounded-2xl border-stone-200 bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-stone-500">
                            Postal code
                          </Label>
                          <Input
                            value={profile.postalCode}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                postalCode: e.target.value,
                              })
                            }
                            placeholder="Postal code"
                            className="h-12 rounded-2xl border-stone-200 bg-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-stone-500">
                          Country
                        </Label>
                        <Input
                          value={profile.country}
                          onChange={(e) =>
                            setProfile({ ...profile, country: e.target.value })
                          }
                          placeholder="Country"
                          className="h-12 rounded-2xl border-stone-200 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <ReadOnlyField
                        icon={<MapPin className="h-4 w-4" />}
                        label="Street address"
                        value={profile.address}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <ReadOnlyField
                          icon={<MapPin className="h-4 w-4" />}
                          label="City"
                          value={profile.city}
                        />
                        <ReadOnlyField
                          icon={<MapPin className="h-4 w-4" />}
                          label="Postal code"
                          value={profile.postalCode}
                        />
                      </div>
                      <ReadOnlyField
                        icon={<MapPin className="h-4 w-4" />}
                        label="Country"
                        value={profile.country}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
