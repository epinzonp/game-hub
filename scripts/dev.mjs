import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

const convexOnly = process.argv.includes("--convex-only");
const services = [
  ...(!convexOnly
    ? [
        {
          name: "Next.js",
          file: "node_modules/next/dist/bin/next",
          args: ["dev"],
        },
      ]
    : []),
  {
    name: "Convex (local)",
    file: "node_modules/convex/bin/main.js",
    args: ["dev"],
    env: {
      ...process.env,
      CONVEX_AGENT_MODE: "anonymous",
      CONVEX_DEPLOYMENT: "anonymous:anonymous-agent",
    },
  },
];

for (const service of services) {
  if (!existsSync(resolve(service.file))) {
    throw new Error(`Missing ${service.name} CLI. Run npm install first.`);
  }
}

const children = services.map((service) => {
  const child = spawn(process.execPath, [service.file, ...service.args], {
    stdio: "inherit",
    env: service.env ?? process.env,
  });
  child.on("error", (error) => {
    console.error(`${service.name} failed to start:`, error);
    stop("SIGTERM", 1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop("SIGTERM", code ?? 1);
  });
  return child;
});

let stopping = false;
function stop(signal, exitCode) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill(signal);
  }
}

process.on("SIGINT", () => stop("SIGINT", 130));
process.on("SIGTERM", () => stop("SIGTERM", 143));
