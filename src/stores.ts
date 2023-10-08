import type { Writable } from "svelte/store";
import {writable} from 'svelte/store';

export type ChallengeDefinition = {
  language : 'html' | 'css' | 'js';
  template : string;
  instructions : string;
  solution : string;
  html : string;
  css : string;
  js : string;
  starter : string;
};

export let studentWork : Writable<string> = writable("");
