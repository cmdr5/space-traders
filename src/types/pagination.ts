import type { RequireAtLeastOne } from "type-fest";

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
};

export type PaginationOptions = RequireAtLeastOne<
  Omit<PaginationMeta, "total">
>;
