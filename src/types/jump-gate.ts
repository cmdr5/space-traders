import type { ConnectedSystem } from "./system.js";

export type JumpGate = {
  jumpRange: number;
  factionSymbol?: string;
  connectedSystems: ConnectedSystem[];
};
