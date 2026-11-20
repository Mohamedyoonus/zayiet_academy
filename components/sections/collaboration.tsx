"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, School, Users, Building, Palette, Sparkles, Calendar } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/use-i18n";

const collaborationOptions = [
  { title: "School art programmes", icon: School, desc: "Curriculum-aligned workshops and art immersion days." },
  { title: "Community art workshops", icon: Users, desc: "Interactive, hands-on group sessions for all skill levels." },
  { title: "Apartment and residential events", icon: Building, desc: "Weekend art camps & creative gatherings for residents." },
  { title: "Collaborative murals and public art", icon: Palette, desc: "Large-scale community wall art and collective pieces." },
  { title: "Custom creative projects", icon: Sparkles, desc: "Bespoke artistic engagements tailored to your vision." },
];

export default function Collaboration() {
  const t = useT().collaboration;
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="collaboration" className="relative overflow-hidden bg-gradient-to-br from-charcoal-950 via-sage-900 to-charcoal-950 py-20 sm:py-24 lg:py-28 text-white">
      {/* Soft botanical wash - matching all sections with dark theme */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-400/15 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-moss-500/10 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-sage-500/5" />

      <div className="container-academy relative grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={t.eyebrow}
            title={t.title}
            highlight={t.highlight}
            description={t.description}
            light
          />

          {/* Collaboration Options */}
          <div className="mt-8 space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-sage-300">
              {t.optionsTitle}
            </h4>
            <div className="space-y-2.5">
              {collaborationOptions.map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <motion.div
                    key={opt.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-sage-400/40 hover:bg-white/10"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sage-500/20 text-sage-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-medium text-xs sm:text-sm text-white">{opt.title}</h5>
                      <p className="text-[11px] text-white/50">{opt.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-5xl border border-sage-500/20 bg-white/5 p-6 sm:p-8 lg:p-9 backdrop-blur-xl shadow-2xl shadow-sage-500/5"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <CheckCircle2 className="h-12 sm:h-14 w-12 sm:w-14 text-sage-400" />
              <h3 className="mt-3 sm:mt-4 font-display text-xl sm:text-2xl">{t.thanks}</h3>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/60">{t.thanksText}</p>
            </div>
          ) : (
            <form
              className="space-y-4 sm:space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <h3 className="font-display text-xl sm:text-2xl text-white">Collaborate With Us</h3>
              <p className="text-xs text-white/60">Share details about your community, school, or project below.</p>

              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <Field label={t.name} placeholder={t.namePlaceholder} />
                <Field label={t.organisation} placeholder={t.organisationPlaceholder} />
              </div>

              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <Field label={t.email} type="email" placeholder="you@email.com" />
                <Field label={t.mobile} type="tel" placeholder="+91 00000 00000" />
              </div>

              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-medium text-white/70">{t.collaborationType}</label>
                  <select
                    required
                    defaultValue=""
                    className="w-full rounded-2xl border border-sage-500/20 bg-charcoal-900 px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm text-white focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50"
                  >
                    <option value="" disabled className="bg-charcoal-900 text-white/40">Select collaboration type</option>
                    <option value="school" className="bg-charcoal-900 text-white">School art programmes</option>
                    <option value="community" className="bg-charcoal-900 text-white">Community art workshops</option>
                    <option value="apartment" className="bg-charcoal-900 text-white">Apartment and residential events</option>
                    <option value="murals" className="bg-charcoal-900 text-white">Collaborative murals and public art</option>
                    <option value="custom" className="bg-charcoal-900 text-white">Custom creative projects</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs sm:text-sm font-medium text-white/70">{t.preferredDate}</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-2xl border border-sage-500/20 bg-white/5 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder:text-white/30 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs sm:text-sm font-medium text-white/70">{t.message}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  className="w-full rounded-2xl border border-sage-500/20 bg-white/5 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-white placeholder:text-white/30 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50"
                />
              </div>

              <Button type="submit" size="lg" className="w-full justify-center h-11 sm:h-12 bg-sage-500 hover:bg-sage-600 dark:bg-sage-500 dark:hover:bg-sage-600">
                {t.send} <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs sm:text-sm font-medium text-white/70">{label}</label>
      <input
        required
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-sage-500/20 bg-white/5 px-4 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm text-white placeholder:text-white/30 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50"
      />
    </div>
  );
}
