import type { RequireAtLeastOne } from "type-fest";
import type { JumpGate } from "../types/jump-gate.js";
import type { Market } from "../types/market.js";
import type { Meta } from "../types/meta.js";
import type { Shipyard } from "../types/shipyard.js";
import type { System } from "../types/system.js";
import type { Waypoint } from "../types/waypoint.js";
import { api } from "../utils/index.js";

export const listSystems = (
  searchParams?: RequireAtLeastOne<{ limit: number; page: number }>
) =>
  api.get("systems", { searchParams }).json<{ data: System[]; meta: Meta }>();

export const getSystem = (systemSymbol: string) =>
  api.get(`systems/${systemSymbol}`).json<{ data: System }>();

export const listWaypointsInSystem = (
  systemSymbol: string,
  searchParams?: RequireAtLeastOne<{ limit: number; page: number }>
) =>
  api
    .get(`systems/${systemSymbol}/waypoints`, { searchParams })
    .json<{ data: Waypoint[]; meta: Meta }>();

export const getWaypoint = (systemSymbol: string, waypointSymbol: string) =>
  api
    .get(`systems/${systemSymbol}/waypoints/${waypointSymbol}`)
    .json<{ data: Waypoint }>();

export const getMarket = (systemSymbol: string, waypointSymbol: string) =>
  api
    .get(`systems/${systemSymbol}/waypoints/${waypointSymbol}/market`)
    .json<{ data: Market }>();

export const getShipyard = (systemSymbol: string, waypointSymbol: string) =>
  api
    .get(`systems/${systemSymbol}/waypoints/${waypointSymbol}/shipyard`)
    .json<{ data: Shipyard }>();

export const getJumpGate = (systemSymbol: string, waypointSymbol: string) =>
  api
    .get(`systems/${systemSymbol}/waypoints/${waypointSymbol}/jump-gate`)
    .json<{ data: JumpGate }>();
