import React from 'react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------
   Benta surface & icon primitives
   The single source of truth for "boxes" and "icons" across the
   public site, the family portal and the back office. Backed by the
   .surface-* / .icon-chip / .chip-badge / .eyebrow-label classes in
   index.css so the same look is reachable from plain JSX too.
   ------------------------------------------------------------------ */

type DivProps = React.HTMLAttributes<HTMLDivElement>;

const cx = (...parts: Array<string | false | undefined | null>) =>
  parts.filter(Boolean).join(' ');

/** White card: the one container everything else sits in. */
export const Surface: React.FC<DivProps & { hover?: boolean }> = ({
  hover = false,
  className,
  ...rest
}) => <div className={cx('surface-card', hover && 'surface-card-hover', className)} {...rest} />;

/** Inner tinted tile: stat rows, schedule slots, list boxes. */
export const SurfaceTile: React.FC<DivProps> = ({ className, ...rest }) => (
  <div className={cx('surface-tile', className)} {...rest} />
);

/** Dark feature band (hero headers, compliance footers). */
export const SurfaceDark: React.FC<DivProps> = ({ className, ...rest }) => (
  <div className={cx('surface-dark', className)} {...rest} />
);

type ChipSize = 'sm' | 'md' | 'lg';

/** The one way an icon is presented: brass-tinted chip, maroon glyph. */
export const IconChip: React.FC<{
  icon: LucideIcon;
  size?: ChipSize;
  onDark?: boolean;
  className?: string;
}> = ({ icon: Icon, size = 'md', onDark = false, className }) => (
  <span
    className={cx(
      'icon-chip',
      size === 'sm' && 'icon-chip-sm',
      size === 'lg' && 'icon-chip-lg',
      onDark && 'icon-chip-on-dark',
      className
    )}
  >
    <Icon />
  </span>
);

type BadgeTone = 'neutral' | 'brand' | 'action' | 'success' | 'dark' | 'live';

/** The one pill vocabulary. Tone carries meaning, never decoration. */
export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }> = ({
  tone = 'neutral',
  className,
  children,
  ...rest
}) => (
  <span className={cx('chip-badge', `chip-badge-${tone}`, className)} {...rest}>
    {tone === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
    {children}
  </span>
);

/** Small uppercase kicker above a heading, optionally with a hairline. */
export const Eyebrow: React.FC<React.HTMLAttributes<HTMLSpanElement> & { rule?: boolean }> = ({
  rule = false,
  className,
  children,
  ...rest
}) => (
  <span className={cx('eyebrow-label', className)} {...rest}>
    {rule && <span className="benta-hairline inline-block w-8 align-middle mr-2.5" />}
    {children}
  </span>
);

export default { Surface, SurfaceTile, SurfaceDark, IconChip, Badge, Eyebrow };
