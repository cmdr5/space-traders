import type { TradeGood } from "./trade";

export type MarketTransaction = {
  waypointSymbol: string;
  shipSymbol: string;
  tradeSymbol: string;
  type: "PURCHASE" | "SELL";
  units: number;
  pricePerUnit: number;
  totalPrice: number;
  timestamp: string;
};

export type MarketTradeGood = {
  symbol: string;
  tradeVolume: number;
  supply: "SCARCE" | "LIMITED" | "MODERATE" | "ABUNDANT";
  purchasePrice: number;
  sellPrice: number;
};

export type Market = {
  symbol: string;
  exports: TradeGood[];
  imports: TradeGood[];
  exchange: TradeGood[];
  transactions?: MarketTransaction[];
  tradeGoods?: MarketTradeGood[];
};
