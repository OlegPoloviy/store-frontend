import { AdminNavbar } from "@/components/AdminNavbar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminNavbar />
      <div className="pt-[4%]">{children}</div>
      <Toaster />
    </>
  );
}
