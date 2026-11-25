import type { Metadata } from "next";
import SustainabilityPage from "@/features/sustainability/SustainabilityPage";

export const metadata: Metadata = {
  title: "Sustainability | Sempa",
  description:
    "Clean energy, circular manufacturing and our environmental, social and governance commitments at SEMPA Pump.",
};

export default function Page() {
  return <SustainabilityPage />;
}
