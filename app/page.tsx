import { Hero } from "@/components/Hero";
import { ProductsList } from "@/components/ProductsList";

export default function HomePage() {
  return (
    <>
      <div className="bg-[#FAFAFA] h-screen">
        <Hero />
        <ProductsList />
      </div>
    </>
  );
}
