// Stops the page scrolling behind a full-screen overlay (the phone menu, the
// store's product view and bag). The page scrolls on <html> here (globals.css
// gives html `overflow-x: hidden`), so that's what gets locked; the scrollbar's
// width is kept as padding so nothing jumps sideways. Each overlay locks under
// its own name, so one closing doesn't unlock the page under another.

const owners = new Set<string>();

export function setScrollLock(owner: string, locked: boolean) {
  if (typeof document === "undefined") return;
  const wasLocked = owners.size > 0;
  if (locked) owners.add(owner);
  else owners.delete(owner);

  const root = document.documentElement;
  if (owners.size > 0 && !wasLocked) {
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
  } else if (owners.size === 0 && wasLocked) {
    root.style.overflow = "";
    root.style.paddingRight = "";
  }
}
