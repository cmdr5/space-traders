import type { Chart } from "./chart.js";
import type { FactionSymbol } from "./faction.js";

export enum WaypointType {
  Planet = "PLANET",
  GasGiant = "GAS_GIANT",
  Moon = "MOON",
  OrbitalStation = "ORBITAL_STATION",
  JumpGate = "JUMP_GATE",
  AsteroidField = "ASTEROID_FIELD",
  Nebula = "NEBULA",
  DebrisField = "DEBRIS_FIELD",
  GravityWell = "GRAVITY_WELL"
}

export type WaypointTrait = {
  symbol:
    | "UNCHARTED"
    | "MARKETPLACE"
    | "SHIPYARD"
    | "OUTPOST"
    | "SCATTERED_SETTLEMENTS"
    | "SPRAWLING_CITIES"
    | "MEGA_STRUCTURES"
    | "OVERCROWDED"
    | "HIGH_TECH"
    | "CORRUPT"
    | "BUREAUCRATIC"
    | "TRADING_HUB"
    | "INDUSTRIAL"
    | "BLACK_MARKET"
    | "RESEARCH_FACILITY"
    | "MILITARY_BASE"
    | "SURVEILLANCE_OUTPOST"
    | "EXPLORATION_OUTPOST"
    | "MINERAL_DEPOSITS"
    | "COMMON_METAL_DEPOSITS"
    | "PRECIOUS_METAL_DEPOSITS"
    | "RARE_METAL_DEPOSITS"
    | "METHANE_POOLS"
    | "ICE_CRYSTALS"
    | "EXPLOSIVE_GASES"
    | "STRONG_MAGNETOSPHERE"
    | "VIBRANT_AURORAS"
    | "SALT_FLATS"
    | "CANYONS"
    | "PERPETUAL_DAYLIGHT"
    | "PERPETUAL_OVERCAST"
    | "DRY_SEABEDS"
    | "MAGMA_SEAS"
    | "SUPERVOLCANOES"
    | "ASH_CLOUDS"
    | "VAST_RUINS"
    | "MUTATED_FLORA"
    | "TERRAFORMED"
    | "EXTREME_TEMPERATURES"
    | "EXTREME_PRESSURE"
    | "DIVERSE_LIFE"
    | "SCARCE_LIFE"
    | "FOSSILS"
    | "WEAK_GRAVITY"
    | "STRONG_GRAVITY"
    | "CRUSHING_GRAVITY"
    | "TOXIC_ATMOSPHERE"
    | "CORROSIVE_ATMOSPHERE"
    | "BREATHABLE_ATMOSPHERE"
    | "JOVIAN"
    | "ROCKY"
    | "VOLCANIC"
    | "FROZEN"
    | "SWAMP"
    | "BARREN"
    | "TEMPERATE"
    | "JUNGLE"
    | "OCEAN"
    | "STRIPPED";
  name: string;
  description: string;
};

export type WaypointOrbital = {
  symbol: string;
};

export type WaypointFaction = {
  symbol: FactionSymbol;
};

export type Waypoint = {
  symbol: string;
  type: WaypointType;
  systemSymbol: string;
  x: number;
  y: number;
  orbitals: WaypointOrbital[];
  faction?: WaypointFaction;
  traits: WaypointTrait[];
  chart?: Chart;
};

export type ScannedWaypoint = Waypoint;
