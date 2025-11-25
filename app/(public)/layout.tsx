import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster />
    </>
  );
}
