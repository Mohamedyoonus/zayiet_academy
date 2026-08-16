"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";

const info = [
  { icon: Phone, label: "Call Us", value: "[Add phone number]" },
  { icon: Mail, label: "Email Us", value: "[Add email address]" },
  { icon: Clock, label: "Working Hours", value: "Mon – Sat · 10 AM – 7 PM" },
  { icon: MapPin, label: "Visit Us", value: "Zayith Studio, Bangalore, Karnataka" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-sage-50/40 py-28 dark:bg-ink-950">
      {/* Soft botanical wash - matching all sections */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-sage-200/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-sage-100/70 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-50/30 blur-[140px]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-sage-200/10" />

      <div className="container-academy relative z-10 grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading 
            eyebrow="Contact" 
            title="Come say" 
            highlight="hello" 
            description="Have a question before you enroll? Reach out — we're happy to help you pick the right course." 
          />

          <div className="mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2">
            {info.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-3xl border border-sage-200/40 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-ink-900/60"
              >
                <item.icon className="h-4 sm:h-5 w-4 sm:w-5 text-sage-600 dark:text-sage-400" />
                <div className="mt-2 sm:mt-3 text-xs uppercase tracking-wide text-charcoal-500 dark:text-charcoal-400">{item.label}</div>
                <div className="mt-1 font-display text-base sm:text-lg text-charcoal-900">{item.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <motion.a 
                key={i} 
                href="#" 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="grid h-11 w-11 place-items-center rounded-full border border-sage-200/40 bg-white/60 text-charcoal-600 backdrop-blur-sm transition-all duration-300 hover:border-sage-400 hover:bg-sage-100/50 hover:text-sage-600 dark:border-white/15 dark:bg-ink-900/60   dark:hover:border-sage-400 dark:hover:text-sage-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[320px] sm:min-h-[380px] overflow-hidden rounded-5xl border border-sage-200/40 bg-white/60 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-ink-900/60"
        >
          <iframe
            title="Zayith Academy Location"
            src="https://www.google.com/maps?q=Bangalore,Karnataka&output=embed"
            className="absolute inset-0 h-full w-full grayscale transition-all duration-500 hover:grayscale-0"
            loading="lazy"
          />
          {/* Decorative sage overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-sage-500/5 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}