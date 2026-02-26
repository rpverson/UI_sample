import type { BuilderNode } from '../builder/types';

export type ChallengeCheck = {
  id: string;
  label: string;
  passed: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  starterTree: BuilderNode[];
  validate: (tree: BuilderNode[]) => ChallengeCheck[];
};
