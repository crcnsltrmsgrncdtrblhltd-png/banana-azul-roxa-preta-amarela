import { Suspense } from "react";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { Footer } from "@/components/layout/Footer";
import { WhatsappFloat } from "@/components/layout/WhatsappFloat";
import { MobileNav } from "@/components/layout/MobileNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <HeaderWrapper />
      </Suspense>
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <WhatsappFloat />
      <MobileNav />
    </>
  );
}
