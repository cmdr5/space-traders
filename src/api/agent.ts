import type { Agent } from "../types/agent.js";
import { api } from "../utils/index.js";

export const getAgent = () => api.get("my/agent").json<{ data: Agent }>();
