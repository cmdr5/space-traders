export enum FactionSymbol {
  Cosmic = "COSMIC",
  Void = "VOID",
  Galactic = "GALACTIC",
  Quantum = "QUANTUM",
  Dominion = "DOMINION",
  Astro = "ASTRO",
  Corsairs = "CORSAIRS",
  Obsidian = "OBSIDIAN",
  Aegis = "AEGIS",
  United = "UNITED",
  Solitary = "SOLITARY",
  Cobalt = "COBALT",
  Omega = "OMEGA",
  Echo = "ECHO",
  Lords = "LORDS",
  Cult = "CULT",
  Ancients = "ANCIENTS",
  Shadow = "SHADOW",
  Ethereal = "ETHEREAL"
}

export type FactionTrait = {
  symbol:
    | "BUREAUCRATIC"
    | "SECRETIVE"
    | "CAPITALISTIC"
    | "INDUSTRIOUS"
    | "PEACEFUL"
    | "DISTRUSTFUL"
    | "WELCOMING"
    | "SMUGGLERS"
    | "SCAVENGERS"
    | "REBELLIOUS"
    | "EXILES"
    | "PIRATES"
    | "RAIDERS"
    | "CLAN"
    | "GUILD"
    | "DOMINION"
    | "FRINGE"
    | "FORSAKEN"
    | "ISOLATED"
    | "LOCALIZED"
    | "ESTABLISHED"
    | "NOTABLE"
    | "DOMINANT"
    | "INESCAPABLE"
    | "INNOVATIVE"
    | "BOLD"
    | "VISIONARY"
    | "CURIOUS"
    | "DARING"
    | "EXPLORATORY"
    | "RESOURCEFUL"
    | "FLEXIBLE"
    | "COOPERATIVE"
    | "UNITED"
    | "STRATEGIC"
    | "INTELLIGENT"
    | "RESEARCH_FOCUSED"
    | "COLLABORATIVE"
    | "PROGRESSIVE"
    | "MILITARISTIC"
    | "TECHNOLOGICALLY_ADVANCED"
    | "AGGRESSIVE"
    | "IMPERIALISTIC"
    | "TREASURE_HUNTERS"
    | "DEXTEROUS"
    | "UNPREDICTABLE"
    | "BRUTAL"
    | "FLEETING"
    | "ADAPTABLE"
    | "SELF_SUFFICIENT"
    | "DEFENSIVE"
    | "PROUD"
    | "DIVERSE"
    | "INDEPENDENT"
    | "SELF_INTERESTED"
    | "FRAGMENTED"
    | "COMMERCIAL"
    | "FREE_MARKETS"
    | "ENTREPRENEURIAL";
  name: string;
  description: string;
};

export type Faction = {
  symbol: FactionSymbol;
  name: string;
  description: string;
  headquarters: string;
  traits: FactionTrait[];
  isRecruiting: boolean;
};
