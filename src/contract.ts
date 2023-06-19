import type { Game } from "./game";
import type { Contract } from "./types/contract";

export enum ContractActionType {
  Accept = "CONTRACT_ACCEPT",
  DeliverCargo = "CONTRACT_DELIVER_CARGO",
  Fulfill = "CONTRACT_FULFILL"
}

export interface GameContract extends Contract {}
export class GameContract {
  constructor(data: Contract, private game: Game) {
    Object.assign(this, data);
  }
}
