import type { WaypointType } from "./waypoint";

export type ShipFuel = {
  current: number;
  capacity: number;
  consumed?: {
    amount: number;
    timestamp: string;
  };
};

export type ShipCargoItem = {
  symbol: string;
  name: string;
  description: string;
  units: number;
};

export type ShipCargo = {
  capacity: number;
  units: number;
  inventory: ShipCargoItem[];
};

export type ShipMountSymbol =
  | "MOUNT_GAS_SIPHON_I"
  | "MOUNT_GAS_SIPHON_II"
  | "MOUNT_GAS_SIPHON_III"
  | "MOUNT_SURVEYOR_I"
  | "MOUNT_SURVEYOR_II"
  | "MOUNT_SURVEYOR_III"
  | "MOUNT_SENSOR_ARRAY_I"
  | "MOUNT_SENSOR_ARRAY_II"
  | "MOUNT_SENSOR_ARRAY_III"
  | "MOUNT_MINING_LASER_I"
  | "MOUNT_MINING_LASER_II"
  | "MOUNT_MINING_LASER_III"
  | "MOUNT_LASER_CANNON_I"
  | "MOUNT_MISSILE_LAUNCHER_I"
  | "MOUNT_TURRET_I";

export type ShipRequirements = {
  power?: number;
  crew?: number;
  slots?: number;
};

export type ShipMount = {
  symbol: ShipMountSymbol;
  name: string;
  description?: string;
  strength?: number;
  // TODO: Use a string union for this.
  deposits?: string[];
  requirements: ShipRequirements;
};

export type ShipModuleSymbol =
  | "MODULE_MINERAL_PROCESSOR_I"
  | "MODULE_CARGO_HOLD_I"
  | "MODULE_CREW_QUARTERS_I"
  | "MODULE_ENVOY_QUARTERS_I"
  | "MODULE_PASSENGER_CABIN_I"
  | "MODULE_MICRO_REFINERY_I"
  | "MODULE_ORE_REFINERY_I"
  | "MODULE_FUEL_REFINERY_I"
  | "MODULE_SCIENCE_LAB_I"
  | "MODULE_JUMP_DRIVE_I"
  | "MODULE_JUMP_DRIVE_II"
  | "MODULE_JUMP_DRIVE_III"
  | "MODULE_WARP_DRIVE_I"
  | "MODULE_WARP_DRIVE_II"
  | "MODULE_WARP_DRIVE_III"
  | "MODULE_SHIELD_GENERATOR_I"
  | "MODULE_SHIELD_GENERATOR_II";

export type ShipModule = {
  symbol: ShipMountSymbol;
  capacity?: number;
  range?: number;
  name: string;
  description: string;
  requirements: ShipRequirements;
};

export type ShipEngineSymbol =
  | "ENGINE_IMPULSE_DRIVE_I"
  | "ENGINE_ION_DRIVE_I"
  | "ENGINE_ION_DRIVE_II"
  | "ENGINE_HYPER_DRIVE_I";

export type ShipEngine = {
  symbol: ShipEngineSymbol;
  name: string;
  description: string;
  condition?: number;
  speed: number;
  requirements: ShipRequirements;
};

export type ShipReactorSymbol =
  | "REACTOR_SOLAR_I"
  | "REACTOR_FUSION_I"
  | "REACTOR_FISSION_I"
  | "REACTOR_CHEMICAL_I"
  | "REACTOR_ANTIMATTER_I";

export type ShipReactor = {
  symbol: ShipReactorSymbol;
  name: string;
  description: string;
  condition?: number;
  powerOutput: number;
  requirements: ShipRequirements;
};

export type ShipFrameSymbol =
  | "FRAME_PROBE"
  | "FRAME_DRONE"
  | "FRAME_INTERCEPTOR"
  | "FRAME_RACER"
  | "FRAME_FIGHTER"
  | "FRAME_FRIGATE"
  | "FRAME_SHUTTLE"
  | "FRAME_EXPLORER"
  | "FRAME_MINER"
  | "FRAME_LIGHT_FREIGHTER"
  | "FRAME_HEAVY_FREIGHTER"
  | "FRAME_TRANSPORT"
  | "FRAME_DESTROYER"
  | "FRAME_CRUISER"
  | "FRAME_CARRIER";

export type ShipFrame = {
  symbol: ShipFrameSymbol;
  name: string;
  description: string;
  condition?: number;
  moduleSlots: number;
  mountingPoints: number;
  fuelCapacity: number;
  requirements: ShipRequirements;
};

export type ShipCrewRotation = "STRICT" | "RELAXED";

export type ShipCrew = {
  current: number;
  required: number;
  capacity: number;
  rotation: ShipCrewRotation;
  morale: number;
  wages: number;
};

export type ShipNavRouteWaypoint = {
  symbol: string;
  type: WaypointType;
  systemSymbol: string;
  x: number;
  y: number;
};

export type ShipNavRoute = {
  destination: ShipNavRouteWaypoint;
  departure: ShipNavRouteWaypoint;
  departureTime: string;
  arrival: string;
};

export type ShipNavStatus = "IN_TRANSIT" | "IN_ORBIT" | "DOCKED";

export type ShipNavFlightMode = "DRIFT" | "STEALTH" | "CRUISE" | "BURN";

export type ShipNav = {
  systemSymbol: string;
  waypointSymbol: string;
  route: ShipNavRoute;
  status: ShipNavStatus;
  flightMode: ShipNavFlightMode;
};

export type ShipRole =
  | "FABRICATOR"
  | "HARVESTER"
  | "HAULER"
  | "INTERCEPTOR"
  | "EXCAVATOR"
  | "TRANSPORT"
  | "REPAIR"
  | "SURVEYOR"
  | "COMMAND"
  | "CARRIER"
  | "PATROL"
  | "SATELLITE"
  | "EXPLORER"
  | "REFINERY";

export type ShipRegistration = {
  name: string;
  factionSymbol: string;
  role: ShipRole;
};

export type Ship = {
  symbol: string;
  registration: ShipRegistration;
  nav: ShipNav;
  crew: ShipCrew;
  frame: ShipFrame;
  reactor: ShipReactor;
  engine: ShipEngine;
  modules: ShipModule[];
  mounts: ShipMount[];
  cargo: ShipCargo;
  fuel: ShipFuel;
};

export type ScannedShip = {
  symbol: string;
  registration: ShipRegistration;
  nav: ShipNav;
  frame?: { symbol: string };
  reactor?: { symbol: string };
  engine: { symbol: string };
  mounts: { symbol: string }[];
};
