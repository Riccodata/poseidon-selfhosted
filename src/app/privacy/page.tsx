import type { Metadata } from "next";
import privacy from "@/content/privacy.json";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" doc={privacy} />;
}
