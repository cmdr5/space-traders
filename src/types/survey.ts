export type SurveyDeposit = { symbol: string };

export type Survey = {
  signature: string;
  symbol: string;
  deposits: SurveyDeposit[];
  expiration: string;
  size: "SMALL" | "MODERATE" | "LARGE";
};
