import type { Metadata } from "next";
import QualityPage from "@/features/quality/qualityPage";

export const metadata: Metadata = {
  title: "Quality | Sempa",
  description: "Quality management certifications and independently audited standards from design to dispatch.",
};

export default function Page() {
  return <QualityPage />;
}
