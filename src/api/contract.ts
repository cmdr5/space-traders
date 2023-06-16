import type { RequireAtLeastOne } from "type-fest";
import type { Agent } from "../types/agent.js";
import type { Contract } from "../types/contract.js";
import type { Meta } from "../types/meta.js";
import type { ShipCargo } from "../types/ship.js";
import { api } from "../utils/index.js";

export const listContracts = (
  searchParams?: RequireAtLeastOne<{ limit: number; page: number }>
) =>
  api
    .get(`my/contracts`, { searchParams })
    .json<{ data: Contract[]; meta: Meta }>();

export const getContract = (contractId: string) =>
  api.get(`my/contracts/${contractId}`).json<{ data: Contract }>();

export const acceptContract = (contractId: string) =>
  api
    .post(`my/contracts/${contractId}/accept`)
    .json<{ data: { agent: Agent; contract: Contract } }>();

export const deliverCargoToContract = (
  contractId: string,
  json: { shipSymbol: string; tradeSymbol: string; units: number }
) =>
  api
    .post(`my/contracts/${contractId}/deliver`, { json })
    .json<{ data: { contract: Contract; cargo: ShipCargo } }>();

export const fulfillContract = (contractId: string) =>
  api
    .post(`my/contracts/${contractId}/fulfill`)
    .json<{ data: { agent: Agent; contract: Contract } }>();
