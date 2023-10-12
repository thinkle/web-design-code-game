import type { ChallengeDefinition } from "../types/challenge";
import { borderChallenge } from "./kitten-challenges/borderChallenge";
import { marginChallenge } from "./kitten-challenges/marginChallenge";
import { paddingChallenge } from "./kitten-challenges/paddingChallenge";
import { sidesChallenge } from "./kitten-challenges/sideChallenge";
import { centeringChallenge } from "./kitten-challenges/centeringChallenge";
import { inlineBlockChallenge } from "./kitten-challenges/inlineBlock";
import { cozyCatNapChallenge } from "./kitten-challenges/catnapChallenge";
import { escapeWaterChallenge } from "./kitten-challenges/waterChallenge";
import { advancedWaterChallenge } from "./kitten-challenges/advancedWaterChallenge";

export type ChallengeSetId = "Box";

export let challengeSets = {
  box: {
    concept: "Box Model",
    name: "Cats in Boxes",
    challenges: [
      paddingChallenge,
      marginChallenge,
      escapeWaterChallenge,
      advancedWaterChallenge,
      borderChallenge,
      inlineBlockChallenge,
      sidesChallenge,
      centeringChallenge,
      cozyCatNapChallenge,
    ],
  },
};
