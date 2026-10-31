import { useId } from 'react';
import type { ReactNode } from 'react';
import type { ArtProps } from './types';

/**
 * Kid Kapital UI icons. 24x24, chunky rounded strokes in currentColor so they
 * recolor with text. Duotone by default (main shape filled at 20%); `active`
 * fills the main shape solid and draws inner details in white, like a selected tab.
 */
export type UiIconProps = ArtProps & { active?: boolean };

type BaseProps = UiIconProps & { children: ReactNode };

function Base({ size = 24, className, children, active, ...rest }: BaseProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      data-active={active ? '' : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Fill for the main shape. */
const main = (active?: boolean) => ({ fill: 'currentColor', fillOpacity: active ? 1 : 0.2 });
/** Color for details drawn on top of the main shape. */
const det = (active?: boolean) => (active ? '#fff' : 'currentColor');

export function IconHome({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" {...main(active)} />
      <path d="M10 20.5v-4.5a2 2 0 0 1 4 0v4.5" stroke={det(active)} />
    </Base>
  );
}

export function IconQuests({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M5.5 4.5h12l-2.5 4.25 2.5 4.25h-12z" {...main(active)} />
      <path d="M5.5 21V3.5" />
      <path d="M10.5 6.8l.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1 1.5-.2z" fill={det(active)} stroke="none" />
    </Base>
  );
}

export function IconShop({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M5 11.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-7.5" {...main(active)} />
      <path d="M3.5 9 5 4h14l1.5 5a2.8 2.8 0 0 1-5.6.3 2.8 2.8 0 0 1-5.6 0A2.8 2.8 0 0 1 3.5 9z" {...main(active)} />
      <path d="M10 20.5V16h4v4.5" stroke={det(active)} />
    </Base>
  );
}

export function IconGrow({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M12 14V9" />
      <path d="M12 9C12 6 10 4 6 4c0 3 2 5 6 5z" {...main(active)} />
      <path d="M12 10.5c0-2.5 2-4.5 6-4.5 0 3-2 4.5-6 4.5z" {...main(active)} />
      <path d="M6.5 14h11l-1.3 5.8a1.5 1.5 0 0 1-1.5 1.2H9.3a1.5 1.5 0 0 1-1.5-1.2z" {...main(active)} />
    </Base>
  );
}

/** An open book with a little spark: the Learn tab. */
export function IconLearn({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M12 7.5C9.8 5.8 6.8 5.3 3.5 5.8v12c3.3-.5 6.3 0 8.5 1.7z" {...main(active)} />
      <path d="M12 7.5c2.2-1.7 5.2-2.2 8.5-1.7v12c-3.3-.5-6.3 0-8.5 1.7z" {...main(active)} />
      <path d="M12 7.5v12" stroke={det(active)} />
      <path d="M16.5 2.2v2.6M15.2 3.5h2.6" />
    </Base>
  );
}

export function IconFamily({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <circle cx="9" cy="7.5" r="3" {...main(active)} />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0z" {...main(active)} />
      <circle cx="16.5" cy="9.5" r="2.3" {...main(active)} />
      <path d="M15 14.4a4.5 4.5 0 0 1 5.5 4.4v.7h-3.5" {...main(active)} />
    </Base>
  );
}

export function IconBell({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M12 3v1.5" />
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" {...main(active)} />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
      <path d="M9 10.5a3 3 0 0 1 2-2.5" stroke={det(active)} strokeOpacity={active ? 1 : 0} />
    </Base>
  );
}

export function IconSettings({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path
        d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"
        strokeWidth={3}
      />
      <circle cx="12" cy="12" r="6.25" {...main(active)} />
      <circle cx="12" cy="12" r="2.25" stroke={det(active)} />
    </Base>
  );
}

export function IconCheck(p: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Base>
  );
}

export function IconPlus(p: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}

export function IconMinus(p: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M5 12h14" />
    </Base>
  );
}

export function IconClose(p: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </Base>
  );
}

export function IconBack(p: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M15 5l-7 7 7 7" />
    </Base>
  );
}

export function IconChevronRight(p: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M9 5l7 7-7 7" />
    </Base>
  );
}

export function IconLogout({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <rect x="4" y="4" width="9.5" height="16" rx="2" {...main(active)} />
      <circle cx="10.5" cy="12" r="0.9" fill={det(active)} stroke="none" />
      <path d="M16 12h5M18 9l3 3-3 3" />
    </Base>
  );
}

export function IconLock({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" {...main(active)} />
      <path d="M12 14.5v2" stroke={det(active)} />
    </Base>
  );
}

export function IconCalendar({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" {...main(active)} />
      <path d="M8.5 3.5v4M15.5 3.5v4" />
      <path d="M4 10h16" stroke={det(active)} strokeWidth={active ? 1.75 : 2.25} />
      <g fill={det(active)} stroke="none">
        <circle cx="9" cy="14" r="1.1" />
        <circle cx="15" cy="14" r="1.1" />
        <circle cx="9" cy="17.25" r="1.1" />
      </g>
    </Base>
  );
}

export function IconClock({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" {...main(active)} />
      <path d="M12 7.5V12l3 2" stroke={det(active)} />
    </Base>
  );
}

export function IconTrash({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" {...main(active)} />
      <path d="M4 7h16M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
      <path d="M10 11v6M14 11v6" stroke={det(active)} />
    </Base>
  );
}

export function IconDownload({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" {...main(active)} />
      <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
    </Base>
  );
}

export function IconEdit({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M15.5 4.5a2.1 2.1 0 0 1 3 0l1 1a2.1 2.1 0 0 1 0 3L9 19l-5 1 1-5z" {...main(active)} />
      <path d="M13.5 6.5l4 4" stroke={det(active)} />
    </Base>
  );
}

export function IconCopy({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M15 8V5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15H8" />
      <rect x="9" y="9" width="11" height="11" rx="2" {...main(active)} />
    </Base>
  );
}

export function IconSparkle({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M11 3.5c.6 4 2.5 5.9 6.5 6.5-4 .6-5.9 2.5-6.5 6.5-.6-4-2.5-5.9-6.5-6.5 4-.6 5.9-2.5 6.5-6.5z" {...main(active)} />
      <path d="M18 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.2-2.2.9-2.5 2.5-.3-1.6-1-2.3-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5z" {...main(active)} />
    </Base>
  );
}

export function IconInbox({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path
        d="M4 13l2.2-7.2A1.5 1.5 0 0 1 7.6 4.7h8.8a1.5 1.5 0 0 1 1.4 1.1L20 13v5.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z"
        {...main(active)}
      />
      <path d="M4 13h4l1.5 2.5h5L16 13h4" stroke={det(active)} />
    </Base>
  );
}

export function IconHistory({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="7.5" stroke="none" {...main(active)} />
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9" />
      <path d="M4.5 4.5V9H9" />
      <path d="M12 8.5V12l2.5 1.5" stroke={det(active)} />
    </Base>
  );
}

export function IconSwap(p: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M7 4.5 4 7.5l3 3M4 7.5h13M17 13.5l3 3-3 3M20 16.5H7" />
    </Base>
  );
}

export function IconEye({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...main(active)} />
      <circle cx="12" cy="12" r="3" stroke={det(active)} />
    </Base>
  );
}

export function IconEyeOff({ active, ...p }: UiIconProps) {
  const clip = useId();
  const eye = 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z';
  return (
    <Base {...p}>
      <clipPath id={clip}>
        <path d={eye} />
      </clipPath>
      <path d={eye} {...main(active)} />
      <circle cx="12" cy="12" r="3" stroke={det(active)} />
      <path d="M4 4l16 16" />
      {active && <path d="M4 4l16 16" stroke="#fff" clipPath={`url(#${clip})`} />}
    </Base>
  );
}

export function IconMail({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" {...main(active)} />
      <path d="M4.5 7l7.5 6 7.5-6" stroke={det(active)} />
    </Base>
  );
}

export function IconKey({ active, ...p }: UiIconProps) {
  return (
    <Base {...p}>
      <path d="M11.2 11.8 19.5 3.5M16.5 6.5 19 9M14.5 8.5l2 2" />
      <circle cx="8" cy="15" r="4.75" {...main(active)} />
      <circle cx="8" cy="15" r="1.3" fill={det(active)} stroke="none" />
    </Base>
  );
}
