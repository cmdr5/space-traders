import ky from "ky";
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

enum ContractOpCode {
  Accept = "CONTRACT_ACCEPT",
  Deliver = "CONTRACT_DELIVER",
  Fulfill = "CONTRACT_FULFILL"
}

enum ShipOpCode {
  Orbit = "SHIP_ORBIT",
  Refine = "SHIP_REFINE",
  Chart = "SHIP_CHART",
  Dock = "SHIP_DOCK",
  Survey = "SHIP_SURVEY",
  ExtractResources = "SHIP_EXTRACT_RESOURCES",
  JettisonCargo = "SHIP_JETTISON_CARGO",
  Jump = "SHIP_JUMP",
  Navigate = "SHIP_NAVIGATE",
  PatchNav = "SHIP_PATCH_NAV",
  Warp = "SHIP_WARP",
  SellCargo = "SHIP_SELL_CARGO",
  ScanSystems = "SHIP_SCAN_SYSTEMS",
  ScanWaypoints = "SHIP_SCAN_WAYPOINTS",
  ScanShips = "SHIP_SCAN_SHIPS",
  Refuel = "SHIP_REFUEL",
  PurchaseCargo = "SHIP_PURCHASE_CARGO",
  TransferCargo = "SHIP_TRANSFER_CARGO",
  NegotiateContract = "SHIP_NEGOTIATE_CONTRACT",
  InstallMount = "SHIP_INSTALL_MOUNT",
  RemoveMount = "SHIP_REMOVE_MOUNT"
}

type ContractOp = { contractId: string } & (
  | { code: ContractOpCode.Accept | ContractOpCode.Fulfill; data?: never }
  | {
      code: ContractOpCode.Deliver;
      data: { shipSymbol: string; tradeSymbol: string; units: number };
    }
);

type ShipOp = {
  shipSymbol: string;
} & (
  | {
      code:
        | ShipOpCode.Orbit
        | ShipOpCode.Chart
        | ShipOpCode.Dock
        | ShipOpCode.Survey
        | ShipOpCode.ScanSystems
        | ShipOpCode.ScanWaypoints
        | ShipOpCode.ScanShips
        | ShipOpCode.Refuel
        | ShipOpCode.NegotiateContract;
      data?: never;
    }
  | {
      code: ShipOpCode.Refine;
      data: {
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
      code: ShipOpCode.ExtractResources;
      data: { survey: Survey };
    }
  | {
      code:
        | ShipOpCode.JettisonCargo
        | ShipOpCode.SellCargo
        | ShipOpCode.PurchaseCargo;
      data: { symbol: TradeSymbol; units: number };
    }
  | {
      code: ShipOpCode.Jump;
      data: { systemSymbol: string };
    }
  | {
      code: ShipOpCode.Navigate | ShipOpCode.Warp;
      data: { waypointSymbol: string };
    }
  | {
      code: ShipOpCode.PatchNav;
      data: { flightMode: ShipNavFlightMode };
    }
  | {
      code: ShipOpCode.TransferCargo;
      data: { tradeSymbol: TradeSymbol; units: number; shipSymbol: string };
    }
  | {
      code: ShipOpCode.InstallMount | ShipOpCode.RemoveMount;
      data: { symbol: string };
    }
);

type Op = ContractOp | ShipOp;

export class Game {
  data?: {
    agent: Agent;
    fleet: Ship[];
  };

  constructor(
    private accessToken: string,
    private onMarketTransaction?: (tx: MarketTransaction) => void,
    private onShipyardTransaction?: (tx: ShipyardTransaction) => void
  ) {}

  private api = ky.create({
    prefixUrl: "https://api.spacetraders.io/v2",
    headers: { Authorization: `Bearer ${this.accessToken}` }
  });

  private async executeOp(op: Op) {
    if (!this.data) throw new Error("Game is not initialized");
    if ("contractId" in op) {
      switch (op.code) {
        case ContractOpCode.Accept: {
          await this.api
            .post(`my/contracts/${op.contractId}/accept`)
            .json<{ data: { agent: Agent; contract: Contract } }>();
          return;
        }
        case ContractOpCode.Deliver: {
          await this.api
            .post(`my/contracts/${op.contractId}/deliver`, { json: op.data })
            .json<{ data: { contract: Contract; cargo: ShipCargo } }>();
          return;
        }
        case ContractOpCode.Fulfill: {
          await this.api
            .post(`my/contracts/${op.contractId}/fulfill`)
            .json<{ data: { agent: Agent; contract: Contract } }>();
          return;
        }
      }
    } else {
      switch (op.code) {
        case ShipOpCode.Chart: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/chart`)
            .json<{ data: { chart: Chart; waypoint: Waypoint } }>();
          return;
        }
        case ShipOpCode.Dock: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/dock`)
            .json<{ data: { nav: ShipNav } }>();
          return;
        }
        case ShipOpCode.ExtractResources: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/extract`, { json: op.data })
            .json<{
              data: {
                cooldown: Cooldown;
                extraction: Extraction;
                cargo: ShipCargo;
              };
            }>();
          return;
        }
        case ShipOpCode.InstallMount: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/mounts/install`, { json: op.data })
            .json<{
              data: {
                agent: Agent;
                mounts: ShipMount[];
                cargo: ShipCargo;
                transaction: ShipyardTransaction;
              };
            }>();
          return;
        }
        case ShipOpCode.JettisonCargo: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/jettison`, { json: op.data })
            .json<{ data: { cargo: ShipCargo } }>();
          return;
        }
        case ShipOpCode.Jump: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/jump`, { json: op.data })
            .json<{ data: { cooldown: Cooldown; nav: ShipNav } }>();
          return;
        }
        case ShipOpCode.Navigate: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/navigate`, { json: op.data })
            .json<{ data: { fuel: ShipFuel; nav: ShipNav } }>();
          return;
        }
        case ShipOpCode.NegotiateContract: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/negotiate/contract`)
            .json<{ data: { contract: Contract } }>();
          return;
        }
        case ShipOpCode.Orbit: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/orbit`)
            .json<{ data: { nav: ShipNav } }>();
          return;
        }
        case ShipOpCode.PatchNav: {
          await this.api
            .patch(`my/ships/${op.shipSymbol}/nav`, { json: op.data })
            .json<{ data: ShipNav }>();
          return;
        }
        case ShipOpCode.PurchaseCargo: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/purchase`, { json: op.data })
            .json<{
              data: {
                agent: Agent;
                cargo: ShipCargo;
                transaction: MarketTransaction;
              };
            }>();
          return;
        }
        case ShipOpCode.Refine: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/refine`, { json: op.data })
            .json<{
              data: {
                cargo: ShipCargo;
                cooldown: Cooldown;
                produced: { tradeSymbol?: string; units?: number }[];
                consumed: { tradeSymbol?: string; units?: number }[];
              };
            }>();
          return;
        }
        case ShipOpCode.Refuel: {
          await this.api.post(`my/ships/${op.shipSymbol}/refuel`).json<{
            data: {
              agent: Agent;
              fuel: ShipFuel;
              transaction: MarketTransaction;
            };
          }>();
          return;
        }
        case ShipOpCode.RemoveMount: {
          const response = await this.api
            .post(`my/ships/${op.shipSymbol}/mounts/remove`, { json: op.data })
            .json<{
              data: {
                agent: Agent;
                mounts: ShipMount[];
                cargo: ShipCargo;
                transaction: ShipyardTransaction;
              };
            }>();
          this.data.agent = response.data.agent;
          this.onShipyardTransaction?.(response.data.transaction);
          return;
        }
        case ShipOpCode.ScanShips: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/scan/ships`)
            .json<{ data: { cooldown: Cooldown; ships: ScannedShip[] } }>();
          return;
        }
        case ShipOpCode.ScanSystems: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/scan/systems`)
            .json<{ data: { cooldown: Cooldown; systems: ScannedSystem[] } }>();
          return;
        }
        case ShipOpCode.ScanWaypoints: {
          await this.api.post(`my/ships/${op.shipSymbol}/scan/waypoints`).json<{
            data: { cooldown: Cooldown; waypoints: ScannedWaypoint[] };
          }>();
          return;
        }
        case ShipOpCode.SellCargo: {
          const response = await this.api
            .post(`my/ships/${op.shipSymbol}/sell`, { json: op.data })
            .json<{
              data: {
                agent: Agent;
                cargo: ShipCargo;
                transaction: MarketTransaction;
              };
            }>();
          this.data.agent = response.data.agent;
          this.onMarketTransaction?.(response.data.transaction);
          return;
        }
        case ShipOpCode.Survey: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/survey`)
            .json<{ data: { cooldown: Cooldown; surveys: Survey[] } }>();
          return;
        }
        case ShipOpCode.TransferCargo: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/transfer`, { json: op.data })
            .json<{ data: { cargo: ShipCargo } }>();
          return;
        }
        case ShipOpCode.Warp: {
          await this.api
            .post(`my/ships/${op.shipSymbol}/warp`, { json: op.data })
            .json<{ data: { fuel: ShipFuel; nav: ShipNav } }>();
          return;
        }
      }
    }
  }
}
