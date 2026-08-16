"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "unset";
    };
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-[#FDFBF5] shadow-sm" : "bg-[#FDFBF5]"
      )}
    >
      <div className="container-academy flex h-[76px] items-center justify-between px-4 sm:px-6">
        
        {/* --- LOGO & COMPANY NAME SECTION --- */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Logo Image */}
          <Image 
            src="/assets/logo.jpeg" 
            alt="Zayit Academy Logo"
            width={50}  
            height={50}
            priority
            className="object-contain h-[40px] sm:h-[45px] w-auto"
          />
          
          {/* Company Text - NOW VISIBLE ON MOBILE TOO */}
          <div className="flex flex-col leading-tight border-l-2 border-[#A8BA8E]/60 pl-2 sm:pl-3">
            <span className="font-serif text-[1rem] sm:text-[1.1rem] font-semibold tracking-wide text-[#2D2D2D]">
              Zayit
            </span>
            <span className="font-serif text-[0.75rem] sm:text-[0.85rem] font-normal italic tracking-wider text-[#A8BA8E]">
              Academy
            </span>
          </div>
          
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative px-4 py-2 text-sm font-medium tracking-wide text-[#2D2D2D] transition-colors hover:text-[#A8BA8E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
            >
              {item.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-[#A8BA8E] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="hidden sm:inline-flex bg-[#A8BA8E] text-[#FDFBF5] hover:bg-[#A8BA8E]/90"
            onClick={() => (window.location.href = "/#contact")}
          >
            Enquire
          </Button>
          <button
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full text-[#2D2D2D] transition-colors hover:bg-charcoal-800/5 active:bg-charcoal-800/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] bg-[#FDFBF5] lg:hidden"
            onClick={() => setOpen(false)}
          >
            <div 
              className="container-academy flex h-[76px] items-center justify-between px-4 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Mobile Logo & Name */}
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 shrink-0">
                <Image 
                  src="/assets/logo.jpeg" 
                  alt="Zayit Academy"
                  width={40}
                  height={40}
                  className="object-contain h-[40px] w-auto"
                />
                <div className="flex flex-col leading-none border-l-2 border-[#A8BA8E]/60 pl-2">
                  <span className="font-serif text-base font-semibold text-[#2D2D2D]">
                    Zayit
                  </span>
                  <span className="font-serif text-xs italic text-[#A8BA8E]">
                    Academy
                  </span>
                </div>
              </Link>

              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full text-[#2D2D2D] transition-colors hover:bg-charcoal-800/5 active:bg-charcoal-800/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-0 px-4 py-4 sm:px-6 max-h-[calc(100vh-76px-60px)] overflow-y-auto">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-[#2D2D2D]/10 py-4 font-display text-lg font-medium text-[#2D2D2D] hover:text-[#A8BA8E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Button 
                className="mt-6 w-full bg-[#A8BA8E] text-[#FDFBF5] hover:bg-[#A8BA8E]/90" 
                onClick={() => setOpen(false)}
              >
                Enquire
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}