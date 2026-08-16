"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Send, CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export default function Collaboration() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="collaboration" className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-sage-950 to-ink-950 py-28 text-white">
      {/* Soft botanical wash - matching all sections with dark theme */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-400/15 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-500/10 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-sage-500/5" />

      <div className="container-academy relative grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Collaboration"
            title="Let's Create"
            highlight="Together"
            description="Bring Zayith Academy to your school, workplace, or community. Tell us what you're planning and our team will reach out."
            light
          />
          <div className="relative mt-10 hidden aspect-square max-w-md overflow-hidden rounded-5xl lg:block">
            <Image
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1000&auto=format&fit=crop"
              alt="Instructor collaborating with students"
              fill
              className="object-cover"
            />
            {/* Sage accent overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-sage-500/20 via-transparent to-transparent" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-5xl border border-sage-500/20 bg-white/5 p-6 sm:p-8 lg:p-10 backdrop-blur-xl shadow-2xl shadow-sage-500/5"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <CheckCircle2 className="h-12 sm:h-14 w-12 sm:w-14 text-sage-400" />
              <h3 className="mt-3 sm:mt-4 font-display text-xl sm:text-2xl">Thank you!</h3>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/60">Our team will reach out to you shortly.</p>
            </div>
          ) : (
            <form
              className="space-y-4 sm:space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <Field label="Name" placeholder="Your full name" />
                <Field label="Email" type="email" placeholder="you@email.com" />
              </div>
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                <Field label="Phone" type="tel" placeholder="+91 00000 00000" />
                <Field label="Purpose" placeholder="Workshop, event, custom art…" />
              </div>
              <div>
                <label className="mb-2 block text-xs sm:text-sm font-medium text-white/70">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us more about what you're planning..."
                  className="w-full rounded-2xl border border-sage-500/20 bg-white/5 px-4 sm:px-5 py-3 sm:py-4 text-sm text-white placeholder:text-white/30 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50"
                />
              </div>
              <Button type="submit" size="lg" className="w-full justify-center h-11 sm:h-12 bg-sage-500 hover:bg-sage-600 dark:bg-sage-500 dark:hover:bg-sage-600">
                Send Message <Send className="h-4 w-4" />
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
        className="w-full rounded-2xl border border-sage-500/20 bg-white/5 px-4 sm:px-5 py-2.5 sm:py-3.5 text-sm text-white placeholder:text-white/30 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400/50"
      />
    </div>
  );
}