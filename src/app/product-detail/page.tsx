import type { Metadata } from "next";
import ProductDetailPage from "@/features/product-detail/productDetailPage";

export const metadata: Metadata = {
  title: "ARS / ARS-DD Series Multi Stage Pumps | SEMPA",
  description: "Explore the ARS / ARS-DD multi stage pump series and its product views.",
};

export default function Page() {
  return <ProductDetailPage />;
}
