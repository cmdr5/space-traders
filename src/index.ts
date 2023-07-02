import type {
  HasRequiredKeys,
  IsEmptyObject,
  JsonValue,
  Jsonifiable
} from "type-fest";
import type { Agent } from "./types/agent";
import type { Chart } from "./types/chart";
import type { Contract } from "./types/contract";
import type { Cooldown } from "./types/cooldown";
import type { Extraction } from "./types/extraction";
import type { MarketTransaction } from "./types/market";
import type { PaginationMeta } from "./types/pagination";
import {
  ShipNavFlightMode,
  ShipType,
  type ScannedShip,
  type Ship,
  type ShipCargo,
  type ShipFuel,
  type ShipModificationTransaction,
  type ShipMount,
  type ShipNav
} from "./types/ship";
import type { ShipyardTransaction } from "./types/shipyard";
import type { Survey } from "./types/survey";
import type { ScannedSystem } from "./types/system";
import { TradeSymbol } from "./types/trade";
import type { ScannedWaypoint, Waypoint } from "./types/waypoint";

export enum ContractRequest {
  Get = "GET|",
  Accept = "POST|accept",
  DeliverCargo = "POST|deliver",
  Fulfill = "POST|fulfill"
}

export type ContractRequestBody<T extends ContractRequest> =
  T extends ContractRequest.DeliverCargo
    ? { shipSymbol: string; tradeSymbol: string; units: number }
    : {};

export type ContractResponse<T extends ContractRequest> = T extends
  | ContractRequest.Accept
  | ContractRequest.Fulfill
  ? { data: { agent: Agent; contract: Contract } }
  : T extends ContractRequest.DeliverCargo
  ? { data: { contract: Contract; cargo: ShipCargo } }
  : // ContractRequest.Get
    { data: Contract };

export enum ShipsRequest {
  Get = "GET",
  Purchase = "POST"
}

export type ShipsRequestBody<T extends ShipsRequest> =
  T extends ShipsRequest.Purchase
    ? { shipType: ShipType; waypointSymbol: string }
    : {};

export type ShipsResponse<T extends ShipsRequest> =
  T extends ShipsRequest.Purchase
    ? { data: { agent: Agent; ship: Ship; transaction: ShipyardTransaction } }
    : // ShipsRequest.Get
      { data: Ship[]; meta: PaginationMeta };

export enum ShipRequest {
  Get = "GET|",
  GetCooldown = "GET|cooldown",
  GetCargo = "GET|cargo",
  GetNav = "GET|nav",
  GetMounts = "GET|mounts",
  PatchNav = "PATCH|nav",
  Refine = "POST|refine",
  CreateChart = "POST|chart",
  Survey = "POST|survey",
  ExtractResources = "POST|extract",
  JettisonCargo = "POST|jettison",
  SellCargo = "POST|sell",
  PurchaseCargo = "POST|purchase",
  TransferCargo = "POST|transfer",
  Jump = "POST|jump",
  Refuel = "POST|refuel",
  NegotiateContract = "POST|negotiate/contract",
  Dock = "POST|dock",
  Orbit = "POST|orbit",
  Warp = "POST|warp",
  Navigate = "POST|navigate",
  ScanShips = "POST|scan/ships",
  ScanSystems = "POST|scan/systems",
  ScanWaypoints = "POST|scan/waypoints",
  InstallMount = "POST|mounts/install",
  RemoveMount = "POST|mounts/remove"
}

export type ShipRequestBody<T extends ShipRequest> =
  T extends ShipRequest.PatchNav
    ? { flightMode?: ShipNavFlightMode }
    : T extends ShipRequest.Refine
    ? {
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
    : T extends ShipRequest.ExtractResources
    ? { survey?: Survey }
    : T extends
        | ShipRequest.JettisonCargo
        | ShipRequest.SellCargo
        | ShipRequest.PurchaseCargo
    ? { symbol: TradeSymbol; units: number }
    : T extends ShipRequest.TransferCargo
    ? { tradeSymbol: TradeSymbol; units: number; shipSymbol: string }
    : T extends ShipRequest.Jump
    ? { systemSymbol: string }
    : T extends ShipRequest.Refuel
    ? { units?: number }
    : T extends ShipRequest.Warp | ShipRequest.Navigate
    ? { waypointSymbol: string }
    : T extends ShipRequest.InstallMount | ShipRequest.RemoveMount
    ? { symbol: string }
    : {};

export type ShipResponse<T extends ShipRequest> =
  T extends ShipRequest.GetCooldown
    ? { data: Cooldown } | undefined
    : T extends ShipRequest.GetCargo
    ? { data: ShipCargo }
    : T extends ShipRequest.GetNav
    ? { data: ShipNav }
    : T extends ShipRequest.GetMounts
    ? { data: ShipMount[] }
    : T extends ShipRequest.PatchNav
    ? { data: ShipNav }
    : T extends ShipRequest.Refine
    ? {
        data: {
          cargo: ShipCargo;
          cooldown: Cooldown;
          produced: { tradeSymbol: string; units: number }[];
          consumed: { tradeSymbol: string; units: number }[];
        };
      }
    : T extends ShipRequest.CreateChart
    ? { data: { chart: Chart; waypoint: Waypoint } }
    : T extends ShipRequest.Survey
    ? { data: { cooldown: Cooldown; surveys: Survey[] } }
    : T extends ShipRequest.ExtractResources
    ? { data: { cooldown: Cooldown; extraction: Extraction; cargo: ShipCargo } }
    : T extends ShipRequest.JettisonCargo | ShipRequest.TransferCargo
    ? { data: { cargo: ShipCargo } }
    : T extends ShipRequest.SellCargo | ShipRequest.PurchaseCargo
    ? {
        data: {
          agent: Agent;
          cargo: ShipCargo;
          transaction: MarketTransaction;
        };
      }
    : T extends ShipRequest.Jump
    ? { data: { cooldown: Cooldown; nav: ShipNav } }
    : T extends ShipRequest.Refuel
    ? { data: { agent: Agent; fuel: ShipFuel; transaction: MarketTransaction } }
    : T extends ShipRequest.NegotiateContract
    ? { data: { contract: Contract } }
    : T extends ShipRequest.Dock | ShipRequest.Orbit
    ? { data: { nav: ShipNav } }
    : T extends ShipRequest.Warp | ShipRequest.Navigate
    ? { data: { fuel: ShipFuel; nav: ShipNav } }
    : T extends ShipRequest.ScanShips
    ? { data: { cooldown: Cooldown; ships: ScannedShip[] } }
    : T extends ShipRequest.ScanSystems
    ? { data: { cooldown: Cooldown; systems: ScannedSystem[] } }
    : T extends ShipRequest.ScanWaypoints
    ? { data: { cooldown: Cooldown; waypoints: ScannedWaypoint[] } }
    : T extends ShipRequest.InstallMount | ShipRequest.RemoveMount
    ? {
        data: {
          agent: Agent;
          mounts: ShipMount[];
          cargo: ShipCargo;
          transaction: ShipModificationTransaction;
        };
      }
    : // ShipRequest.Get
      { data: Ship };

type ErrorData = { code: number; data?: JsonValue; message: string };
export type ErrorResponse = { error: ErrorData };

export interface SpaceTradersError extends ErrorData {}
export class SpaceTradersError extends Error {
  constructor({ code, data, message }: ErrorData) {
    super(message);
    this.name = "SpaceTradersError";
    this.code = code;
    if (data !== undefined) this.data = data;
  }
}

type BodyArg<T extends object> = IsEmptyObject<T> extends true
  ? [undefined?]
  : HasRequiredKeys<T> extends true
  ? [T]
  : [T] | [undefined?];

export class SpaceTradersAPI {
  private accessToken?: string | undefined;
  private async request<T>({
    path,
    method,
    json
  }: {
    path: string;
    method?: string;
    json?: Jsonifiable;
  }) {
    const body = json ? JSON.stringify(json) : undefined;
    const response = await fetch(`https://api.spacetraders.io/v2/${path}`, {
      ...(method ? { method } : {}),
      ...(body ? { body } : {}),
      headers: new Headers({
        accept: "application/json",
        ...(body
          ? {
              "content-type": "application/json",
              "content-length": body.length.toString()
            }
          : {}),
        ...(this.accessToken
          ? { authorization: `Bearer ${this.accessToken}` }
          : {})
      })
    });
    let result!: T | ErrorResponse;
    try {
      result = await response.json();
    } catch (_) {}
    if (result != null && typeof result === "object" && "error" in result)
      throw new SpaceTradersError(result.error);
    if (!response.ok) throw new Error("");
    return result;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  async ships<T extends ShipsRequest>(
    type: T,
    ...json: BodyArg<ShipsRequestBody<T>>
  ) {
    return this.request<ShipsResponse<T>>({
      path: "my/ships",
      method: type,
      ...(json[0] ? { json: json[0] } : {})
    });
  }

  async ship<T extends ShipRequest>(
    shipSymbol: string,
    type: T,
    ...json: BodyArg<ShipRequestBody<T>>
  ) {
    const [method, segment] = type.split("|") as [string, string];
    return this.request<ShipResponse<T>>({
      path: `my/ships/${shipSymbol}/${segment}`,
      method,
      ...(json[0] ? { json: json[0] } : {})
    });
  }

  async contract<T extends ContractRequest>(
    contractId: string,
    type: T,
    ...json: BodyArg<ContractRequestBody<T>>
  ) {
    const [method, segment] = type.split("|") as [string, string];
    return this.request<ContractResponse<T>>({
      path: `my/contracts/${contractId}/${segment}`,
      method,
      ...(json[0] ? { json: json[0] } : {})
    });
  }
}
