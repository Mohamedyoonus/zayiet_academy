import { Mail, MessageCircle, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/admin-shared";

const chip =
  "inline-flex max-w-full items-center gap-1.5 rounded-full border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-700 transition-colors hover:border-sage-500 hover:text-sage-700";

/** One-tap call, WhatsApp and email buttons */
export default function ContactLinks({ mobile, email }: { mobile: string; email: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`tel:${mobile.replace(/[^\d+]/g, "")}`} className={chip}>
        <Phone className="h-3.5 w-3.5 shrink-0" /> {mobile}
      </a>
      <a href={whatsappLink(mobile)} target="_blank" rel="noreferrer" className={`${chip} text-emerald-700`}>
        <MessageCircle className="h-3.5 w-3.5 shrink-0" /> WhatsApp
      </a>
      <a href={`mailto:${email}`} className={chip}>
        <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{email}</span>
      </a>
    </div>
  );
}
