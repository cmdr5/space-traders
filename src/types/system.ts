import type { WaypointType } from "./waypoint";

export type SystemType =
  | "NEUTRON_STAR"
  | "RED_STAR"
  | "ORANGE_STAR"
  | "BLUE_STAR"
  | "YOUNG_STAR"
  | "WHITE_DWARF"
  | "BLACK_HOLE"
  | "HYPERGIANT"
  | "NEBULA"
  | "UNSTABLE";

export type SystemFaction = {
  symbol: string;
};

export type SystemWaypoint = {
  symbol: string;
  type: WaypointType;
  x: number;
  y: number;
};

export type System = {
  symbol: string;
  sectorSymbol: string;
  type: SystemType;
  x: number;
  y: number;
  waypoints: SystemWaypoint[];
  factions: SystemFaction[];
};

export type ConnectedSystem = {
  symbol: string;
  sectorSymbol: string;
  type: SystemType;
  factionSymbol?: string;
  x: number;
  y: number;
  distance: number;
};
