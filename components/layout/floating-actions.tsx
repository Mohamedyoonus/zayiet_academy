"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, ArrowUp, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Detect if desktop on mount and window resize
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on desktop (show in footer instead)
  if (isDesktop) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 safe-area-inset-bottom safe-area-inset-right">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid h-12 w-12 place-items-center rounded-full bg-ink-900 text-white shadow-lg transition-colors hover:bg-ink-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href="tel:+910000000000"
        aria-label="Call us"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="grid h-12 w-12 place-items-center rounded-full bg-ink-900 text-white shadow-lg transition-colors hover:bg-ink-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
      >
        <Phone className="h-5 w-5" />
      </motion.a>

      <motion.a
        href="https://wa.me/910000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ["0 0 0 0 rgba(34,197,94,0.5)", "0 0 0 14px rgba(34,197,94,0)"] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#22c050] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
      >
        <MessageCircle className="h-6 w-6" fill="white" />
      </motion.a>
    </div>
  );
}
