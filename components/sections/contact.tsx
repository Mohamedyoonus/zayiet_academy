"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";
import { useT } from "@/hooks/use-i18n";
import { useContent } from "@/hooks/use-content";
import { withSaved } from "@/lib/with-saved";
import { mapEmbedUrl, mapLink, telLink, webLink, whatsappLink } from "@/lib/contact";

export default function Contact() {
  // Details edited in the admin (English only) replace the built-in placeholders
  const t = withSaved(useT().contact, useContent().contact);
  const mapQuery = t.mapQuery || (t.addressValue.startsWith("[") ? "Bangalore, Karnataka" : t.addressValue);

  const info = [
    { icon: Phone, label: t.call, value: t.phoneValue, href: telLink(t.phoneValue) },
    { icon: Mail, label: t.email, value: t.emailValue, href: t.emailValue.includes("@") ? `mailto:${t.emailValue}` : null },
    { icon: Clock, label: t.hours, value: t.hoursValue, href: null },
    { icon: MapPin, label: t.visit, value: t.addressValue, href: t.addressValue.startsWith("[") ? null : mapLink(mapQuery) },
  ];
  const whatsapp = whatsappLink(t.whatsapp || t.phoneValue);
  const socials = [
    { icon: Instagram, label: "Instagram", href: webLink(t.instagram) },
    { icon: Facebook, label: "Facebook", href: webLink(t.facebook) },
    { icon: Youtube, label: "YouTube", href: webLink(t.youtube) },
  ].filter((s) => s.href);

  return (
    <section id="contact" className="relative overflow-hidden bg-sage-50/40 pb-20 pt-28 sm:pb-24 lg:pt-32 dark:bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_28rem_at_5%_10%,rgb(var(--c-sage-200)/0.45),transparent_70%),radial-gradient(34rem_24rem_at_95%_90%,rgb(var(--c-sage-100)/0.8),transparent_70%)]"
      />

      <div className="container-academy relative z-10 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {info.map((item, i) => {
              const body = (
                <>
                  <item.icon className="h-4 w-4 text-sage-600 sm:h-5 sm:w-5 dark:text-sage-400" />
                  <div className="mt-2 text-xs uppercase tracking-wide text-charcoal-500 sm:mt-3 dark:text-charcoal-400">{item.label}</div>
                  <div className="mt-1 whitespace-pre-line break-words font-display text-base text-charcoal-900 sm:text-lg">{item.value}</div>
                </>
              );
              const cardClass =
                "block rounded-3xl border border-sage-200/40 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md sm:p-6 dark:border-white/10 dark:bg-ink-900/60";
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`${cardClass} hover:border-sage-400`}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className={cardClass}>{body}</div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {(whatsapp || socials.length > 0) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#22c050] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                >
                  <MessageCircle className="h-4 w-4" fill="white" /> WhatsApp
                </a>
              )}
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="grid h-11 w-11 place-items-center rounded-full border border-sage-200/40 bg-white/60 text-charcoal-600 backdrop-blur-sm transition-all duration-300 hover:border-sage-400 hover:bg-sage-100/50 hover:text-sage-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 dark:border-white/15 dark:bg-ink-900/60 dark:hover:border-sage-400 dark:hover:text-sage-400"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[320px] overflow-hidden rounded-5xl border border-sage-200/40 bg-white/60 shadow-sm backdrop-blur-sm sm:min-h-[380px] lg:min-h-[460px] dark:border-white/10 dark:bg-ink-900/60"
        >
          <iframe
            title={t.mapTitle}
            src={mapEmbedUrl(mapQuery)}
            className="absolute inset-0 h-full w-full grayscale transition-all duration-500 hover:grayscale-0"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-sage-500/5 via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
