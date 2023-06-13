import type { ConnectedSystem } from "./system";

export type JumpGate = {
  jumpRange: number;
  factionSymbol?: string;
  connectedSystems: ConnectedSystem[];
};
