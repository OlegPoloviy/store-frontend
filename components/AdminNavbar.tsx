"use client";
import { useTranslation } from "react-i18next";
import { Menu, Mountain, Search, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase.client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AdminNavbar() {
  const { t } = useTranslation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed w-full bg-white z-[100] border-b border-gray-200">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-8">
          {/* Logo Section */}
          <Link href="/admin" className="min-w-0 shrink-0 group lg:min-w-[220px] xl:min-w-[280px] min-[1800px]:min-w-[340px]">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Mountain className="h-8 w-8 text-gray-700 group-hover:text-gray-600 transition-colors duration-300" />
                <div className="absolute -inset-1 bg-gray-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{t("Admin")}</h1>
                <h2 className="text-sm font-semibold text-gray-600 -mt-1">{t("Dashboard")}</h2>
              </div>
            </div>
            <p className="hidden text-xs text-gray-500 mt-1 min-[1800px]:block">{t("Manage products, orders, users and more")}</p>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden flex-1 items-center justify-center gap-5 xl:flex xl:gap-6 2xl:gap-10">
            <Link
              href="/dashboard"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >{t("Dashboard")}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/products-managment"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >{t("Products")}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/products-managment/create"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >{t("Create Product")}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/orders"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >{t("Orders")}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/support-chat"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >{t("Support")}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/users"
              className="relative text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group"
            >{t("Users")}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-800 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:ml-3 xl:gap-2 2xl:ml-6 2xl:gap-4">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <ThemeToggle className="hidden sm:inline-flex" />
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
                  placeholder={t("Search furniture...")}
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
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200 hidden min-[1800px]:inline">
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
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200 hidden min-[1800px]:inline">{t("Account")}</span>
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/cart")}
              className="relative flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors duration-200 group"
            >
              <div className="relative">
                <ShoppingCart
                  size={20}
                  className="text-stone-600 group-hover:text-emerald-700 transition-colors duration-200"
                />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                  2
                </span>
              </div>
              <div className="hidden min-[1800px]:block">
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200">{t("Cart")}</span>
                <div className="text-xs text-stone-500">₦15,240.00</div>
              </div>
            </Button>

            {/* Link back to Storefront */}
            <Link href="/" className="hidden xl:block">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors duration-200 group"
              >
                <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors duration-200">{t("View Store")}</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="xl:hidden p-2 rounded-lg hover:bg-stone-50 transition-colors duration-200"
                >
                  <Menu size={24} className="text-stone-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-6">
                  <LanguageSwitcher className="mb-5" fullWidth />
                  <ThemeToggle className="mb-5" fullWidth />
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("Menu")}</h2>
                    <div className="space-y-4 border-t border-stone-200 pt-4">
                      <Link href="/admin">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >{t("Dashboard")}</Button>
                      </Link>
                      <Link href="/admin/products">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >{t("Products")}</Button>
                      </Link>
                      <Link href="/admin/products/new">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >{t("Create Product")}</Button>
                      </Link>
                      <Link href="/admin/orders">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >{t("Orders")}</Button>
                      </Link>
                      <Link href="/support-chat">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >{t("Support")}</Button>
                      </Link>
                      <Link href="/admin/users">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                        >{t("Users")}</Button>
                      </Link>
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
                        placeholder={t("Search furniture...")}
                        className="pl-10 bg-stone-50 border-stone-200 focus:ring-emerald-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Mobile Account */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                    >
                      <User size={20} className="mr-2 text-stone-600" />{t("Account")}</Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                      onClick={() => router.push("/cart")}
                    >
                      <ShoppingCart size={20} className="mr-2 text-stone-600" />
                      {t("Cart")} (2) - ₦15,240.00
                    </Button>
                    <Link href="/">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left px-4 py-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 rounded-lg transition-colors duration-200 font-medium"
                      >{t("View Store")}</Button>
                    </Link>
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
              placeholder={t("Search furniture...")}
              className="pl-10 bg-stone-50 border-stone-200 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
