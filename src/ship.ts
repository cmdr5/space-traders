import type { Game } from "./game";
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

export type ShipActionBody<T extends ShipActionType> =
  T extends ShipActionType.ExtractResources
    ? { survey: Survey }
    : T extends
        | ShipActionType.JettisonCargo
        | ShipActionType.PurchaseCargo
        | ShipActionType.SellCargo
    ? { symbol: TradeSymbol; units: number }
    : T extends ShipActionType.Jump
    ? { systemSymbol: string }
    : T extends ShipActionType.Navigate | ShipActionType.Warp
    ? { waypointSymbol: string }
    : T extends ShipActionType.PatchNav
    ? { flightMode: ShipNavFlightMode }
    : T extends ShipActionType.Refine
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
    : T extends ShipActionType.TransferCargo
    ? { tradeSymbol: TradeSymbol; units: number; shipSymbol: string }
    : T extends ShipActionType.InstallMount | ShipActionType.RemoveMount
    ? { symbol: string }
    : undefined;

export type ShipAction = {
  [T in ShipActionType]: {
    type: T;
    body: ShipActionBody<T>;
  };
}[ShipActionType];

export interface GameShip extends Ship {}
export class GameShip {
  constructor(data: Ship, private cooldown: Promise<void>, private game: Game) {
    Object.assign(this, data);
  }

  private setCooldown({ remainingSeconds }: Cooldown) {
    this.cooldown = new Promise((resolve) =>
      setTimeout(resolve, remainingSeconds * 1000)
    );
  }

  private async dockOrOrbit(type: "dock" | "orbit") {
    Object.assign(
      this,
      await makeRequest<{ nav: ShipNav }>({
        path: `my/ships/${this.symbol}/${type}`,
        method: "POST"
      })
    );
  }

  private async warpOrNavigate(type: "warp" | "navigate") {
    Object.assign(
      this,
      await makeRequest<{ fuel: ShipFuel; nav: ShipNav }>({
        path: `my/ships/${this.symbol}/${type}`,
        method: "POST"
      })
    );
  }

  private async installOrRemoveMount(
    type: "install" | "remove",
    body: { symbol: string }
  ) {
    const { agent, mounts, cargo, transaction } = await makeRequest<{
      agent: Agent;
      mounts: ShipMount[];
      cargo: ShipCargo;
      transaction: ShipyardTransaction;
    }>({
      path: `my/ships/${this.symbol}/mounts/${type}`,
      method: "POST",
      body
    });
    this.game.agent = agent;
    Object.assign(this, { mounts, cargo });
  }

  private async chart() {
    await makeRequest<{ chart: Chart; waypoint: Waypoint }>({
      path: `my/ships/${this.symbol}/chart`,
      method: "POST"
    });
  }

  private async extractResources(body: { survey: Survey }) {
    const { cooldown, extraction, cargo } = await makeRequest<{
      cooldown: Cooldown;
      extraction: Extraction;
      cargo: ShipCargo;
    }>({
      path: `my/ships/${this.symbol}/extract`,
      method: "POST",
      body
    });
    this.setCooldown(cooldown);
    this.cargo = cargo;
  }

  private async jettisonCargo(body: { symbol: TradeSymbol; units: number }) {
    Object.assign(
      this,
      await makeRequest<{ cargo: ShipCargo }>({
        path: `my/ships/${this.symbol}/jettison`,
        method: "POST",
        body
      })
    );
  }

  private async purchaseOrSellCargo(
    type: "purchase" | "sell",
    body: { symbol: TradeSymbol; units: number }
  ) {
    const { agent, cargo, transaction } = await makeRequest<{
      agent: Agent;
      cargo: ShipCargo;
      transaction: MarketTransaction;
    }>({
      path: `my/ships/${this.symbol}/${type}`,
      method: "POST",
      body
    });
    this.game.agent = agent;
    this.cargo = cargo;
  }

  private async jump(body: { systemSymbol: string }) {
    const { cooldown, nav } = await makeRequest<{
      cooldown: Cooldown;
      nav: ShipNav;
    }>({
      path: `my/ships/${this.symbol}/jump`,
      method: "POST",
      body
    });
    this.setCooldown(cooldown);
    this.nav = nav;
  }

  private async negotiateContract() {
    await makeRequest<{ contract: Contract }>({
      path: `my/ships/${this.symbol}/negotiate/contract`,
      method: "POST"
    });
  }

  private async patchNav(body: { flightMode: ShipNavFlightMode }) {
    this.nav = await makeRequest<ShipNav>({
      path: `my/ships/${this.symbol}/nav`,
      method: "PATCH",
      body
    });
  }

  private async refine(body: {
    produce:
      | TradeSymbol.Iron
      | TradeSymbol.Copper
      | TradeSymbol.Aluminum
      | TradeSymbol.Silver
      | TradeSymbol.Gold
      | TradeSymbol.Platinum
      | TradeSymbol.Uranite
      | TradeSymbol.Meritium
      | TradeSymbol.Fuel;
  }) {
    const { cargo, cooldown, produced, consumed } = await makeRequest<{
      cargo: ShipCargo;
      cooldown: Cooldown;
      produced: { tradeSymbol?: string; units?: number }[];
      consumed: { tradeSymbol?: string; units?: number }[];
    }>({
      path: `my/ships/${this.symbol}/refine`,
      method: "POST",
      body
    });
    this.cargo = cargo;
    this.setCooldown(cooldown);
  }

  private async refuel() {
    const { agent, fuel, transaction } = await makeRequest<{
      agent: Agent;
      fuel: ShipFuel;
      transaction: MarketTransaction;
    }>({
      path: `my/ships/${this.symbol}/refuel`,
      method: "POST"
    });
    this.game.agent = agent;
    this.fuel = fuel;
  }

  private async scan(type: "ships" | "systems" | "waypoints") {
    const { cooldown, ...rest } = await makeRequest<
      { cooldown: Cooldown } & (
        | { ships: ScannedShip[] }
        | { systems: ScannedSystem[] }
        | { waypoints: ScannedWaypoint[] }
      )
    >({
      path: `my/ships/${this.symbol}/scan/${type}`,
      method: "POST"
    });
    this.setCooldown(cooldown);
    if ("ships" in rest) {
    } else if ("systems" in rest) {
    } else {
    }
  }

  private async survey() {
    const { cooldown, surveys } = await makeRequest<{
      cooldown: Cooldown;
      surveys: Survey[];
    }>({
      path: `my/ships/${this.symbol}/survey`,
      method: "POST"
    });
    this.setCooldown(cooldown);
  }

  private async transferCargo(body: {
    tradeSymbol: TradeSymbol;
    units: number;
    shipSymbol: string;
  }) {
    Object.assign(
      this,
      await makeRequest<{ cargo: ShipCargo }>({
        path: `my/ships/${this.symbol}/transfer`,
        method: "POST",
        body
      })
    );
  }

  async assignTask(task: ShipAction[]) {
    for (const action of task) {
      switch (action.type) {
      }
    }
  }

  // pauseTask() {}
  // resumeTask() {}
  // loop(id: string, fn: (ship: GameShip) => void) {}
}
