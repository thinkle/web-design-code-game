import type { Writable } from "svelte/store";
import {writable} from 'svelte/store';

export let studentWork : Writable<string> = writable("");

// Devtools-style "show the box model" hover highlighting in the previews.
export let showBoxModel: Writable<boolean> = writable(false);
