// Shared checks for the flexbox challenges ("Herding Cats").
//
// The challenges check *outcomes* (where things end up, measured with
// getBoundingClientRect), plus a few guard rails so that the layout comes
// from flexbox on the parent rather than from nudging the children around
// with margins, positioning or transforms.

import type { ValidationItem } from "../../types/validation";
import { getContentRect } from "../validation";
import type { RectLike } from "../validation";

export function all(win: Window, selector: string): HTMLElement[] {
  return Array.from(win.document.querySelectorAll(selector)) as HTMLElement[];
}

export function one(win: Window, selector: string): HTMLElement | null {
  return win.document.querySelector(selector) as HTMLElement | null;
}

/** Where each element is drawn (content box), sorted left to right. */
export function rectsByX(els: Element[]): RectLike[] {
  return els.map((el) => getContentRect(el)).sort((a, b) => a.left - b.left);
}

/** Where each element is drawn (content box), sorted top to bottom. */
export function rectsByY(els: Element[]): RectLike[] {
  return els.map((el) => getContentRect(el)).sort((a, b) => a.top - b.top);
}

export const centerX = (r: RectLike) => (r.left + r.right) / 2;
export const centerY = (r: RectLike) => (r.top + r.bottom) / 2;
export const near = (a: number, b: number, tolerance = 2) =>
  Math.abs(a - b) <= tolerance;

/** Gaps between neighbours, left to right (rects sorted by x). */
export function gapsX(rects: RectLike[]): number[] {
  return rects.slice(1).map((r, i) => r.left - rects[i].right);
}

/** Gaps between neighbours, top to bottom (rects sorted by y). */
export function gapsY(rects: RectLike[]): number[] {
  return rects.slice(1).map((r, i) => r.top - rects[i].bottom);
}

/** All in one row (same top), none overlapping (rects sorted by x). */
export function inARow(rects: RectLike[], tolerance = 2): boolean {
  return (
    rects.every((r) => near(r.top, rects[0].top, tolerance)) &&
    gapsX(rects).every((g) => g >= -0.5)
  );
}

/** All in one column (same center), none overlapping (sorted by y). */
export function inAColumn(rects: RectLike[], tolerance = 2): boolean {
  return (
    rects.every((r) => near(centerX(r), centerX(rects[0]), tolerance)) &&
    gapsY(rects).every((g) => g >= -0.5)
  );
}

export function isFlex(win: Window, el: Element | null): boolean {
  if (!el) return false;
  const display = win.getComputedStyle(el).display;
  return display === "flex" || display === "inline-flex";
}

/** Check that `el` (called `label` in messages) is a flex container. */
export function flexContainerCheck(
  win: Window,
  el: Element | null,
  label: string,
  hint = `Turn the ${label} into a flex container so it can arrange its children.`
): ValidationItem {
  return {
    name: `The ${label} uses flexbox`,
    isValid: isFlex(win, el),
    message: hint,
  };
}

const px = (value: string) => parseFloat(value) || 0;

/**
 * Elements should be placed by their flex container, not pushed around one
 * by one with margins, position or transforms.
 */
export function placedByFlexbox(
  win: Window,
  els: Element[],
  what = "cats",
  {
    allowMargins = false,
    name = `The ${what} are placed with flexbox`,
  }: { allowMargins?: boolean; name?: string } = {}
): ValidationItem {
  let problem = "";
  for (const el of els) {
    const s = win.getComputedStyle(el);
    if (s.position === "absolute" || s.position === "fixed") {
      problem = `Don't use position: ${s.position} on the ${what}: let their container place them.`;
    } else if (
      s.position !== "static" &&
      [s.top, s.left, s.right, s.bottom].some((v) => px(v) !== 0)
    ) {
      problem = `Don't nudge the ${what} with top/left: let their container place them.`;
    } else if (
      !allowMargins &&
      [s.marginTop, s.marginRight, s.marginBottom, s.marginLeft].some(
        (m) => Math.abs(px(m)) > 2
      )
    ) {
      problem = `Your ${what} have margins: place them with properties on their container instead.`;
    } else if (
      (s.transform && s.transform !== "none") ||
      (s.translate && s.translate !== "none")
    ) {
      problem = `Don't move the ${what} with transforms: let their container place them.`;
    } else if (s.float && s.float !== "none") {
      problem = `Don't float the ${what}: let their container place them.`;
    }
    if (problem) break;
  }
  return {
    name,
    isValid: !problem,
    message: problem,
  };
}

/**
 * The container's padding shouldn't be used to shove its children into
 * place. `max` is the most padding (per side, in px) the scene itself uses.
 */
export function paddingUnchanged(
  win: Window,
  el: Element | null,
  label: string,
  max: { top?: number; right?: number; bottom?: number; left?: number },
  technique = "flexbox"
): ValidationItem {
  let ok = !!el;
  if (el) {
    const s = win.getComputedStyle(el);
    const sides = {
      top: px(s.paddingTop),
      right: px(s.paddingRight),
      bottom: px(s.paddingBottom),
      left: px(s.paddingLeft),
    };
    for (const side of ["top", "right", "bottom", "left"] as const) {
      if (sides[side] > (max[side] ?? 0) + 0.5) ok = false;
    }
  }
  return {
    name: `The ${label} keeps its padding`,
    isValid: ok,
    message: `Don't push things into place with padding on the ${label}: use ${technique}.`,
  };
}

/** Check that an element still has its original size. */
export function keepsSize(
  el: Element | null,
  width: number,
  height: number,
  message: string,
  name: string
): ValidationItem {
  const r = el?.getBoundingClientRect();
  return {
    name,
    isValid:
      !!r && Math.abs(r.width - width) <= 1 && Math.abs(r.height - height) <= 1,
    message,
  };
}

export function result(items: ValidationItem[]) {
  return { isSolved: items.every((i) => i.isValid), items };
}
