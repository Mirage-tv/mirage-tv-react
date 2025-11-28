import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Compile worker.ts to _worker.js using TypeScript compiler
const workerSrc = path.join(__dirname, "src/worker.ts");
const workerDist = path.join(distDir, "_worker.js");

try {
  // Compile TypeScript to JavaScript
  console.log("Compiling worker.ts to JavaScript...");
  execSync(
    `npx tsc ${workerSrc} --outDir ${distDir} --module esnext --target es2022 --moduleResolution bundler --lib es2022,dom --skipLibCheck`,
    {
      stdio: "inherit",
    },
  );

  // Rename worker.js to _worker.js
  const compiledWorker = path.join(distDir, "worker.js");
  if (fs.existsSync(compiledWorker)) {
    fs.renameSync(compiledWorker, workerDist);
    console.log("✓ Worker compiled and copied to dist/_worker.js");
  } else {
    console.error("✗ Compiled worker.js not found");
    process.exit(1);
  }
} catch (error) {
  console.error("✗ Failed to compile worker:", error.message);
  process.exit(1);
}

// Ensure wrangler.jsonc exists
const wranglerPath = path.join(__dirname, "wrangler.jsonc");
if (!fs.existsSync(wranglerPath)) {
  console.error("✗ wrangler.jsonc not found");
  process.exit(1);
}

// Copy .assetsignore to dist directory
const assetsignoreSrc = path.join(__dirname, ".assetsignore");
const assetsignoreDist = path.join(distDir, ".assetsignore");
if (fs.existsSync(assetsignoreSrc)) {
  fs.copyFileSync(assetsignoreSrc, assetsignoreDist);
  console.log("✓ .assetsignore copied to dist/");
}

console.log("✓ Build script completed successfully");
