import HistoryPage from "@/features/history/HistoryPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ year?: string | string[] }>;
}) {
  const { year } = await searchParams;
  const value = typeof year === "string" && /^\d{4}$/.test(year) ? Number(year) : null;
  const initialYear = value !== null && value >= 1900 && value <= 2100 ? value : null;
  return <HistoryPage initialYear={initialYear} />;
}
