import type { Jsonifiable, RequireAtLeastOne } from "type-fest";
import type { Agent } from "./types/agent";
import type { Chart } from "./types/chart";
import type { Contract } from "./types/contract";
import type { Cooldown } from "./types/cooldown";
import type { Extraction } from "./types/extraction";
import type { Faction } from "./types/faction";
import type { JumpGate } from "./types/jump-gate";
import type { Market, MarketTransaction } from "./types/market";
import type { Meta } from "./types/meta";
import type {
  ScannedShip,
  Ship,
  ShipCargo,
  ShipFuel,
  ShipMount,
  ShipNav,
  ShipNavFlightMode,
  ShipType
} from "./types/ship";
import type { Shipyard, ShipyardTransaction } from "./types/shipyard";
import type { Survey } from "./types/survey";
import type { ScannedSystem, System } from "./types/system";
import type { TradeSymbol } from "./types/trade";
import type { ScannedWaypoint, Waypoint } from "./types/waypoint";

export class SpaceTraders {
  private accessToken?: string;

  private async request<T>({
    path,
    method,
    body
  }: {
    path: string;
    method?: string;
    body?: Jsonifiable;
  }) {
    const stringifiedBody = body !== undefined && JSON.stringify(body);
    const response = await fetch(`https://api.spacetraders.io/v2/${path}`, {
      ...(method && { method }),
      ...(stringifiedBody && { body: stringifiedBody }),
      headers: {
        Accept: "application/json",
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`
        }),
        ...(stringifiedBody && {
          "Content-Type": "application/json",
          "Content-Length": stringifiedBody.length.toString()
        })
      }
    });
    const result = (await response.json()) as unknown;
    if (!response.ok) {
      const { error } = result as { error: { message: string; code: number } };
      throw new SpaceTradersError(error.message, error.code);
    }
    return result as T;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAgent() {
    return this.request<{ data: Agent }>({
      path: "my/agent"
    });
  }

  listContracts(opts?: RequireAtLeastOne<{ limit: number; page: number }>) {
    return this.request<{ data: Contract[]; meta: Meta }>({
      path: opts
        ? `my/contracts?${Object.entries(opts)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`
        : "my/contracts"
    });
  }

  getContract(contractId: string) {
    return this.request<{ data: Contract }>({
      path: `my/contracts/${contractId}`
    });
  }

  acceptContract(contractId: string) {
    return this.request<{ data: { agent: Agent; contract: Contract } }>({
      path: `my/contracts/${contractId}/accept`,
      method: "POST"
    });
  }

  deliverCargoToContract(
    contractId: string,
    body: { shipSymbol: string; tradeSymbol: string; units: number }
  ) {
    return this.request<{ data: { contract: Contract; cargo: ShipCargo } }>({
      path: `my/contracts/${contractId}/deliver`,
      method: "POST",
      body
    });
  }

  fulfillContract(contractId: string) {
    return this.request<{ data: { agent: Agent; contract: Contract } }>({
      path: `my/contracts/${contractId}/fulfill`,
      method: "POST"
    });
  }

  listFactions(opts?: RequireAtLeastOne<{ limit: number; page: number }>) {
    return this.request<{ data: Faction[]; meta: Meta }>({
      path: opts
        ? `factions?${Object.entries(opts)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`
        : "factions"
    });
  }

  getFaction(factionSymbol: string) {
    return this.request<{ data: Faction }>({
      path: `factions/${factionSymbol}`
    });
  }

  listSystems(opts?: RequireAtLeastOne<{ limit: number; page: number }>) {
    return this.request<{ data: System[]; meta: Meta }>({
      path: opts
        ? `systems?${Object.entries(opts)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`
        : "systems"
    });
  }

  getSystem(systemSymbol: string) {
    return this.request<{ data: System }>({
      path: `systems/${systemSymbol}`
    });
  }

  listWaypointsInSystem(
    systemSymbol: string,
    opts?: RequireAtLeastOne<{ limit: number; page: number }>
  ) {
    return this.request<{ data: Waypoint[]; meta: Meta }>({
      path: opts
        ? `systems/${systemSymbol}/waypoints?${Object.entries(opts)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`
        : `systems/${systemSymbol}/waypoints`
    });
  }

  getWaypoint(systemSymbol: string, waypointSymbol: string) {
    return this.request<{ data: Waypoint }>({
      path: `systems/${systemSymbol}/waypoints/${waypointSymbol}`
    });
  }

  getMarket(systemSymbol: string, waypointSymbol: string) {
    return this.request<{ data: Market }>({
      path: `systems/${systemSymbol}/waypoints/${waypointSymbol}/market`
    });
  }

  getShipyard(systemSymbol: string, waypointSymbol: string) {
    return this.request<{ data: Shipyard }>({
      path: `systems/${systemSymbol}/waypoints/${waypointSymbol}/shipyard`
    });
  }

  getJumpGate(systemSymbol: string, waypointSymbol: string) {
    return this.request<{ data: JumpGate }>({
      path: `systems/${systemSymbol}/waypoints/${waypointSymbol}/jump-gate`
    });
  }

  listShips(opts?: RequireAtLeastOne<{ limit: number; page: number }>) {
    return this.request<{ data: Ship[]; meta: Meta }>({
      path: opts
        ? `my/ships?${Object.entries(opts)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`
        : "my/ships"
    });
  }

  purchaseShip(body: { shipType: ShipType; waypointSymbol: string }) {
    return this.request<{
      data: { agent: Agent; ship: Ship; transaction: ShipyardTransaction };
    }>({
      path: "my/ships",
      method: "POST",
      body
    });
  }

  getShip(shipSymbol: string) {
    return this.request<{ data: Ship }>({
      path: `my/ships/${shipSymbol}`
    });
  }

  getShipCargo(shipSymbol: string) {
    return this.request<{ data: ShipCargo }>({
      path: `my/ships/${shipSymbol}/cargo`
    });
  }

  orbitShip(shipSymbol: string) {
    return this.request<{ data: { nav: ShipNav } }>({
      path: `my/ships/${shipSymbol}/orbit`,
      method: "POST"
    });
  }

  shipRefine(
    shipSymbol: string,
    body: {
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
  ) {
    return this.request<{
      data: {
        cargo: ShipCargo;
        cooldown: Cooldown;
        produced: { tradeSymbol?: string; units?: number }[];
        consumed: { tradeSymbol?: string; units?: number }[];
      };
    }>({
      path: `my/ships/${shipSymbol}/refine`,
      method: "POST",
      body
    });
  }

  createChart(shipSymbol: string) {
    return this.request<{ data: { chart: Chart; waypoint: Waypoint } }>({
      path: `my/ships/${shipSymbol}/chart`,
      method: "POST"
    });
  }

  getShipCooldown(shipSymbol: string) {
    return this.request<{ data: Cooldown } | undefined>({
      path: `my/ships/${shipSymbol}/cooldown`
    });
  }

  dockShip(shipSymbol: string) {
    return this.request<{ data: { nav: ShipNav } }>({
      path: `my/ships/${shipSymbol}/dock`,
      method: "POST"
    });
  }

  createSurvey(shipSymbol: string) {
    return this.request<{ data: { cooldown: Cooldown; surveys: Survey[] } }>({
      path: `my/ships/${shipSymbol}/survey`,
      method: "POST"
    });
  }

  extractResources(shipSymbol: string, body: { survey: Survey }) {
    return this.request<{
      data: { cooldown: Cooldown; extraction: Extraction; cargo: ShipCargo };
    }>({
      path: `my/ships/${shipSymbol}/extract`,
      method: "POST",
      body
    });
  }

  jettisonCargo(
    shipSymbol: string,
    body: { symbol: TradeSymbol; units: number }
  ) {
    return this.request<{ data: { cargo: ShipCargo } }>({
      path: `my/ships/${shipSymbol}/jettison`,
      method: "POST",
      body
    });
  }

  jumpShip(shipSymbol: string, body: { systemSymbol: string }) {
    return this.request<{ data: { cooldown: Cooldown; nav: ShipNav } }>({
      path: `my/ships/${shipSymbol}/jump`,
      method: "POST",
      body
    });
  }

  navigateShip(shipSymbol: string, body: { waypointSymbol: string }) {
    return this.request<{ data: { fuel: ShipFuel; nav: ShipNav } }>({
      path: `my/ships/${shipSymbol}/navigate`,
      method: "POST",
      body
    });
  }

  patchShipNav(shipSymbol: string, body: { flightMode: ShipNavFlightMode }) {
    return this.request<{ data: ShipNav }>({
      path: `my/ships/${shipSymbol}/nav`,
      method: "PATCH",
      body
    });
  }

  getShipNav(shipSymbol: string) {
    return this.request<{ data: ShipNav }>({
      path: `my/ships/${shipSymbol}/nav`
    });
  }

  warpShip(shipSymbol: string, body: { waypointSymbol: string }) {
    return this.request<{ data: { fuel: ShipFuel; nav: ShipNav } }>({
      path: `my/ships/${shipSymbol}/warp`,
      method: "POST",
      body
    });
  }

  sellCargo(shipSymbol: string, body: { symbol: TradeSymbol; units: number }) {
    return this.request<{
      data: {
        agent: Agent;
        cargo: ShipCargo;
        transaction: MarketTransaction;
      };
    }>({
      path: `my/ships/${shipSymbol}/sell`,
      method: "POST",
      body
    });
  }

  scanSystems(shipSymbol: string) {
    return this.request<{
      data: { cooldown: Cooldown; systems: ScannedSystem[] };
    }>({
      path: `my/ships/${shipSymbol}/scan/systems`,
      method: "POST"
    });
  }

  scanWaypoints(shipSymbol: string) {
    return this.request<{
      data: { cooldown: Cooldown; waypoints: ScannedWaypoint[] };
    }>({
      path: `my/ships/${shipSymbol}/scan/waypoints`,
      method: "POST"
    });
  }

  scanShips(shipSymbol: string) {
    return this.request<{ data: { cooldown: Cooldown; ships: ScannedShip[] } }>(
      {
        path: `my/ships/${shipSymbol}/scan/ships`,
        method: "POST"
      }
    );
  }

  refuelShip(shipSymbol: string) {
    return this.request<{
      data: { agent: Agent; fuel: ShipFuel; transaction: MarketTransaction };
    }>({
      path: `my/ships/${shipSymbol}/refuel`,
      method: "POST"
    });
  }

  purchaseCargo(
    shipSymbol: string,
    body: { symbol: TradeSymbol; units: number }
  ) {
    return this.request<{
      data: {
        agent: Agent;
        cargo: ShipCargo;
        transaction: MarketTransaction;
      };
    }>({
      path: `my/ships/${shipSymbol}/purchase`,
      method: "POST",
      body
    });
  }

  transferCargo(
    shipSymbol: string,
    body: { tradeSymbol: TradeSymbol; units: number; shipSymbol: string }
  ) {
    return this.request<{ data: { cargo: ShipCargo } }>({
      path: `my/ships/${shipSymbol}/transfer`,
      method: "POST",
      body
    });
  }

  negotiateContract(shipSymbol: string) {
    return this.request<{ data: { contract: Contract } }>({
      path: `my/ships/${shipSymbol}/negotiate/contract`,
      method: "POST"
    });
  }

  getMounts(shipSymbol: string) {
    return this.request<{ data: ShipMount[] }>({
      path: `my/ships/${shipSymbol}/mounts`
    });
  }

  installMount(shipSymbol: string, body: { symbol: string }) {
    return this.request<{
      data: {
        agent: Agent;
        mounts: ShipMount[];
        cargo: ShipCargo;
        transaction: ShipyardTransaction;
      };
    }>({
      path: `my/ships/${shipSymbol}/mounts/install`,
      method: "POST",
      body
    });
  }

  removeMount(shipSymbol: string, body: { symbol: string }) {
    return this.request<{
      data: {
        agent: Agent;
        mounts: ShipMount[];
        cargo: ShipCargo;
        transaction: ShipyardTransaction;
      };
    }>({
      path: `my/ships/${shipSymbol}/mounts/remove`,
      method: "POST",
      body
    });
  }
}
