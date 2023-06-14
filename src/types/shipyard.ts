import type {
  ShipEngine,
  ShipFrame,
  ShipModule,
  ShipMount,
  ShipReactor,
  ShipType
} from "./ship";

export type ShipyardShip = {
  type?: ShipType;
  name: string;
  description: string;
  purchasePrice: number;
  frame: ShipFrame;
  reactor: ShipReactor;
  engine: ShipEngine;
  modules: ShipModule[];
  mounts: ShipMount[];
};

export type ShipyardTransaction = {
  waypointSymbol: string;
  shipSymbol: string;
  price: number;
  agentSymbol: string;
  timestamp: string;
};

export type Shipyard = {
  symbol: string;
  shipTypes: { type: ShipType }[];
  transactions?: ShipyardTransaction[];
  ships?: ShipyardShip[];
};
