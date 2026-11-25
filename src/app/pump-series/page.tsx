import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import PumpSeriesPage from "@/features/pump-series/pumpSeriesPage";

export const metadata: Metadata = {
  title: "Product Series | SEMPA",
  description: "Explore SEMPA pump families and pumping solutions.",
};

export default async function Page() {
  const files = await readdir(
    path.join(process.cwd(), "public/pump-series"),
  ).catch(() => [] as string[]);
  const artwork = Object.fromEntries(
    files
      .filter((file) => /\.(webp|png|jpe?g|avif)$/i.test(file))
      .map((file) => [
        file.replace(/\.[^.]+$/, "").toLowerCase(),
        `/pump-series/${file}`,
      ]),
  );
  return <PumpSeriesPage artwork={artwork} />;
}
