import ky from "ky";
import type { KyInstance } from "ky/distribution/types/ky";
import type { Agent } from "./types/agent";
import type { Chart } from "./types/chart";
import type { Contract } from "./types/contract";
import type { Cooldown } from "./types/cooldown";
import type { Extraction } from "./types/extraction";
import type { MarketTransaction } from "./types/market";
import type {
  ScannedShip,
  Ship,
  ShipCargo,
  ShipFuel,
  ShipMount,
  ShipNav,
  ShipNavFlightMode
} from "./types/ship";
import type { ShipyardTransaction } from "./types/shipyard";
import type { Survey } from "./types/survey";
import type { ScannedSystem } from "./types/system";
import type { TradeSymbol } from "./types/trade";
import type { ScannedWaypoint, Waypoint } from "./types/waypoint";

export enum ContractActionType {
  Accept = "CONTRACT_ACCEPT",
  DeliverCargo = "CONTRACT_DELIVER_CARGO",
  Fulfill = "CONTRACT_FULFILL"
}

export type ContractAction = { contractId: string } & (
  | {
      type: ContractActionType.Accept | ContractActionType.Fulfill;
      payload?: never;
    }
  | {
      type: ContractActionType.DeliverCargo;
      payload: { shipSymbol: string; tradeSymbol: string; units: number };
    }
);

export enum ShipActionType {
  Chart = "SHIP_CHART",
  Dock = "SHIP_DOCK",
  ExtractResources = "SHIP_EXTRACT_RESOURCES",
  InstallMount = "SHIP_INSTALL_MOUNT",
  JettisonCargo = "SHIP_JETTISON_CARGO",
  Jump = "SHIP_JUMP",
  Navigate = "SHIP_NAVIGATE",
  NegotiateContract = "SHIP_NEGOTIATE_CONTRACT",
  Orbit = "SHIP_ORBIT",
  PatchNav = "SHIP_PATCH_NAV",
  PurchaseCargo = "SHIP_PURCHASE_CARGO",
  Refine = "SHIP_REFINE",
  Refuel = "SHIP_REFUEL",
  RemoveMount = "SHIP_REMOVE_MOUNT",
  ScanShips = "SHIP_SCAN_SHIPS",
  ScanSystems = "SHIP_SCAN_SYSTEMS",
  ScanWaypoints = "SHIP_SCAN_WAYPOINTS",
  SellCargo = "SHIP_SELL_CARGO",
  Survey = "SHIP_SURVEY",
  TransferCargo = "SHIP_TRANSFER_CARGO",
  Warp = "SHIP_WARP"
}

export type ShipAction = { shipSymbol: string } & (
  | {
      type:
        | ShipActionType.Chart
        | ShipActionType.Dock
        | ShipActionType.NegotiateContract
        | ShipActionType.Orbit
        | ShipActionType.Refuel
        | ShipActionType.Survey
        | ShipActionType.ScanShips
        | ShipActionType.ScanSystems
        | ShipActionType.ScanWaypoints;
      payload?: never;
    }
  | {
      type: ShipActionType.ExtractResources;
      payload: { survey: Survey };
    }
  | {
      type:
        | ShipActionType.JettisonCargo
        | ShipActionType.PurchaseCargo
        | ShipActionType.SellCargo;
      payload: { symbol: TradeSymbol; units: number };
    }
  | {
      type: ShipActionType.Jump;
      payload: { systemSymbol: string };
    }
  | {
      type: ShipActionType.Navigate | ShipActionType.Warp;
      payload: { waypointSymbol: string };
    }
  | {
      type: ShipActionType.PatchNav;
      payload: { flightMode: ShipNavFlightMode };
    }
  | {
      type: ShipActionType.Refine;
      payload: {
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
      };
    }
  | {
      type: ShipActionType.TransferCargo;
      payload: { tradeSymbol: TradeSymbol; units: number; shipSymbol: string };
    }
  | {
      type: ShipActionType.InstallMount | ShipActionType.RemoveMount;
      payload: { symbol: string };
    }
);

export type GameState = {
  agent: Agent;
  ships: Map<string, Omit<Ship, "symbol">>;
  contracts: Map<string, Omit<Contract, "id">>;
};

export class Game {
  state?: GameState;
  api: KyInstance;

  constructor(accessToken: string) {
    this.api = ky.create({
      prefixUrl: "https://api.spacetraders.io/v2",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  private async executeAction(action: ContractAction | ShipAction) {
    if (!this.state) throw new Error("Game not initialized");
    if ("contractId" in action) {
      const { type, payload: json, contractId } = action;
      switch (type) {
        case ContractActionType.Accept:
        case ContractActionType.Fulfill: {
          const segment =
            type === ContractActionType.Accept ? "accept" : "fulfill";
          const {
            data: {
              agent,
              contract: { id, ...contract }
            }
          } = await this.api
            .post(`my/contracts/${contractId}/${segment}`)
            .json<{ data: { agent: Agent; contract: Contract } }>();
          this.state.agent = agent;
          this.state.contracts.set(id, contract);
          return;
        }
        case ContractActionType.DeliverCargo: {
          const ship = this.state.ships.get(json.shipSymbol);
          if (!ship) throw new Error("Ship not found");
          const {
            data: {
              contract: { id, ...contract },
              cargo
            }
          } = await this.api
            .post(`my/contracts/${contractId}/deliver`, { json })
            .json<{ data: { contract: Contract; cargo: ShipCargo } }>();
          this.state.contracts.set(id, contract);
          ship.cargo = cargo;
          return;
        }
      }
    } else {
      const { type, payload: json, shipSymbol } = action;
      const ship = this.state.ships.get(shipSymbol);
      if (!ship) throw new Error("Ship not found");

      switch (type) {
        case ShipActionType.Chart: {
          await this.api
            .post(`my/ships/${shipSymbol}/chart`)
            .json<{ data: { chart: Chart; waypoint: Waypoint } }>();
          return;
        }
        case ShipActionType.Dock:
        case ShipActionType.Orbit: {
          const segment = type === ShipActionType.Dock ? "dock" : "orbit";
          const response = await this.api
            .post(`my/ships/${shipSymbol}/${segment}`)
            .json<{ data: { nav: ShipNav } }>();
          ship.nav = response.data.nav;
          return;
        }
        case ShipActionType.ExtractResources: {
          const response = await this.api
            .post(`my/ships/${shipSymbol}/extract`, { json })
            .json<{
              data: {
                cooldown: Cooldown;
                extraction: Extraction;
                cargo: ShipCargo;
              };
            }>();
          ship.cargo = response.data.cargo;
          return;
        }
        case ShipActionType.RemoveMount:
        case ShipActionType.InstallMount: {
          const segment =
            type === ShipActionType.RemoveMount ? "remove" : "install";
          const response = await this.api
            .post(`my/ships/${shipSymbol}/mounts/${segment}`, { json })
            .json<{
              data: {
                agent: Agent;
                mounts: ShipMount[];
                cargo: ShipCargo;
                transaction: ShipyardTransaction;
              };
            }>();
          this.state.agent = response.data.agent;
          ship.mounts = response.data.mounts;
          ship.cargo = response.data.cargo;
          return;
        }
        case ShipActionType.JettisonCargo: {
          const response = await this.api
            .post(`my/ships/${shipSymbol}/jettison`, { json })
            .json<{ data: { cargo: ShipCargo } }>();
          ship.cargo = response.data.cargo;
          return;
        }
        case ShipActionType.Jump: {
          const response = await this.api
            .post(`my/ships/${shipSymbol}/jump`, { json })
            .json<{ data: { cooldown: Cooldown; nav: ShipNav } }>();
          ship.nav = response.data.nav;
          return;
        }
        case ShipActionType.Navigate:
        case ShipActionType.Warp: {
          const segment =
            type === ShipActionType.Navigate ? "navigate" : "warp";
          const response = await this.api
            .post(`my/ships/${shipSymbol}/${segment}`, { json })
            .json<{ data: { fuel: ShipFuel; nav: ShipNav } }>();
          ship.fuel = response.data.fuel;
          ship.nav = response.data.nav;
          return;
        }
        case ShipActionType.NegotiateContract: {
          const {
            data: {
              contract: { id, ...contract }
            }
          } = await this.api
            .post(`my/ships/${shipSymbol}/negotiate/contract`)
            .json<{ data: { contract: Contract } }>();
          this.state.contracts.set(id, contract);
          return;
        }
        case ShipActionType.PatchNav: {
          const response = await this.api
            .patch(`my/ships/${shipSymbol}/nav`, { json })
            .json<{ data: ShipNav }>();
          ship.nav = response.data;
          return;
        }
        case ShipActionType.PurchaseCargo:
        case ShipActionType.SellCargo: {
          const segment =
            type === ShipActionType.PurchaseCargo ? "purchase" : "sell";
          const response = await this.api
            .post(`my/ships/${shipSymbol}/${segment}`, { json })
            .json<{
              data: {
                agent: Agent;
                cargo: ShipCargo;
                transaction: MarketTransaction;
              };
            }>();
          this.state.agent = response.data.agent;
          ship.cargo = response.data.cargo;
          return;
        }
        case ShipActionType.Refine: {
          const response = await this.api
            .post(`my/ships/${shipSymbol}/refine`, { json })
            .json<{
              data: {
                cargo: ShipCargo;
                cooldown: Cooldown;
                produced: { tradeSymbol?: string; units?: number }[];
                consumed: { tradeSymbol?: string; units?: number }[];
              };
            }>();
          ship.cargo = response.data.cargo;
          return;
        }
        case ShipActionType.Refuel: {
          const response = await this.api
            .post(`my/ships/${shipSymbol}/refuel`)
            .json<{
              data: {
                agent: Agent;
                fuel: ShipFuel;
                transaction: MarketTransaction;
              };
            }>();
          this.state.agent = response.data.agent;
          ship.fuel = response.data.fuel;
          return;
        }
        case ShipActionType.ScanShips: {
          await this.api
            .post(`my/ships/${shipSymbol}/scan/ships`)
            .json<{ data: { cooldown: Cooldown; ships: ScannedShip[] } }>();
          return;
        }
        case ShipActionType.ScanSystems: {
          await this.api
            .post(`my/ships/${shipSymbol}/scan/systems`)
            .json<{ data: { cooldown: Cooldown; systems: ScannedSystem[] } }>();
          return;
        }
        case ShipActionType.ScanWaypoints: {
          await this.api.post(`my/ships/${shipSymbol}/scan/waypoints`).json<{
            data: { cooldown: Cooldown; waypoints: ScannedWaypoint[] };
          }>();
          return;
        }
        case ShipActionType.Survey: {
          await this.api
            .post(`my/ships/${shipSymbol}/survey`)
            .json<{ data: { cooldown: Cooldown; surveys: Survey[] } }>();
          return;
        }
        case ShipActionType.TransferCargo: {
          const response = await this.api
            .post(`my/ships/${shipSymbol}/transfer`, { json })
            .json<{ data: { cargo: ShipCargo } }>();
          ship.cargo = response.data.cargo;
          return;
        }
      }
    }
  }
}
