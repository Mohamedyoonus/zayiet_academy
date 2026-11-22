"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Send, School, Users, Building, Palette, Sparkles } from "lucide-react";
import Dots from "@/components/ui/dots";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/use-i18n";
import { collaborationTypes } from "@/lib/data";
import { submitEnquiry } from "@/lib/submissions";
import { useToast } from "@/components/admin/toast";
import FieldError from "@/components/ui/field-error";
import { useFieldErrors } from "@/hooks/use-field-errors";
import { isoDate, validateEnquiry } from "@/lib/validation";
import { cn } from "@/lib/utils";

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
/** A field that needs fixing */
const invalidClass = "border-red-400/80 focus:border-red-400 focus:ring-red-400/50";

const enquiryTypes = collaborationTypes.map((c) => c.value);

// Compact layout: heading, options and the whole form fit on one screen on desktop
export default function Collaboration() {
  const dictionary = useT();
  const t = dictionary.collaboration;
  // After sending, the form stays in place (cleared) and a snackbar says thank you
  const [sending, startSending] = useTransition();
  const toast = useToast();
  // The date picker starts at today; set after loading so the server and browser agree
  const [today, setToday] = useState<string>();
  useEffect(() => setToday(isoDate()), []);
  const check = useFieldErrors("collab", (values) =>
    validateEnquiry(values, { types: enquiryTypes, earliestDate: isoDate() })
  );

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
              {...check.formEvents}
              onSubmit={(e) => {
                e.preventDefault();
                const formElement = e.currentTarget;
                // Point at what needs fixing before sending anything
                if (!check.checkAll(formElement)) return toast.error(dictionary.validation.fixFields);
                const form = new FormData(formElement);
                startSending(async () => {
                  const { ok, errors } = await submitEnquiry(form);
                  if (errors) {
                    check.show(formElement, errors);
                    return toast.error(dictionary.validation.fixFields);
                  }
                  if (!ok) return toast.error(dictionary.common.submitError);
                  formElement.reset();
                  check.clear();
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
                <Field check={check} name="name" label={t.name} placeholder={t.namePlaceholder} autoComplete="name" />
                <Field check={check} name="organisation" label={t.organisation} placeholder={t.organisationPlaceholder} autoComplete="organization" required={false} />
                <Field check={check} name="email" label={t.email} type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" />
                <Field check={check} name="mobile" label={t.mobile} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" />
                <div>
                  <label htmlFor="collab-collaborationType" className={labelClass}>{t.collaborationType}</label>
                  <select
                    id="collab-collaborationType"
                    name="collaborationType"
                    required
                    defaultValue=""
                    {...check.fieldProps("collaborationType")}
                    className={cn(fieldClass, "bg-charcoal-900", check.errors.collaborationType && invalidClass)}
                  >
                    <option value="" disabled className="bg-charcoal-900 text-white/40">
                      Select collaboration type
                    </option>
                    {collaborationTypes.map((type) => (
                      <option key={type.value} value={type.value} className="bg-charcoal-900 text-white">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <FieldError dark id={check.messageId("collaborationType")} code={check.errors.collaborationType} />
                </div>
                <div>
                  <label htmlFor="collab-preferredDate" className={labelClass}>{t.preferredDate}</label>
                  <input
                    id="collab-preferredDate"
                    name="preferredDate"
                    type="date"
                    required
                    min={today}
                    {...check.fieldProps("preferredDate")}
                    className={cn(fieldClass, "[color-scheme:dark]", check.errors.preferredDate && invalidClass)}
                  />
                  <FieldError dark id={check.messageId("preferredDate")} code={check.errors.preferredDate} />
                </div>
              </div>

              <div>
                <label htmlFor="collab-message" className={labelClass}>{t.message}</label>
                <textarea
                  id="collab-message"
                  name="message"
                  required
                  maxLength={2000}
                  rows={3}
                  placeholder={t.messagePlaceholder}
                  {...check.fieldProps("message")}
                  className={cn(fieldClass, check.errors.message && invalidClass)}
                />
                <FieldError dark id={check.messageId("message")} code={check.errors.message} />
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
  check,
  name,
  label,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  required = true,
}: {
  check: ReturnType<typeof useFieldErrors>;
  name: string;
  label: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`collab-${name}`} className={labelClass}>{label}</label>
      <input
        id={`collab-${name}`}
        name={name}
        required={required}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...check.fieldProps(name)}
        className={cn(fieldClass, check.errors[name] && invalidClass)}
      />
      <FieldError dark id={check.messageId(name)} code={check.errors[name]} />
    </div>
  );
}
