import { Hero } from "@/components/Hero";
import { ProductsList } from "@/components/ProductsList";
import { FooterSection } from "@/components/FooterSection";

export default function HomePage() {
  return (
    <>
      <div className="bg-[#FAFAFA] h-screen">
        <Hero />
        <ProductsList />
        <FooterSection />
      </div>
    </>
  );
}
