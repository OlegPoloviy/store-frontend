import { Navbar } from "@/components/Navbar";
import { OpenChatButton } from "@/components/chat/OpenChatButton";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <OpenChatButton />
    </>
  );
}
