import type { Metadata } from "next";
import BlogDetailPage from "@/features/blog-detail/blogDetailPage";

export const metadata: Metadata = {
  title: "Corrosion-Resistant Pump Materials and Applications | Sempa",
  description: "Explore corrosion-resistant pump materials, industrial applications, and methods to extend pump service life.",
};

export default function Page() {
  return <BlogDetailPage />;
}
