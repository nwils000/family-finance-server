/** Join class names. A plain join, not a merge: pass props instead of overriding. */
export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');
