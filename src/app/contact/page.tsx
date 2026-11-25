import type { Metadata } from "next";
import ContactPage from "@/features/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact | Sempa",
  description: "Contact Sempa for products, projects, technical support and partnerships. Transportation guide to our Konya Integrated Plant.",
};

export default function Page() {
  return <ContactPage />;
}
