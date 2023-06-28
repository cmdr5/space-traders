import type { TradeSymbol } from "./trade.js";
import type { WaypointType } from "./waypoint.js";

export enum ShipType {
  Probe = "SHIP_PROBE",
  MiningDrone = "SHIP_MINING_DRONE",
  Interceptor = "SHIP_INTERCEPTOR",
  LightHauler = "SHIP_LIGHT_HAULER",
  CommandFrigate = "SHIP_COMMAND_FRIGATE",
  Explorer = "SHIP_EXPLORER",
  HeavyFreighter = "SHIP_HEAVY_FREIGHTER",
  LightShuttle = "SHIP_LIGHT_SHUTTLE",
  OreHound = "SHIP_ORE_HOUND",
  RefiningFreighter = "SHIP_REFINING_FREIGHTER"
}

export enum ShipRole {
  Fabricator = "FABRICATOR",
  Harvester = "HARVESTER",
  Hauler = "HAULER",
  Interceptor = "INTERCEPTOR",
  Excavator = "EXCAVATOR",
  Transport = "TRANSPORT",
  Repair = "REPAIR",
  Surveyor = "SURVEYOR",
  Command = "COMMAND",
  Carrier = "CARRIER",
  Patrol = "PATROL",
  Satellite = "SATELLITE",
  Explorer = "EXPLORER",
  Refinery = "REFINERY"
}

export type ShipRegistration = {
  name: string;
  factionSymbol: string;
  role: ShipRole;
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

export enum ShipNavStatus {
  InTransit = "IN_TRANSIT",
  InOrbit = "IN_ORBIT",
  Docked = "DOCKED"
}

export enum ShipNavFlightMode {
  Drift = "DRIFT",
  Stealth = "STEALTH",
  Cruise = "CRUISE",
  Burn = "BURN"
}

export type ShipNav = {
  systemSymbol: string;
  waypointSymbol: string;
  route: ShipNavRoute;
  status: ShipNavStatus;
  flightMode: ShipNavFlightMode;
};

export type ShipCrew = {
  current: number;
  required: number;
  capacity: number;
  rotation: "STRICT" | "RELAXED";
  morale: number;
  wages: number;
};

export type ShipRequirements = {
  power?: number;
  crew?: number;
  slots?: number;
};

export type ShipCondition = number;

export type ShipFrame = {
  symbol:
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
  name: string;
  description: string;
  condition?: ShipCondition;
  moduleSlots: number;
  mountingPoints: number;
  fuelCapacity: number;
  requirements: ShipRequirements;
};

export type ShipReactor = {
  symbol:
    | TradeSymbol.ReactorSolarI
    | TradeSymbol.ReactorFusionI
    | TradeSymbol.ReactorFissionI
    | TradeSymbol.ReactorChemicalI
    | TradeSymbol.ReactorAntimatterI;
  name: string;
  description: string;
  condition?: ShipCondition;
  powerOutput: number;
  requirements: ShipRequirements;
};

export type ShipEngine = {
  symbol:
    | TradeSymbol.EngineImpulseDriveI
    | TradeSymbol.EngineIonDriveI
    | TradeSymbol.EngineIonDriveII
    | TradeSymbol.EngineHyperDriveI;
  name: string;
  description: string;
  condition?: ShipCondition;
  speed: number;
  requirements: ShipRequirements;
};

export type ShipModule = {
  symbol:
    | TradeSymbol.ModuleMineralProcessorI
    | TradeSymbol.ModuleCargoHoldI
    | TradeSymbol.ModuleCrewQuartersI
    | TradeSymbol.ModuleEnvoyQuartersI
    | TradeSymbol.ModulePassengerCabinI
    | TradeSymbol.ModuleMicroRefineryI
    | TradeSymbol.ModuleOreRefineryI
    | TradeSymbol.ModuleFuelRefineryI
    | TradeSymbol.ModuleScienceLabI
    | TradeSymbol.ModuleJumpDriveI
    | TradeSymbol.ModuleJumpDriveII
    | TradeSymbol.ModuleJumpDriveIII
    | TradeSymbol.ModuleWarpDriveI
    | TradeSymbol.ModuleWarpDriveII
    | TradeSymbol.ModuleWarpDriveIII
    | TradeSymbol.ModuleShieldGeneratorI
    | TradeSymbol.ModuleShieldGeneratorII;
  capacity?: number;
  range?: number;
  name: string;
  description: string;
  requirements: ShipRequirements;
};

export type ShipMount = {
  symbol:
    | TradeSymbol.MountGasSiphonI
    | TradeSymbol.MountGasSiphonII
    | TradeSymbol.MountGasSiphonIII
    | TradeSymbol.MountSurveyorI
    | TradeSymbol.MountSurveyorII
    | TradeSymbol.MountSurveyorIII
    | TradeSymbol.MountSensorArrayI
    | TradeSymbol.MountSensorArrayII
    | TradeSymbol.MountSensorArrayIII
    | TradeSymbol.MountMiningLaserI
    | TradeSymbol.MountMiningLaserII
    | TradeSymbol.MountMiningLaserIII
    | TradeSymbol.MountLaserCannonI
    | TradeSymbol.MountMissileLauncherI
    | TradeSymbol.MountTurretI;
  name: string;
  description?: string;
  strength?: number;
  deposits?: (
    | TradeSymbol.QuartzSand
    | TradeSymbol.SiliconCrystals
    | TradeSymbol.PreciousStones
    | TradeSymbol.IceWater
    | TradeSymbol.AmmoniaIce
    | TradeSymbol.IronOre
    | TradeSymbol.CopperOre
    | TradeSymbol.SilverOre
    | TradeSymbol.AluminumOre
    | TradeSymbol.GoldOre
    | TradeSymbol.PlatinumOre
    | TradeSymbol.Diamonds
    | TradeSymbol.UraniteOre
    | TradeSymbol.MeritiumOre
  )[];
  requirements: ShipRequirements;
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

export type ShipFuel = {
  current: number;
  capacity: number;
  consumed?: {
    amount: number;
    timestamp: string;
  };
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
  mounts?: { symbol: string }[];
};

export type ShipModificationTransaction = {
  waypointSymbol: string;
  shipSymbol: string;
  tradeSymbol: string;
  totalPrice: number;
  timestamp: string;
};
