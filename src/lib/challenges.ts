import type { ChallengeDefinition } from "../types/challenge";
import { borderChallenge } from "./box-model/borderChallenge";
import { marginChallenge } from "./box-model/marginChallenge";
import { paddingChallenge } from "./box-model/paddingChallenge";
import { sidesChallenge } from "./box-model/sideChallenge";
import { centeringChallenge } from "./box-model/centeringChallenge";
import { inlineBlockChallenge } from "./box-model/inlineBlock";
import { cozyCatNapChallenge } from "./box-model/catnapChallenge";
import { escapeWaterChallenge } from "./box-model/waterChallenge";
import { advancedWaterChallenge } from "./box-model/advancedWaterChallenge";
import { elementChallenge } from "./selectors/elements";
import { flipCatChallenge } from "./selectors/cats";
import { nestedChallenge } from "./selectors/nested";
import { classChallenge } from "./selectors/classes";
import { nestedClassesChallenge } from "./selectors/nestedClasses";
import { linkChallenge } from "./selectors/links";
import { idChallenge } from "./selectors/ids";
import { hoverChallenge } from "./selectors/hover";
import { twoClassChallenge } from "./selectors/two-classes";
import { classesChallenge } from "./selectors/two-classes-css";
import { pseudoChallenge } from "./selectors/pseudo";
import { linkChallengeEasy } from "./selectors/links-basic";
import { linkChallengeMedium } from "./selectors/links-2";
import { htmlChallenge } from "./selectors/add-to-html";
import { commaChallenge } from "./selectors/commas";
import { query1Challenge } from "./vanilla-js/query1";
import { query2Challenge } from "./vanilla-js/query2";
import { functionChallenge } from "./vanilla-js/functions";
import { function2Challenge } from "./vanilla-js/functions2";
import { function3Challenge } from "./vanilla-js/functions3";

export type ChallengeSetId = "box" | "selectors";

export let challengeSets = {
  vanilla: {
    concept: "VanillaJS",
    name: "Disco Cats",
    challenges: [
      query1Challenge,
      query2Challenge,
      functionChallenge,
      function2Challenge,
      function3Challenge,
    ],
  },
  selectors: {
    concept: "CSS Selectors",
    name: "Find the Cats!",
    challenges: [
      flipCatChallenge,
      elementChallenge,
      nestedChallenge,
      classChallenge,
      htmlChallenge,
      nestedClassesChallenge,
      classesChallenge,
      twoClassChallenge,
      idChallenge,
      commaChallenge,
      linkChallengeEasy,
      linkChallengeMedium,
      linkChallenge,
      hoverChallenge,
      pseudoChallenge,
    ],
  },
  box: {
    concept: "the Box Model",
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
