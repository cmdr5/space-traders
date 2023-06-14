export type ContractPayment = {
  onAccepted: number;
  onFulfilled: number;
};

export type ContractDeliverGood = {
  tradeSymbol: string;
  destinationSymbol: string;
  unitsRequired: number;
  unitsFulfilled: number;
};

export type ContractTerms = {
  deadline: string;
  payment: ContractPayment;
  deliver?: ContractDeliverGood[];
};

export type Contract = {
  id: string;
  factionSymbol: string;
  type: "PROCUREMENT" | "TRANSPORT" | "SHUTTLE";
  terms: ContractTerms;
  accepted: boolean;
  fulfilled: boolean;
  expiration: string;
  deadlineToAccept?: string;
};
