// Shared behaviour for the fixed header designs (Basic, Blurred and BlurredPlus).
// Each design wraps its markup in an element with `data-fixed-header`, and marks:
//   data-bar     → the bar(s) that change when you scroll (Blurred and BlurredPlus also have a contact box)
//   data-burger  → the menu button shown on phones
//   data-menu    → the full-screen mobile menu
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export function initFixedHeader(root) {
  if (root.dataset.ready) return; // only set up once, even if the script loads twice
  root.dataset.ready = 'true';

  const bars = root.querySelectorAll('[data-bar]');
  const burger = root.querySelector('[data-burger]');
  const menu = root.querySelector('[data-menu]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let open = false;

  // ---- Scrolling: solid background once the page moves, hide on the way down ----
  // ScrollSmoother still uses the browser's real scroll position, so window.scrollY works
  // with or without it (it's switched off for reduced-motion visitors).
  let lastY = window.scrollY;
  const setHidden = (hidden) => bars.forEach((el) => el.classList.toggle('is-hidden', hidden));

  function onScroll() {
    const y = window.scrollY;
    bars.forEach((el) => el.classList.toggle('scrolled', y > 8));
    if (!open) {
      if (y > lastY && y > window.innerHeight * 0.3) setHidden(true);
      else if (y < lastY) setHidden(false);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Keyboard users tabbing into a hidden header should be able to see it
  root.addEventListener('focusin', () => setHidden(false));

  // ---- Mobile menu: slides in from the right, links rise in one after another ----
  if (!burger || !menu) return;
  // Top-level items only, so a nested list (like BlurredPlus's Services) doesn't join the stagger
  const items = menu.querySelectorAll(':scope > ul > li');

  const menuTween = gsap.timeline({
    paused: true,
    onReverseComplete: () => { menu.style.visibility = 'hidden'; },
  })
    .to(menu, { x: 0, duration: 0.7, ease: 'power1.inOut' })
    .from(items, { y: 30, opacity: 0, stagger: 0.08, duration: 0.4 }, '-=0.2');

  function setMenu(next) {
    if (next === open) return;
    open = next;
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    // Stop the page scrolling behind the menu, and stop Tab reaching the page behind it
    ScrollSmoother.get()?.paused(open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.getElementById('smooth-wrapper')?.toggleAttribute('inert', open);

    if (open) {
      setHidden(false);
      menu.style.visibility = 'visible';
      if (reduceMotion) menuTween.progress(1);
      else menuTween.play();
      items[0]?.querySelector('a, button')?.focus({ preventScroll: true });
    } else if (reduceMotion) {
      menuTween.progress(0);
      menu.style.visibility = 'hidden';
    } else {
      menuTween.reverse();
    }
  }

  burger.addEventListener('click', () => setMenu(!open));

  // Close when a link is tapped. "Capture" runs this before Base.astro's smooth-scroll
  // handler, so the page is unpaused in time to glide to the section.
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setMenu(false);
      burger.focus();
    }
  });

  // If the window is widened to desktop size while the menu is open, close it
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });
}
