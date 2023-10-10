import type { ChallengeDefinition } from "../types/challenge";
import { borderChallenge } from "./kitten-challenges/borderChallenge";
import { marginChallenge } from "./kitten-challenges/marginChallenge";
import { paddingChallenge } from "./kitten-challenges/paddingChallenge";
import { sidesChallenge } from "./kitten-challenges/sideChallenge";
import { centeringChallenge} from './kitten-challenges/centeringChallenge'
import { inlineBlockChallenge } from "./kitten-challenges/inlineBlock";

export let challenges: ChallengeDefinition[] = [
  inlineBlockChallenge,
  centeringChallenge,
  sidesChallenge,
  borderChallenge,
  paddingChallenge,
  marginChallenge,
];

