import { PublicLayoutShell } from "@/components/PublicLayoutShell";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>;
}
