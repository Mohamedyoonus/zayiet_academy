"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { Send, School, Users, Building, Palette, Sparkles } from "lucide-react";
import Dots from "@/components/ui/dots";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/use-i18n";
import { collaborationTypes } from "@/lib/data";
import { submitEnquiry } from "@/lib/submissions";
import { useToast } from "@/components/admin/toast";

const collaborationOptions = [
  { title: "School art programmes", icon: School, desc: "Curriculum-aligned workshops and art immersion days." },
  { title: "Community art workshops", icon: Users, desc: "Interactive, hands-on group sessions for all skill levels." },
  { title: "Apartment and residential events", icon: Building, desc: "Weekend art camps & creative gatherings for residents." },
  { title: "Collaborative murals and public art", icon: Palette, desc: "Large-scale community wall art and collective pieces." },
  { title: "Custom creative projects", icon: Sparkles, desc: "Bespoke artistic engagements tailored to your vision." },
];

const fieldClass =
  "w-full rounded-xl border border-sage-500/20 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50";
const labelClass = "mb-1.5 block text-xs font-medium text-white/70 sm:text-[13px]";

// Compact layout: heading, options and the whole form fit on one screen on desktop
export default function Collaboration() {
  const dictionary = useT();
  const t = dictionary.collaboration;
  // After sending, the form stays in place (cleared) and a snackbar says thank you
  const [sending, startSending] = useTransition();
  const toast = useToast();

  return (
    <section
      id="collaboration"
      className="relative overflow-hidden bg-gradient-to-br from-charcoal-950 via-sage-900 to-charcoal-950 pb-14 pt-24 text-white lg:pb-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_26rem_at_5%_15%,rgb(var(--c-sage-500)/0.22),transparent_70%),radial-gradient(34rem_24rem_at_95%_95%,rgb(var(--c-sage-400)/0.16),transparent_70%)]"
      />

      <div className="container-academy relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        {/* Heading + what we offer */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow text-sage-200"
          >
            <span className="h-1 w-1 rounded-full bg-sage-200" />
            {t.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-3 text-balance font-display text-[clamp(2.1rem,1.4rem+2.2vw,3.25rem)] font-medium leading-[1.05] tracking-tight text-cream"
          >
            {t.title} <span className="italic text-sage-300">{t.highlight}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 max-w-xl text-sm leading-relaxed text-cream/70 xl:text-[15px]"
          >
            {t.description}
          </motion.p>

          <h2 className="mt-5 text-xs font-semibold uppercase tracking-wider text-sage-300">{t.optionsTitle}</h2>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {collaborationOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={opt.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 transition-colors duration-300 hover:border-sage-400/40 hover:bg-white/10 sm:last:col-span-2"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sage-500/20 text-sage-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-medium leading-snug text-white">{opt.title}</h3>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-white/55">{opt.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enquiry form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-[1.75rem] border border-sage-500/20 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
        >
            <form
              className="space-y-3.5"
              onSubmit={(e) => {
                e.preventDefault();
                const formElement = e.currentTarget;
                const form = new FormData(formElement);
                startSending(async () => {
                  const { ok } = await submitEnquiry(form);
                  if (!ok) return toast.error(dictionary.common.submitError);
                  formElement.reset();
                  toast.success(`${t.thanks} ${t.thanksText}`);
                });
              }}
            >
              <div>
                <h3 className="font-display text-xl text-white sm:text-2xl">Collaborate With Us</h3>
                <p className="mt-0.5 text-xs text-white/60">Share details about your community, school, or project below.</p>
              </div>
              {/* Left empty by people; bots that fill it in are ignored */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field name="name" label={t.name} placeholder={t.namePlaceholder} />
                <Field name="organisation" label={t.organisation} placeholder={t.organisationPlaceholder} required={false} />
                <Field name="email" label={t.email} type="email" placeholder="you@email.com" />
                <Field name="mobile" label={t.mobile} type="tel" placeholder="+91 00000 00000" />
                <div>
                  <label className={labelClass}>{t.collaborationType}</label>
                  <select name="collaborationType" required defaultValue="" className={`${fieldClass} bg-charcoal-900`}>
                    <option value="" disabled className="bg-charcoal-900 text-white/40">
                      Select collaboration type
                    </option>
                    {collaborationTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-charcoal-900 text-white">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t.preferredDate}</label>
                  <input name="preferredDate" type="date" required className={`${fieldClass} [color-scheme:dark]`} />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t.message}</label>
                <textarea name="message" required maxLength={2000} rows={3} placeholder={t.messagePlaceholder} className={fieldClass} />
              </div>

              <Button
                type="submit"
                size="md"
                disabled={sending}
                className="h-11 w-full justify-center bg-sage-500 hover:bg-sage-600 dark:bg-sage-500 dark:hover:bg-sage-600"
              >
                {t.send} {sending ? <Dots label="Sending" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input name={name} required={required} type={type} placeholder={placeholder} className={fieldClass} />
    </div>
  );
}
