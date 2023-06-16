import type { TradeSymbol } from "./trade.js";

export type ExtractionYield = {
  symbol: TradeSymbol;
  units: number;
};

export type Extraction = {
  shipSymbol: string;
  yield: ExtractionYield;
};
