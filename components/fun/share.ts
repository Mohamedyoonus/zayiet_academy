// WhatsApp-green styling for the Share tool button
export const SHARE_BUTTON = "border-transparent bg-[#25D366] text-white hover:bg-[#1EBE5A] hover:text-white";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = filename;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Share a finished artwork. Phones get the native share sheet with the picture
 * attached (WhatsApp, Instagram…); anywhere else the picture is saved and
 * WhatsApp opens with a ready message so it can be attached. `text` and
 * `title` come from the dictionary, so the message is in the page language.
 */
export async function shareArtwork(blob: Blob, filename: string, copy: { text: string; title: string }) {
  const link = `${window.location.origin}/fun-zone`;
  const message = `${copy.text} ${link}`;
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: copy.title, text: message });
      return;
    } catch (err) {
      // Closing the share sheet is not an error worth falling back from
      if (err instanceof DOMException && err.name === "AbortError") return;
    }
  }

  downloadBlob(blob, filename);
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}
