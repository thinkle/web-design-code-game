import type { Writable } from "svelte/store";
import {writable} from 'svelte/store';

export type Challenge = {

};

export let studentWork : Writable<string> = writable("");
