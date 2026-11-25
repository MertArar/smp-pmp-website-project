import type { Metadata } from "next";
import NewsPage from "@/features/news/newsPage";

export const metadata: Metadata = {
  title: "News | Sempa",
  description: "Sempa’dan fuarlar, lansmanlar ve güncel haberler.",
};

export default function Page() {
  return <NewsPage />;
}
