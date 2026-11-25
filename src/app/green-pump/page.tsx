import type { Metadata } from "next";
import GreenPumpPage from "@/features/green-pump/GreenPumpPage";

export const metadata: Metadata = {
  title: "Green Pump | Sempa",
  description: "Energy-efficient pump technologies, lower operating costs, and a more sustainable future with Sempa Green Pump.",
};

export default function Page() {
  return <GreenPumpPage />;
}
