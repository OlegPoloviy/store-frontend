"use client";
import {
  Search,
  User,
  ShoppingCart,
  Mountain,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase.client";
import { isAdminByToken } from "@/lib/util/isAdmin";

export function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState<any>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(user);
      setIsAdmin(isAdminByToken(session?.access_token));
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(isAdminByToken(session?.access_token));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed w-full bg-white z-100 border-b border-gray-200">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Mountain className="h-8 w-8 text-gray-700 group-hover:text-gray-600 transition-colors duration-300" />
                <div className="absolute -inset-1 bg-gray-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Carpathians
                </h1>
                <h2 className="text-sm font-semibold text-gray-600 -mt-1">
                  FURNITURE
                </h2>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Handcrafted excellence • Custom designs • Sustainable materials
            </p>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/categories"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/collections"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/custom-orders"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              Custom Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard"
                className="relative text-emerald-700 hover:text-emerald-900 font-medium transition-colors duration-200 group flex items-center space-x-1"
              >
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-800 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Search */}
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused ? "w-64" : "w-48"
              } hidden sm:block`}
            >
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
                />
                <Input
                  type="text"
                  placeholder="Search furniture..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 bg-stone-50 border-stone-200 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Account */}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors duration-200 group"
                onClick={() => router.push("/user/profile")}
              >
                <User
                  size={20}
                  className="text-stone-600 group-hover:text-emerald-700 transition-colors duration-200"
                />
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200 hidden lg:inline">
                  {user.user_metadata?.firstName}
                </span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors duration-200 group"
                onClick={() => router.push("/register")}
              >
                <User
                  size={20}
                  className="text-stone-600 group-hover:text-emerald-700 transition-colors duration-200"
                />
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200 hidden lg:inline">
                  Account
                </span>
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors duration-200 group"
            >
              <div className="relative">
                <ShoppingCart
                  size={20}
                  className="text-stone-600 group-hover:text-emerald-700 transition-colors duration-200"
                />
                {/* Enhanced Badge */}
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                  2
                </span>
              </div>
              <div className="hidden lg:block">
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200">
                  Cart
                </span>
                <div className="text-xs text-stone-500">₦15,240.00</div>
              </div>
            </Button>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2 rounded-lg hover:bg-stone-50 transition-colors duration-200"
                  onClick={() => router.push("/register")}
                >
                  <Menu size={24} className="text-stone-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Menu
                    </h2>
                    <div className="space-y-4 border-t border-stone-200 pt-4">
                      <Link href="/shop">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >
                          Shop
                        </Button>
                      </Link>
                      <Link href="/collections">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >
                          Collections
                        </Button>
                      </Link>
                      <Link href="/custom-orders">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >
                          Custom Orders
                        </Button>
                      </Link>
                      <Link href="/about">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >
                          About
                        </Button>
                      </Link>
                      {isAdmin && (
                        <Link href="/dashboard">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left px-4 py-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors duration-200 font-medium flex items-center"
                          >
                            <LayoutDashboard size={20} className="mr-2" />
                            Admin Dashboard
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Mobile Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
                      />
                      <Input
                        type="text"
                        placeholder="Search furniture..."
                        className="pl-10 bg-stone-50 border-stone-200 focus:ring-emerald-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Mobile Account & Cart */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <User size={20} className="mr-2 text-stone-600" />
                      Account
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <ShoppingCart size={20} className="mr-2 text-stone-600" />
                      Cart (2) - ₦15,240.00
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search (visible when menu is closed) */}
        <div className="sm:hidden pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <Input
              type="text"
              placeholder="Search furniture..."
              className="pl-10 bg-stone-50 border-stone-200 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
