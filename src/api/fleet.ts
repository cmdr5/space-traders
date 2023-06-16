import type { RequireAtLeastOne } from "type-fest";
import type { Agent } from "../types/agent.js";
import type { Chart } from "../types/chart.js";
import type { Contract } from "../types/contract.js";
import type { Cooldown } from "../types/cooldown.js";
import type { Extraction } from "../types/extraction.js";
import type { MarketTransaction } from "../types/market.js";
import type { Meta } from "../types/meta.js";
import type {
  ScannedShip,
  Ship,
  ShipCargo,
  ShipFuel,
  ShipMount,
  ShipNav,
  ShipNavFlightMode,
  ShipType
} from "../types/ship.js";
import type { ShipyardTransaction } from "../types/shipyard.js";
import type { Survey } from "../types/survey.js";
import type { ScannedSystem } from "../types/system.js";
import type { TradeSymbol } from "../types/trade.js";
import type { ScannedWaypoint, Waypoint } from "../types/waypoint.js";
import { api } from "../utils/index.js";

export const listShips = (
  searchParams?: RequireAtLeastOne<{ limit: number; page: number }>
) => api.get("my/ships", { searchParams }).json<{ data: Ship[]; meta: Meta }>();

export const purchaseShip = (json: {
  shipType: ShipType;
  waypointSymbol: string;
}) =>
  api.post("my/ships", { json }).json<{
    data: { agent: Agent; ship: Ship; transaction: ShipyardTransaction };
  }>();

export const getShip = (shipSymbol: string) =>
  api.get(`my/ships/${shipSymbol}`).json<{ data: Ship }>();

export const getShipCargo = (shipSymbol: string) =>
  api.get(`my/ships/${shipSymbol}/cargo`).json<{ data: ShipCargo }>();

export const orbitShip = (shipSymbol: string) =>
  api.post(`my/ships/${shipSymbol}/orbit`).json<{ data: { nav: ShipNav } }>();

export const shipRefine = (
  shipSymbol: string,
  json: {
    produce:
      | TradeSymbol.Iron
      | TradeSymbol.Copper
      | TradeSymbol.Silver
      | TradeSymbol.Gold
      | TradeSymbol.Aluminum
      | TradeSymbol.Platinum
      | TradeSymbol.Uranite
      | TradeSymbol.Meritium
      | TradeSymbol.Fuel;
  }
) =>
  api.post(`my/ships/${shipSymbol}/refine`, { json }).json<{
    data: {
      cargo: ShipCargo;
      cooldown: Cooldown;
      produced: { tradeSymbol?: string; units?: number }[];
      consumed: { tradeSymbol?: string; units?: number }[];
    };
  }>();

export const createChart = (shipSymbol: string) =>
  api
    .post(`my/ships/${shipSymbol}/chart`)
    .json<{ data: { chart: Chart; waypoint: Waypoint } }>();

export const getShipCooldown = (shipSymbol: string) =>
  api
    .get(`my/ships/${shipSymbol}/cooldown`)
    .json<{ data: Cooldown } | undefined>();

export const dockShip = (shipSymbol: string) =>
  api.post(`my/ships/${shipSymbol}/dock`).json<{ data: { nav: ShipNav } }>();

export const createSurvey = (shipSymbol: string) =>
  api
    .post(`my/ships/${shipSymbol}/survey`)
    .json<{ data: { cooldown: Cooldown; surveys: Survey[] } }>();

export const extractResources = (
  shipSymbol: string,
  json: { survey: Survey }
) =>
  api.post(`my/ships/${shipSymbol}/extract`, { json }).json<{
    data: { cooldown: Cooldown; extraction: Extraction; cargo: ShipCargo };
  }>();

export const jettisonCargo = (
  shipSymbol: string,
  json: { symbol: TradeSymbol; units: number }
) =>
  api
    .post(`my/ships/${shipSymbol}/jettison`, { json })
    .json<{ data: { cargo: ShipCargo } }>();

export const jumpShip = (shipSymbol: string, json: { systemSymbol: string }) =>
  api
    .post(`my/ships/${shipSymbol}/jump`, { json })
    .json<{ data: { cooldown: Cooldown; nav: ShipNav } }>();

export const navigateShip = (
  shipSymbol: string,
  json: { waypointSymbol: string }
) =>
  api
    .post(`my/ships/${shipSymbol}/navigate`, { json })
    .json<{ data: { fuel: ShipFuel; nav: ShipNav } }>();

export const patchShipNav = (
  shipSymbol: string,
  json: { flightMode: ShipNavFlightMode }
) =>
  api.patch(`my/ships/${shipSymbol}/nav`, { json }).json<{ data: ShipNav }>();

export const getShipNav = (shipSymbol: string) =>
  api.get(`my/ships/${shipSymbol}/nav`).json<{ data: ShipNav }>();

export const warpShip = (
  shipSymbol: string,
  json: { waypointSymbol: string }
) =>
  api
    .post(`my/ships/${shipSymbol}/warp`, { json })
    .json<{ data: { fuel: ShipFuel; nav: ShipNav } }>();

export const sellCargo = (
  shipSymbol: string,
  json: { symbol: TradeSymbol; units: number }
) =>
  api.post(`my/ships/${shipSymbol}/sell`, { json }).json<{
    data: {
      agent: Agent;
      cargo: ShipCargo;
      transaction: MarketTransaction;
    };
  }>();

export const scanSystems = (shipSymbol: string) =>
  api
    .post(`my/ships/${shipSymbol}/scan/systems`)
    .json<{ data: { cooldown: Cooldown; systems: ScannedSystem[] } }>();

export const scanWaypoints = (shipSymbol: string) =>
  api
    .post(`my/ships/${shipSymbol}/scan/waypoints`)
    .json<{ data: { cooldown: Cooldown; waypoints: ScannedWaypoint[] } }>();

export const scanShips = (shipSymbol: string) =>
  api
    .post(`my/ships/${shipSymbol}/scan/ships`)
    .json<{ data: { cooldown: Cooldown; ships: ScannedShip[] } }>();

export const refuelShip = (shipSymbol: string) =>
  api.post(`my/ships/${shipSymbol}/refuel`).json<{
    data: {
      agent: Agent;
      fuel: ShipFuel;
      transaction: MarketTransaction;
    };
  }>();

export const purchaseCargo = (
  shipSymbol: string,
  json: { symbol: TradeSymbol; units: number }
) =>
  api.post(`my/ships/${shipSymbol}/purchase`, { json }).json<{
    data: {
      agent: Agent;
      cargo: ShipCargo;
      transaction: MarketTransaction;
    };
  }>();

export const transferCargo = (
  shipSymbol: string,
  json: { tradeSymbol: TradeSymbol; units: number; shipSymbol: string }
) =>
  api
    .post(`my/ships/${shipSymbol}/transfer`, { json })
    .json<{ data: { cargo: ShipCargo } }>();

export const negotiateContract = (shipSymbol: string) =>
  api
    .post(`my/ships/${shipSymbol}/negotiate/contract`)
    .json<{ data: { contract: Contract } }>();

export const getMounts = (shipSymbol: string) =>
  api.get(`my/ships/${shipSymbol}/mounts`).json<{ data: ShipMount[] }>();

export const installMount = (shipSymbol: string, json: { symbol: string }) =>
  api.post(`my/ships/${shipSymbol}/mounts/install`, { json }).json<{
    data: {
      agent: Agent;
      mounts: ShipMount[];
      cargo: ShipCargo;
      transaction: ShipyardTransaction;
    };
  }>();

export const removeMount = (shipSymbol: string, json: { symbol: string }) =>
  api.post(`my/ships/${shipSymbol}/mounts/remove`, { json }).json<{
    data: {
      agent: Agent;
      mounts: ShipMount[];
      cargo: ShipCargo;
      transaction: ShipyardTransaction;
    };
  }>();
