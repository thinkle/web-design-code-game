import type { ChallengeDefinition } from "../types/challenge";
import { borderChallenge } from "./kitten-challenges/borderChallenge";
import { marginChallenge } from "./kitten-challenges/marginChallenge";
import { paddingChallenge } from "./kitten-challenges/paddingChallenge";
import { sidesChallenge } from "./kitten-challenges/sideChallenge";
import { centeringChallenge} from './kitten-challenges/centeringChallenge'
import { inlineBlockChallenge } from "./kitten-challenges/inlineBlock";
import { cozyCatNapChallenge } from "./kitten-challenges/catnapChallenge";
import { escapeWaterChallenge } from "./kitten-challenges/waterChallenge";

export let challenges: ChallengeDefinition[] = [
  paddingChallenge,
  marginChallenge,
  escapeWaterChallenge,
  borderChallenge,
  inlineBlockChallenge,
  sidesChallenge,
  centeringChallenge,
  cozyCatNapChallenge,
];

