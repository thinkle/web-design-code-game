import type { Writable } from "svelte/store";
import {writable} from 'svelte/store';

export let studentWork : Writable<string> = writable("");

// Devtools-style "show the box model" hover highlighting in the previews.
export let showBoxModel: Writable<boolean> = writable(false);

// How the Target preview is shown: half size or full size.
// Remembered per browser (best effort).
export type TargetView = "small" | "full";
const TARGET_VIEW_KEY = "cat-game:targetView";
function loadTargetView(): TargetView {
  try {
    const saved = localStorage.getItem(TARGET_VIEW_KEY);
    if (saved === "small" || saved === "full") {
      return saved;
    }
  } catch (e) {}
  return "small";
}
export let targetView: Writable<TargetView> = writable(loadTargetView());
targetView.subscribe((view) => {
  try {
    localStorage.setItem(TARGET_VIEW_KEY, view);
  } catch (e) {}
});

// Box model lessons: draw dashed "ghost cats" on the Result where the
// Target's cats are.
export let showGhostCats: Writable<boolean> = writable(false);
