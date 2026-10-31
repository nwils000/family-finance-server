// Secrets in links (password reset, email verification, grown-up invites) ride in
// the URL fragment, which the browser never sends to a server or a Referer header.
// Pages read the value once into state, then wipe it from the address bar.

/** The value of `key` in the current URL fragment (`#key=value`), or ''. */
export const readFragment = (key: string) => new URLSearchParams(window.location.hash.slice(1)).get(key) ?? '';

/** Drop the fragment from the address bar and history, keeping the page. */
export const clearFragment = () => window.history.replaceState(null, '', window.location.pathname);
