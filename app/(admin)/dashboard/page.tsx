"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { userApi } from "@/api/users.api";
import { DataTable } from "@/components/user/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createColumns } from "@/components/user/columns";
import { UserCreationChart } from "@/components/user/UserCreationChart";
import { type userTable } from "@/types/user.type";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase.client";

export default function DashboardPage() {
  const [users, setUsers] = useState<userTable[]>([]);
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

      const transformedUsers = usersData.map((user: any) => ({
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

  useEffect(() => {
    fetchUsers();

    // Get current user ID and email
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      setCurrentUserEmail(user?.email || null);
    };

    getCurrentUser();
  }, [fetchUsers]);

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
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Users Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{newUsersToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {uniqueCountriesCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              {users.filter((u) => u.role === "ADMIN").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable columns={columns} data={users} />
        </div>
        <div className="lg:col-span-1">
          <UserCreationChart users={users} />
        </div>
      </div>
    </div>
  );
}
