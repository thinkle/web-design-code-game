import type { ChallengeDefinition } from "../types/challenge";
import { borderChallenge } from "./kitten-challenges/borderChallenge";
import { marginChallenge } from "./kitten-challenges/marginChallenge";
import { paddingChallenge } from "./kitten-challenges/paddingChallenge";

export let challenges: ChallengeDefinition[] = [borderChallenge, paddingChallenge, marginChallenge];

