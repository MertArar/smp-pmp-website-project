import type { Metadata } from "next";
import FoundryPage from "@/features/foundry/FoundryPage";

export const metadata: Metadata = {
  title: "Foundry | Sempa",
  description: "Engineered castings, integrated manufacturing, material routes and documented quality at the Sempa Konya foundry.",
};

export default function Page() {
  return <FoundryPage />;
}
