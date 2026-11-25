import type { Metadata } from "next";
import CareerPage from "@/features/career/careerPage";

export const metadata: Metadata = {
  title: "Career | Sempa",
  description: "Explore career opportunities at Sempa and prepare your resume and profile for our Human Resources team.",
};

export default function Page() {
  return <CareerPage />;
}
