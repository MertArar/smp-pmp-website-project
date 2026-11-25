import type { Metadata } from "next";
import NewsDetailPage from "@/features/news-detail/newsDetailPage";

export const metadata: Metadata = {
  title: "News | Sempa",
  description: "Sempa Pompa and LS Fire collaborate on NFPA 20-compliant fire protection solutions in Brazil.",
};

export default async function Page({ searchParams }: {
  searchParams: Promise<{ article?: string | string[] }>;
}) {
  const { article } = await searchParams;
  return <NewsDetailPage article={typeof article === "string" ? article : undefined} />;
}
