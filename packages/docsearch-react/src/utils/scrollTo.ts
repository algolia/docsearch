export function scrollTo(el: HTMLElement): void {
  // some test environments (like jsdom) don't implement element.scrollTo
  if (typeof el.scrollTo === 'function') {
    el.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // fallback for environments without scrollTo support
    el.scrollTop = 0;
  }
}
