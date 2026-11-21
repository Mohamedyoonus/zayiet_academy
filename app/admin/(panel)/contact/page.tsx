import type { Metadata } from "next";
import { getAdminClient } from "@/lib/admin";
import type { ContactContent } from "@/lib/content";
import { withSaved } from "@/lib/with-saved";
import en from "@/lib/i18n/dictionaries/en";
import { PageHeader } from "@/components/admin/ui";
import ContactForm from "@/components/admin/contact-form";

export const metadata: Metadata = { title: "Contact details" };

// "[Add phone number]"-style placeholders start empty in the form
const unlessPlaceholder = (value: string) => (value.startsWith("[") ? "" : value);

const DEFAULT_CONTACT: ContactContent = {
  eyebrow: en.contact.eyebrow,
  title: en.contact.title,
  highlight: en.contact.highlight,
  description: en.contact.description,
  phoneValue: unlessPlaceholder(en.contact.phoneValue),
  whatsapp: "",
  emailValue: unlessPlaceholder(en.contact.emailValue),
  hoursValue: en.contact.hoursValue,
  addressValue: en.contact.addressValue,
  mapQuery: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

export default async function ContactAdminPage() {
  const supabase = await getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from("site_content").select("data").eq("key", "contact").maybeSingle();

  return (
    <>
      <PageHeader title="Contact details" description="Phone, WhatsApp, email, address, map and social links — used across the whole website." />
      <ContactForm initial={withSaved(DEFAULT_CONTACT, data?.data as Partial<ContactContent> | undefined)} />
    </>
  );
}
