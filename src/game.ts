import type { Jsonifiable, JsonValue } from "type-fest";
import { GameContract } from "./contract";
import { GameShip } from "./ship";
import type { Agent } from "./types/agent";
import type { Contract } from "./types/contract";
import type { Faction, FactionSymbol } from "./types/faction";
import type { Ship } from "./types/ship";

type OkResponse<T> = { data: T };
type ErrorResponse = {
  error: {
    message: string;
    code: number;
    data?: JsonValue;
  };
};

let accessToken: string | undefined;

const makeRequest = async <T>({
  path,
  method,
  body
}: {
  path: string;
  method?: string;
  body?: Jsonifiable;
}) => {
  const opts = {
    ...(method ? { method } : {}),
    ...(body ? { body: JSON.stringify(body) } : {}),
    headers: new Headers([["Accept", "application/json"]])
  };
  if (accessToken) opts.headers.set("Authorization", `Bearer ${accessToken}`);
  if (opts.body) {
    opts.headers.set("Content-Type", "application/json");
    opts.headers.set("Content-Length", opts.body.length.toString());
  }
  const response = await fetch(`https://api.spacetraders.io/v2/${path}`, opts);
  const result = (await response.json()) as ErrorResponse | OkResponse<T>;
  if ("error" in result) throw new SpaceTradersError(result.error);
  return result.data;
};

export class Game {
  agent: Agent;
  contracts: Map<string, GameContract>;
  ships: Map<string, GameShip>;

  constructor({
    agent,
    contracts,
    ships
  }: {
    agent: Agent;
    contracts: Contract[];
    ships: Ship[];
  }) {
    this.agent = agent;
    this.ships = new Map(ships.map((s) => [s.symbol, new GameShip(s, this)]));
    this.contracts = new Map(
      contracts.map((c) => [c.id, new GameContract(c, this)])
    );
  }

  static initialize(accessToken: string) {}
  static async register(json: { symbol: string; faction: FactionSymbol }) {
    const {
      data: { agent, contract, faction, ship, token }
    } = await api.post("register", { json }).json<{
      data: {
        agent: Agent;
        contract: Contract;
        faction: Faction;
        ship: Ship;
        token: string;
      };
    }>();
    accessToken = token;
    return new Game({ agent, contracts: [contract], ships: [ship] });
  }
}
