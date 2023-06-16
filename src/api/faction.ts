import type { RequireAtLeastOne } from "type-fest";
import type { Faction } from "../types/faction.js";
import type { Meta } from "../types/meta.js";
import { api } from "../utils/index.js";

export const listFactions = (
  searchParams?: RequireAtLeastOne<{ limit: number; page: number }>
) =>
  api.get("factions", { searchParams }).json<{ data: Faction[]; meta: Meta }>();

export const getFaction = (factionSymbol: string) =>
  api.get(`factions/${factionSymbol}`).json<{ data: Faction }>();
