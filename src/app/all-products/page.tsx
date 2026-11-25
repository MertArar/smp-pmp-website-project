import type { Metadata } from "next";
import AllProductsPage from "@/features/all-products/allProductsPage";

export const metadata: Metadata = {
  title: "All Products | SEMPA",
  description: "Explore SEMPA pump series and find pumping solutions for your application.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ series?: string }> }) {
  const { series } = await searchParams;
  return <AllProductsPage key={series ?? "all"} initialSeries={series} />;
}
