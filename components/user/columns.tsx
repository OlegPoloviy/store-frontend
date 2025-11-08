"use client";

import { ColumnDef } from "@tanstack/react-table";
import { userTable } from "@/types/user.type";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "postalCode",
    header: "Postal Code",
  },
  {
    accessorKey: "country",
    header: "Country",
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
