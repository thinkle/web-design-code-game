// Devtools-style box model highlighting for the preview iframes.
//
// The overlay is drawn in the *parent* document, on top of the iframe, so it
// never adds elements to the student's page (validators and selector
// challenges query that DOM, so it must stay untouched).

const COLORS = {
  margin: "rgba(246, 178, 107, 0.66)",
  border: "rgba(255, 229, 153, 0.75)",
  padding: "rgba(147, 196, 125, 0.6)",
  content: "rgba(111, 168, 220, 0.6)",
};

const SKIP = new Set(["HTML", "BODY", "WRAPPER", "MAIN"]);

type Sides = { top: number; right: number; bottom: number; left: number };

function sides(style: CSSStyleDeclaration, prefix: string, suffix = "") {
  const get = (side: string) =>
    parseFloat(style.getPropertyValue(`${prefix}-${side}${suffix}`)) || 0;
  return {
    top: get("top"),
    right: get("right"),
    bottom: get("bottom"),
    left: get("left"),
  };
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function describeSides(s: Sides) {
  const v = [s.top, s.right, s.bottom, s.left].map(round);
  if (v.every((x) => x === v[0])) return `${v[0]}`;
  return v.join(" ");
}

function label(el: Element) {
  let text = el.tagName.toLowerCase();
  if (el.id) text += `#${el.id}`;
  for (const c of Array.from(el.classList)) text += `.${c}`;
  return text;
}

/** A layer that draws a colored "ring" of the given thickness. */
function ring(color: string): HTMLDivElement {
  const div = document.createElement("div");
  Object.assign(div.style, {
    position: "absolute",
    boxSizing: "border-box",
    borderStyle: "solid",
    borderColor: color,
    pointerEvents: "none",
  });
  return div;
}

function place(
  div: HTMLDivElement,
  left: number,
  top: number,
  width: number,
  height: number,
  thickness?: Sides
) {
  Object.assign(div.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${Math.max(0, width)}px`,
    height: `${Math.max(0, height)}px`,
  });
  if (thickness) {
    div.style.borderWidth = `${Math.max(0, thickness.top)}px ${Math.max(
      0,
      thickness.right
    )}px ${Math.max(0, thickness.bottom)}px ${Math.max(0, thickness.left)}px`;
  }
}

/**
 * Attach box-model highlighting to an iframe. Hovering an element inside the
 * iframe shows its margin / border / padding / content, like browser devtools.
 * Returns a cleanup function.
 */
export function attachBoxModelOverlay(
  iframe: HTMLIFrameElement,
  layer: HTMLElement,
  tipLayer: HTMLElement
): () => void {
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) return () => {};

  const marginDiv = ring(COLORS.margin);
  const borderDiv = ring(COLORS.border);
  const paddingDiv = ring(COLORS.padding);
  const contentDiv = ring(COLORS.content);
  contentDiv.style.borderWidth = "0";
  contentDiv.style.background = COLORS.content;
  const tip = document.createElement("div");
  tip.className = "box-model-tip";

  const parts = [marginDiv, borderDiv, paddingDiv, contentDiv, tip];
  let current: Element | null = null;

  function clear() {
    current = null;
    for (const p of parts) p.remove();
  }

  function draw(el: Element) {
    current = el;
    const style = win!.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const m = sides(style, "margin");
    const b = sides(style, "border", "-width");
    const p = sides(style, "padding");

    place(
      marginDiv,
      rect.left - m.left,
      rect.top - m.top,
      rect.width + m.left + m.right,
      rect.height + m.top + m.bottom,
      m
    );
    place(borderDiv, rect.left, rect.top, rect.width, rect.height, b);
    const pl = rect.left + b.left;
    const pt = rect.top + b.top;
    const pw = rect.width - b.left - b.right;
    const ph = rect.height - b.top - b.bottom;
    place(paddingDiv, pl, pt, pw, ph, p);
    const cw = pw - p.left - p.right;
    const ch = ph - p.top - p.bottom;
    place(contentDiv, pl + p.left, pt + p.top, cw, ch);

    tip.innerHTML = "";
    const title = document.createElement("strong");
    title.textContent = label(el);
    const size = document.createElement("span");
    size.textContent = ` ${round(cw)} × ${round(ch)}`;
    tip.append(title, size);
    for (const [name, value] of [
      ["margin", m],
      ["border", b],
      ["padding", p],
    ] as [keyof typeof COLORS, Sides][]) {
      const row = document.createElement("div");
      const swatch = document.createElement("i");
      swatch.style.background = COLORS[name];
      row.append(swatch, `${name}: ${describeSides(value)}`);
      tip.append(row);
    }
    layer.append(marginDiv, borderDiv, paddingDiv, contentDiv);
    tipLayer.append(tip);

    // Put the tooltip beside the element (right if it fits, else left),
    // since the previews are often too short to fit it above or below.
    const marginRight = rect.right + m.right;
    const marginLeft = rect.left - m.left;
    const tipWidth = tip.offsetWidth;
    const gap = 6;
    let left = marginRight + gap;
    if (left + tipWidth > iframe.clientWidth) {
      left = marginLeft - gap - tipWidth;
    }
    left = Math.max(0, Math.min(left, iframe.clientWidth - tipWidth));
    const top = Math.max(0, Math.min(rect.top, iframe.clientHeight - 20));
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  }

  function onMove(event: MouseEvent) {
    const target = event.target as Element | null;
    if (!target || target.nodeType !== 1 || SKIP.has(target.tagName)) {
      clear();
    } else if (target !== current) {
      draw(target);
    }
  }

  function redraw() {
    if (current && current.isConnected) draw(current);
  }

  doc.addEventListener("mousemove", onMove);
  doc.documentElement.addEventListener("mouseleave", clear);
  win.addEventListener("scroll", redraw);

  return () => {
    doc.removeEventListener("mousemove", onMove);
    doc.documentElement.removeEventListener("mouseleave", clear);
    win.removeEventListener("scroll", redraw);
    clear();
  };
}
