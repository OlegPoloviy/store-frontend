"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { userApi } from "@/api/users.api";
import { DataTable } from "@/components/user/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createColumns } from "@/components/user/columns";
import { UserCreationChart } from "@/components/user/UserCreationChart";
import { type userTable } from "@/types/user.type";
import { productsApi } from "@/api/productApi";
import { ProductCreationChart } from "@/components/products/ProductCreationChart";
import { type Product } from "@/types/product.type";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase.client";
import { User } from "@/types/user.type";

export default function DashboardPage() {
  const [users, setUsers] = useState<userTable[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getAll();
      const usersData = Array.isArray(response)
        ? response
        : response?.data || [];

      const transformedUsers = usersData.map((user: User) => ({
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
      }));

      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchProducts();

    // Get current user ID and email
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      setCurrentUserEmail(user?.email || null);
    };

    getCurrentUser();
  }, [fetchUsers, fetchProducts]);

  const handleDelete = useCallback(
    async (userId: string) => {
      // Prevent self-deletion - check by ID or email
      const userToDelete = users.find((u) => u.id === userId);
      const isSelf =
        (currentUserId && userId === currentUserId) ||
        (currentUserEmail && userToDelete?.email === currentUserEmail);

      if (isSelf) {
        toast.error("You cannot delete your own account");
        return;
      }

      try {
        await userApi.deleteUser(userId);
        toast.success("User deleted successfully");
        // Refresh the users list
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user");
      }
    },
    [fetchUsers, currentUserId, currentUserEmail, users]
  );

  const columns = useMemo(
    () =>
      createColumns({
        onDeleteAction: handleDelete,
        currentUserId,
        currentUserEmail,
      }),
    [handleDelete, currentUserId, currentUserEmail]
  );

  // Calculate unique countries count
  const uniqueCountriesCount = useMemo(() => {
    const countries = new Set(
      users
        .map((user) => user.country)
        .filter((country) => country && country.trim() !== "")
    );
    return countries.size;
  }, [users]);

  // Calculate new users today
  const newUsersToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return users.filter((user) => {
      const userDate = new Date(user.createdAt);
      userDate.setHours(0, 0, 0, 0);
      return userDate.getTime() === today.getTime();
    }).length;
  }, [users]);

  if (loading) {
    return (
      <div className="px-4 py-5 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-5 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:p-6 lg:p-8">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
          Admin Dashboard
        </h2>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4 2xl:grid-cols-4">
        <Card className="min-h-[132px] justify-between rounded-2xl border-stone-200/80 bg-white py-5 shadow-sm">
          <CardHeader className="px-5 pb-0">
            <CardTitle className="text-sm font-medium text-stone-500">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <p className="text-3xl font-bold text-stone-950">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="min-h-[132px] justify-between rounded-2xl border-stone-200/80 bg-white py-5 shadow-sm">
          <CardHeader className="px-5 pb-0">
            <CardTitle className="text-sm font-medium text-stone-500">
              New Users Today
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <p className="text-3xl font-bold text-amber-600">{newUsersToday}</p>
          </CardContent>
        </Card>
        <Card className="min-h-[132px] justify-between rounded-2xl border-stone-200/80 bg-white py-5 shadow-sm">
          <CardHeader className="px-5 pb-0">
            <CardTitle className="text-sm font-medium text-stone-500">
              Unique Countries
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <p className="text-3xl font-bold text-blue-600">
              {uniqueCountriesCount}
            </p>
          </CardContent>
        </Card>
        <Card className="min-h-[132px] justify-between rounded-2xl border-stone-200/80 bg-white py-5 shadow-sm">
          <CardHeader className="px-5 pb-0">
            <CardTitle className="text-sm font-medium text-stone-500">
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5">
            <p className="text-3xl font-bold text-emerald-600">
              {users.filter((u) => u.role === "ADMIN").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="min-w-0">
          <DataTable columns={columns} data={users} />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
          <UserCreationChart users={users} />
          <ProductCreationChart products={products} />
        </div>
      </div>
    </div>
  );
}
