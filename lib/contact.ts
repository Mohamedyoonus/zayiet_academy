// Helpers for the academy's contact details, shared by the Contact page,
// the call/WhatsApp buttons and the social icons.

/** Digits of a phone number, with India's code added to 10-digit numbers ("" if it isn't a number yet) */
export function phoneDigits(value: string | undefined) {
  let digits = (value ?? "").replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return digits.length >= 8 ? digits : "";
}

export const telLink = (value: string | undefined) => {
  const digits = phoneDigits(value);
  return digits ? `tel:+${digits}` : null;
};

export const whatsappLink = (value: string | undefined) => {
  const digits = phoneDigits(value);
  return digits ? `https://wa.me/${digits}` : null;
};

/** Only real web addresses become links */
export const webLink = (value: string | undefined) => (value && /^https?:\/\/\S+$/i.test(value.trim()) ? value.trim() : null);

export const mapEmbedUrl = (query: string) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
export const mapLink = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
