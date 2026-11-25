import type { Metadata } from "next";
import BlogPage from "@/features/blog/blogPage";

export const metadata: Metadata = {
  title: "Blog | Sempa",
  description: "Engineering tips and technical guides from Sempa: discover everything about flow.",
};

export default function Page() {
  return <BlogPage />;
}
