"use client";

import { ColumnDef } from "@tanstack/react-table";
import { userTable } from "@/types/user.type";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, ShieldCheck, Trash2, User } from "lucide-react";

interface ColumnsProps {
  onDeleteAction: (userId: string) => void;
  currentUserId?: string | null;
  currentUserEmail?: string | null;
}

export const createColumns = ({
  onDeleteAction,
  currentUserId,
  currentUserEmail,
}: ColumnsProps): ColumnDef<userTable>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "firstName",
    header: "Member",
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.firstName?.[0] || "U"}${user.lastName?.[0] || "M"}`;
      return (
        <div className="flex min-w-[260px] items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe7dc] text-xs font-semibold text-stone-800">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-medium text-stone-900">
              <User className="h-3.5 w-3.5 shrink-0 text-stone-400" />
              <span className="truncate">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <div className="truncate text-xs text-stone-500">{user.id}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="w-[230px] space-y-1">
          <div className="flex items-center gap-2 text-sm text-stone-900">
            <Mail className="h-3.5 w-3.5 shrink-0 text-stone-400" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="truncate text-xs text-stone-500">
            {user.phone || "No phone"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant="secondary"
          className={
            role === "ADMIN"
              ? "rounded-full bg-stone-900 px-3 py-1 text-white hover:bg-stone-900"
              : "rounded-full bg-[#f3eee7] px-3 py-1 text-stone-700 hover:bg-[#f3eee7]"
          }
        >
          <ShieldCheck className="mr-1 h-3 w-3" />
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => {
      const user = row.original;
      const location = [user.city, user.country].filter(Boolean).join(", ");
      return (
        <div className="w-[210px] space-y-1">
          <div className="flex items-center gap-2 text-sm text-stone-900">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
            <span className="truncate">{location || "No location"}</span>
          </div>
          <div className="truncate text-xs text-stone-500">
            {user.address || "Address not added"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = Boolean(
        (currentUserId && user.id === currentUserId) ||
          (currentUserEmail && user.email === currentUserEmail)
      );

      return (
        <Button
          variant="destructive"
          size="sm"
          disabled={isCurrentUser}
          onClick={() => {
            if (
              window.confirm(
                `Are you sure you want to delete user ${user.firstName} ${user.lastName}?`
              )
            ) {
              onDeleteAction(user.id);
            }
          }}
          title={
            isCurrentUser ? "You cannot delete your own account" : "Delete user"
          }
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];

// Export default columns for backward compatibility
export const columns = createColumns({
  onDeleteAction: () => {},
  currentUserId: null,
  currentUserEmail: null,
});
