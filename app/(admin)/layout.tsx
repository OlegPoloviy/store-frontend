import { AdminNavbar } from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-[#fbfaf8] pt-20">{children}</main>
    </>
  );
}
