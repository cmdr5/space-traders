import type { WaypointType } from "./waypoint";

export enum SystemType {
  NeutronStar = "NEUTRON_STAR",
  RedStar = "RED_STAR",
  OrangeStar = "ORANGE_STAR",
  BlueStar = "BLUE_STAR",
  YoungStar = "YOUNG_STAR",
  WhiteDwarf = "WHITE_DWARF",
  BlackHole = "BLACK_HOLE",
  Hypergiant = "HYPERGIANT",
  Nebula = "NEBULA",
  Unstable = "UNSTABLE"
}

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

export type ScannedSystem = Omit<ConnectedSystem, "factionSymbol">;
