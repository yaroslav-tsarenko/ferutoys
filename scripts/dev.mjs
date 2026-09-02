import { spawn, execSync } from "child_process";
import os from "os";
import path from "path";
import fs from "fs";

const DB_PORTS = [51213, 51214, 51215];
const NEXT_PORT = 5555;

function killPort(port) {
  try {
    const pids = execSync(`lsof -ti :${port}`, { encoding: "utf-8" }).trim();
    if (pids) {
      execSync(`kill -9 ${pids.split("\n").join(" ")}`, { stdio: "ignore" });
      console.log(`  killed process on :${port}`);
    }
  } catch {
    // nothing on that port
  }
}

console.log("\n[dev] Cleaning up old processes...");
for (const port of [...DB_PORTS, NEXT_PORT]) {
  killPort(port);
}

// Clean up Prisma Dev server lock file if it exists
try {
  const lockPath = path.join(
    os.homedir(),
    "Library/Application Support/prisma-dev-nodejs/durable-streams/default/server.lock.lock"
  );
  if (fs.existsSync(lockPath)) {
    fs.rmSync(lockPath, { recursive: true, force: true });
    console.log("  cleaned up Prisma dev lock file");
  }
} catch (e) {
  // Ignore errors
}

console.log("[dev] Starting Prisma Postgres...");
const db = spawn("npx", ["prisma", "dev"], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, FORCE_COLOR: "1" },
});

let nextStarted = false;

function startNext() {
  if (nextStarted) return;
  nextStarted = true;
  console.log("[dev] Starting Next.js...\n");
  const next = spawn("npx", ["next", "dev", "-p", NEXT_PORT.toString()], {
    stdio: "inherit",
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  next.on("exit", (code) => {
    db.kill();
    process.exit(code ?? 0);
  });
}

db.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(`[prisma] ${text}`);
  if (text.includes("now running") || text.includes("DATABASE_URL") || text.includes("already running")) {
    startNext();
  }
});

db.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  process.stderr.write(`[prisma] ${text}`);
  if (text.includes("now running") || text.includes("DATABASE_URL") || text.includes("already running")) {
    startNext();
  }
});

// If prisma dev doesn't print a ready message, start Next after a timeout
setTimeout(() => startNext(), 5000);

db.on("exit", (code) => {
  if (!nextStarted) {
    if (code === 0) {
      startNext();
    } else {
      console.error("[dev] Prisma Postgres exited unexpectedly with code", code);
      process.exit(1);
    }
  }
});

process.on("SIGINT", () => {
  db.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  db.kill();
  process.exit(0);
});
