import type { Metadata } from "next";
import terms from "@/content/terms.json";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return <LegalPage title="Terms of service" doc={terms} />;
}
