"use client";
import {
  LayoutDashboard,
  Heart,
  Menu,
  Mountain,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase.client";
import { isAdminByToken } from "@/lib/util/isAdmin";
import { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
    <nav
      className={`fixed w-full z-[100] transition-all duration-300 ${
        isHomePage
          ? "border-b-0 bg-transparent pt-3 sm:pt-4 lg:pt-5"
          : "border-b border-gray-200 bg-white"
      }`}
    >
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isHomePage ? "max-w-[1760px]" : ""}`}>
        <div
          className={`flex items-center justify-between gap-8 ${
            isHomePage
              ? "min-h-[88px] rounded-[30px] border border-white/60 bg-[#f7f4ef]/92 px-5 py-4 shadow-[0_20px_70px_rgba(70,61,50,0.12)] backdrop-blur md:px-7"
              : "h-20"
          }`}
        >
          {/* Logo Section */}
          <Link href="/" className="min-w-0 shrink-0 group xl:min-w-[260px] min-[1800px]:min-w-[390px]">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Mountain className="h-8 w-8 text-gray-700 group-hover:text-gray-600 transition-colors duration-300" />
                <div
                  className={`absolute -inset-1 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-20 ${
                    isHomePage ? "bg-stone-200" : "bg-gray-100"
                  }`}
                ></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                  Carpathians
                </h1>
                <h2 className="text-sm font-semibold text-gray-600 -mt-1">
                  FURNITURE
                </h2>
              </div>
            </div>
            <p
              className={`hidden min-[1800px]:block text-xs mt-1 ${
                isHomePage ? "text-stone-500" : "text-gray-500"
              }`}
            >
              Handcrafted excellence • Custom designs • Sustainable materials
            </p>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden flex-1 items-center justify-center gap-5 xl:flex 2xl:gap-8">
            <Link
              href="/categories"
              className="relative whitespace-nowrap text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/collections"
              className="relative whitespace-nowrap text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              Collections
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/custom-orders"
              className="relative whitespace-nowrap text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              Custom Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="relative whitespace-nowrap text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAdmin && (
              <Link
                href="/dashboard"
                className="relative flex shrink-0 items-center gap-1 whitespace-nowrap text-emerald-700 hover:text-emerald-900 font-medium transition-colors duration-200 group"
              >
                <LayoutDashboard size={18} />
                <span className="min-[1800px]:hidden">Admin</span>
                <span className="hidden min-[1800px]:inline">Admin Dashboard</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-800 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:ml-3 xl:gap-2 2xl:ml-6 2xl:gap-4">
            {/* Enhanced Search */}
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused ? "w-60" : "w-44"
              } hidden min-[1800px]:block`}
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
                  className={`pl-10 border-stone-200 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm ${
                    isHomePage ? "bg-white" : "bg-stone-50"
                  }`}
                />
              </div>
            </div>

            {/* Account */}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 group ${
                  isHomePage ? "hover:bg-white/80" : "hover:bg-stone-50"
                }`}
                onClick={() => router.push("/user/profile")}
              >
                <User
                  size={20}
                  className="text-stone-600 group-hover:text-emerald-700 transition-colors duration-200"
                />
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200 hidden min-[1800px]:inline">
                  {user.user_metadata?.firstName}
                </span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 group ${
                  isHomePage ? "hover:bg-white/80" : "hover:bg-stone-50"
                }`}
                onClick={() => router.push("/register")}
              >
                <User
                  size={20}
                  className="text-stone-600 group-hover:text-emerald-700 transition-colors duration-200"
                />
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200 hidden min-[1800px]:inline">
                  Account
                </span>
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/cart")}
              className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 group ${
                isHomePage ? "hover:bg-white/80" : "hover:bg-stone-50"
              }`}
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
              <div className="hidden min-[1800px]:block">
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200">
                  Cart
                </span>
                <div className="text-xs text-stone-500">₦15,240.00</div>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 group ${
                isHomePage ? "hover:bg-white/80" : "hover:bg-stone-50"
              }`}
              onClick={() => router.push("/products/favorites")}
            >
              <div className="relative">
                <Heart
                  size={20}
                  className="text-stone-600 group-hover:text-emerald-700 transition-colors duration-200"
                />
              </div>
              <div className="hidden min-[1800px]:block">
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200">
                  Favorites
                </span>
              </div>
            </Button>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`xl:hidden p-2 rounded-lg transition-colors duration-200 ${
                    isHomePage ? "hover:bg-white/80" : "hover:bg-stone-50"
                  }`}
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
        <div className={`sm:hidden ${isHomePage ? "pt-3" : "pb-4"}`}>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <Input
              type="text"
              placeholder="Search furniture..."
              className={`pl-10 border-stone-200 focus:ring-emerald-500 focus:border-transparent text-sm ${
                isHomePage ? "bg-white" : "bg-stone-50"
              }`}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
