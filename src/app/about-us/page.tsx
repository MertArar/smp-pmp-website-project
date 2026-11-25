import type { Metadata } from "next";
import AboutUsPage from "@/features/about-us/AboutUsPage";

export const metadata: Metadata = {
  title: "About Us | Sempa",
  description: "Over 50 years of reliable pump engineering, integrated manufacturing and global partnerships at Sempa.",
};

export default function Page() {
  return <AboutUsPage />;
}
