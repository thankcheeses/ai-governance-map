import { type ElementType, type ReactNode, useLayoutEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * Entrance motion for things that appear over the map.
 *
 * Three rules, all of them about not getting in the reader's way:
 *
 *  - **Visible by default.** The element renders in its final state; the
 *    animation only plays *from* an offset. If the script never runs — a
 *    hidden tab, a headless renderer, reduced motion — the content is simply
 *    there. Nothing is ever gated on a transition finishing.
 *  - **Short and decelerating.** 320 ms, ease-out-expo, a 14 px travel. Long
 *    enough to say where the panel came from, short enough to never be waited
 *    on. No bounce: this is a register, not a toy.
 *  - **Reduced motion means no travel.** A quick fade replaces the slide, and
 *    list items do not stagger.
 *
 * `motionKey` replays the entrance when the content changes underneath the
 * same element (a different country, a different metric). `stagger` names the
 * children that arrive one after another — used for one list, not as a reflex
 * on every section.
 */
export default function Enter({
  as: Tag = 'div',
  motionKey,
  from = 'right',
  stagger: childSelector,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  motionKey?: string | number | null;
  from?: 'right' | 'left' | 'top' | 'bottom' | 'none';
  stagger?: string;
  className?: string;
  children: ReactNode;
  [attr: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = childSelector ? Array.from(el.querySelectorAll<HTMLElement>(childSelector)) : [el];
    if (!targets.length) return;

    const travel = reduced || from === 'none' ? 0 : childSelector ? 6 : 14;
    const axis = from === 'top' || from === 'bottom' ? 'y' : 'x';
    const sign = from === 'left' || from === 'top' ? -1 : 1;

    const anim = animate(targets, {
      opacity: [0, 1],
      ...(travel ? { [axis]: [sign * travel, 0] } : {}),
      duration: reduced ? 140 : childSelector ? 260 : 320,
      delay: childSelector && !reduced ? stagger(28) : 0,
      ease: 'outExpo',
    });
    // Leave no inline transform behind: a lingering transform on a panel would
    // become the containing block for anything fixed inside it.
    anim.then(() => anim.revert()).catch(() => {});
    return () => {
      anim.revert();
    };
  }, [motionKey, childSelector, from]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
