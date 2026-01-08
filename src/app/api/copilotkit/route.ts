import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

// Service adapter - empty since we use our own Pydantic AI agent
const serviceAdapter = new ExperimentalEmptyAdapter();

// Agent URL - local dev or Railway production
const AGENT_URL = process.env.AGENT_URL || "http://localhost:8000/";

// Create the CopilotRuntime with our Pydantic AI agent
const runtime = new CopilotRuntime({
  agents: {
    gtm_agent: new HttpAgent({ url: AGENT_URL }),
  },
});

// Next.js API route handler
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
