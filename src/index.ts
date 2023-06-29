import create, { type EtaResponse } from "@cmdr5/eta";
import type { JsonValue } from "type-fest";
import type { Agent } from "./types/agent";
import type { Chart } from "./types/chart";
import type { Contract } from "./types/contract";
import type { Cooldown } from "./types/cooldown";
import type { Extraction } from "./types/extraction";
import type { MarketTransaction } from "./types/market";
import type { PaginationMeta, PaginationOptions } from "./types/pagination";
import type {
  ScannedShip,
  Ship,
  ShipCargo,
  ShipFuel,
  ShipModificationTransaction,
  ShipMount,
  ShipNav,
  ShipNavFlightMode
} from "./types/ship";
import type { Survey } from "./types/survey";
import type { ScannedSystem } from "./types/system";
import type { TradeSymbol } from "./types/trade";
import type { ScannedWaypoint, Waypoint } from "./types/waypoint";

type ErrorData = {
  code: number;
  data?: JsonValue;
  message: string;
};

type OkResponse<T = unknown> = { data: T };
type ErrorResponse = { error: ErrorData };

export interface SpaceTradersError extends ErrorData {}
export class SpaceTradersError extends Error {
  constructor({ code, data, message }: ErrorData) {
    super(message);
    this.name = "SpaceTradersError";
    this.code = code;
    if (data) this.data = data;
  }
}

export const start = async (accessToken: string) => {
  const api = create({
    baseURL: "https://api.spacetraders.io/v2",
    headers: { Authorization: `Bearer ${accessToken}` },
    responseType: "json",
    hooks: {
      afterResponse: [
        (res: EtaResponse<OkResponse | ErrorResponse | undefined>) => {
          if (res.data !== undefined && "error" in res.data)
            throw new SpaceTradersError(res.data.error);
        }
      ]
    }
  });

  const wrapContract = (c: Contract) => {
    const acceptOrFulfill = async (
      type: "accept" | "fulfill",
      contract: Contract
    ) => {
      const { agent: _agent, contract: _contract } = (
        await api.post<{ data: { agent: Agent; contract: Contract } }>(
          `my/contracts/${contract.id}/${type}`
        )
      ).data.data;
      Object.assign(agent, _agent);
      Object.assign(contract, _contract);
    };

    return {
      ...c,
      accept() {
        return acceptOrFulfill("accept", this);
      },
      async deliverCargo(json: {
        shipSymbol: string;
        tradeSymbol: string;
        units: number;
      }) {
        const { contract, cargo } = (
          await api.post<{ data: { contract: Contract; cargo: ShipCargo } }>(
            `my/contracts/${this.id}/deliver`,
            { json }
          )
        ).data.data;
        Object.assign(this, contract);
        ships.get(json.shipSymbol)!.cargo = cargo;
      },
      async fulfill() {
        return acceptOrFulfill("fulfill", this);
      }
    };
  };

  const getAll = async <T>(path: string, opts = {} as PaginationOptions) => {
    if (opts.limit === undefined) opts.limit = 20;
    if (opts.page === undefined) opts.page = 1;

    let total = 1,
      fetched = 0;

    const items: T[] = [];

    while (fetched !== total) {
      const { data, meta } = (
        await api.get<{ data: T[]; meta: PaginationMeta }>(
          `${path}?limit=${opts.limit}&page=${opts.page}`
        )
      ).data;
      total = meta.total;
      fetched += data.length;
      items.push(...data);
      opts.page++;
    }

    return items;
  };

  const getCooldownPromise = (cooldown?: Cooldown) =>
    new Promise<void>((resolve) =>
      setTimeout(resolve, (cooldown?.remainingSeconds ?? 0) * 1000)
    );

  const agent = (await api.get<Agent>("my/agent")).data;

  const contracts = new Map(
    (await getAll<Contract>("my/contracts")).map((contract) => [
      contract.id,
      wrapContract(contract)
    ])
  );

  const ships = new Map(
    (
      await Promise.all(
        (
          await getAll<Ship>("my/ships")
        ).map(
          async (ship) =>
            [
              ship,
              (
                await api.get<{ data: Cooldown } | undefined>(
                  `my/ships/${ship.symbol}/cooldown`
                )
              ).data?.data
            ] as const
        )
      )
    ).map(([ship, cooldown]) => {
      const dockOrOrbit = async (type: "dock" | "orbit", obj: Ship) => {
        Object.assign(
          obj,
          (
            await api.post<{ data: { nav: ShipNav } }>(
              `my/ships/${obj.symbol}/${type}`
            )
          ).data.data
        );
      };

      const warpOrNavigate = async (
        type: "warp" | "navigate",
        obj: Ship,
        waypointSymbol: string
      ) => {
        Object.assign(
          obj,
          (
            await api.post<{ data: { fuel: ShipFuel; nav: ShipNav } }>(
              `my/ships/${obj.symbol}/${type}`,
              { json: { waypointSymbol } }
            )
          ).data.data
        );
      };

      const installOrRemoveMount = async (
        type: "install" | "remove",
        obj: Ship,
        symbol: string
      ) => {
        const {
          agent: _agent,
          mounts,
          cargo,
          transaction
        } = (
          await api.post<{
            data: {
              agent: Agent;
              mounts: ShipMount[];
              cargo: ShipCargo;
              transaction: ShipModificationTransaction;
            };
          }>(`my/ships/${obj.symbol}/mounts/${type}`, {
            json: { symbol }
          })
        ).data.data;
        Object.assign(agent, _agent);
        Object.assign(obj, { mounts, cargo });
        return transaction;
      };

      const purchaseOrSellCargo = async (
        type: "purchase" | "sell",
        obj: Ship,
        json: { symbol: TradeSymbol; units: number }
      ) => {
        const {
          agent: _agent,
          cargo,
          transaction
        } = (
          await api.post<{
            data: {
              agent: Agent;
              cargo: ShipCargo;
              transaction: MarketTransaction;
            };
          }>(`my/ships/${obj.symbol}/${type}`, { json })
        ).data.data;
        Object.assign(agent, _agent);
        obj.cargo = cargo;
        return transaction;
      };

      const scan = async <T extends "ships" | "systems" | "waypoints">(
        type: T,
        obj: Ship & { cooldown: Promise<void> }
      ) => {
        const { data } = (
          await api.post<{
            data: { cooldown: Cooldown } & {
              ships: ScannedShip[];
              systems: ScannedSystem[];
              waypoints: ScannedWaypoint[];
            };
          }>(`my/ships/${obj.symbol}/scan/${type}`)
        ).data;
        obj.cooldown = getCooldownPromise(data.cooldown);
        return data[type];
      };

      return [
        ship.symbol,
        {
          ...ship,
          cooldown: getCooldownPromise(cooldown),
          orbit() {
            return dockOrOrbit("orbit", this);
          },
          async refine(
            produce:
              | TradeSymbol.Iron
              | TradeSymbol.Copper
              | TradeSymbol.Silver
              | TradeSymbol.Gold
              | TradeSymbol.Aluminum
              | TradeSymbol.Platinum
              | TradeSymbol.Uranite
              | TradeSymbol.Meritium
              | TradeSymbol.Fuel
          ) {
            const { cargo, cooldown, produced, consumed } = (
              await api.post<{
                cargo: ShipCargo;
                cooldown: Cooldown;
                produced: { tradeSymbol: string; units: number }[];
                consumed: { tradeSymbol: string; units: number }[];
              }>(`my/ships/${this.symbol}/refine`, { json: { produce } })
            ).data;
            this.cargo = cargo;
            this.cooldown = getCooldownPromise(cooldown);
            return { produced, consumed };
          },
          async chart() {
            return (
              await api.post<{ data: { chart: Chart; waypoint: Waypoint } }>(
                `my/ships/${this.symbol}/chart`
              )
            ).data.data;
          },
          async dock() {
            return dockOrOrbit("dock", this);
          },
          async survey() {
            const { cooldown, surveys } = (
              await api.post<{
                data: { cooldown: Cooldown; surveys: Survey[] };
              }>(`my/ships/${this.symbol}/survey`)
            ).data.data;
            this.cooldown = getCooldownPromise(cooldown);
            return surveys;
          },
          async extractResources(survey?: Survey) {
            const { cooldown, extraction, cargo } = (
              await api.post<{
                data: {
                  cooldown: Cooldown;
                  extraction: Extraction;
                  cargo: ShipCargo;
                };
              }>(
                `my/ships/${this.symbol}/extract`,
                survey ? { json: { survey } } : {}
              )
            ).data.data;
            this.cooldown = getCooldownPromise(cooldown);
            this.cargo = cargo;
            return extraction.yield;
          },
          async jettisonCargo(symbol: TradeSymbol, units: number) {
            Object.assign(
              this,
              (
                await api.post<{ data: { cargo: ShipCargo } }>(
                  `my/ships/${this.symbol}/jettison`,
                  { json: { symbol, units } }
                )
              ).data.data
            );
          },
          async jump(systemSymbol: string) {
            const { cooldown, nav } = (
              await api.post<{ data: { cooldown: Cooldown; nav: ShipNav } }>(
                `my/ships/${this.symbol}/jump`,
                { json: { systemSymbol } }
              )
            ).data.data;
            this.cooldown = getCooldownPromise(cooldown);
            this.nav = nav;
          },
          navigate(waypointSymbol: string) {
            return warpOrNavigate("navigate", this, waypointSymbol);
          },
          async patchNav(nav: { flightMode: ShipNavFlightMode }) {
            this.nav = (
              await api.patch<{ data: ShipNav }>(
                `my/ships/${this.symbol}/nav`,
                { json: { ...nav } }
              )
            ).data.data;
          },
          warp(waypointSymbol: string) {
            return warpOrNavigate("warp", this, waypointSymbol);
          },
          sellCargo(symbol: TradeSymbol, units: number) {
            return purchaseOrSellCargo("sell", this, { symbol, units });
          },
          scanSystems() {
            return scan("systems", this);
          },
          scanWaypoints() {
            return scan("waypoints", this);
          },
          scanShips() {
            return scan("ships", this);
          },
          async refuel(units?: number) {
            const {
              agent: _agent,
              fuel,
              transaction
            } = (
              await api.post<{
                data: {
                  agent: Agent;
                  fuel: ShipFuel;
                  transaction: MarketTransaction;
                };
              }>(
                `my/ships/${this.symbol}/refuel`,
                units !== undefined ? { json: { units } } : {}
              )
            ).data.data;
            Object.assign(agent, _agent);
            this.fuel = fuel;
            return transaction;
          },
          purchaseCargo(symbol: TradeSymbol, units: number) {
            return purchaseOrSellCargo("purchase", this, { symbol, units });
          },
          async transferCargo(
            tradeSymbol: TradeSymbol,
            units: number,
            shipSymbol: string
          ) {
            Object.assign(
              this,
              (
                await api.post<{ data: { cargo: ShipCargo } }>(
                  `my/ships/${this.symbol}/transfer`,
                  { json: { tradeSymbol, units, shipSymbol } }
                )
              ).data.data
            );
          },
          async negotiateContract() {
            const contract = wrapContract(
              (
                await api.post<{ data: { contract: Contract } }>(
                  `my/ships/${this.symbol}/negotiate/contract`
                )
              ).data.data.contract
            );
            contracts.set(contract.id, contract);
            return contract;
          },
          installMount(symbol: string) {
            return installOrRemoveMount("install", this, symbol);
          },
          removeMount(symbol: string) {
            return installOrRemoveMount("remove", this, symbol);
          }
        }
      ];
    })
  );

  return { agent, contracts, ships };
};
