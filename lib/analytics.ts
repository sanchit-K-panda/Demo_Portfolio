/**
 * Analytics placeholder — wire up GA or Plausible here.
 * TODO: Add NEXT_PUBLIC_GA_MEASUREMENT_ID to .env.local to enable GA.
 * TODO: Add NEXT_PUBLIC_PLAUSIBLE_DOMAIN to .env.local to enable Plausible.
 */

type WindowWithGA = Window & { gtag: (...args: unknown[]) => void };
type WindowWithPlausible = Window & { plausible: (event: string, options?: unknown) => void };

function hasGtag(w: Window): w is WindowWithGA {
  return typeof (w as Partial<WindowWithGA>).gtag === "function";
}

function hasPlausible(w: Window): w is WindowWithPlausible {
  return typeof (w as Partial<WindowWithPlausible>).plausible === "function";
}

export function trackPageView(url: string): void {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && hasGtag(window)) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, { page_path: url });
  }

  // Plausible
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && hasPlausible(window)) {
    window.plausible("pageview");
  }
}

export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  // GA4 custom event
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && hasGtag(window)) {
    window.gtag("event", name, properties);
  }

  // Plausible custom event
  if (hasPlausible(window)) {
    window.plausible(name, { props: properties });
  }
}
