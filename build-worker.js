import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy worker file to dist directory
const workerSrc = path.join(__dirname, "src/worker.ts");
const workerDist = path.join(__dirname, "dist/_worker.ts");

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, "dist"))) {
  fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
}

// Copy worker file
if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDist);
  console.log("✓ Worker file copied to dist/");
} else {
  console.log("✗ Worker file not found:", workerSrc);
}

// Ensure wrangler.jsonc exists
const wranglerPath = path.join(__dirname, "wrangler.jsonc");
if (!fs.existsSync(wranglerPath)) {
  console.log("✗ wrangler.jsonc not found");
  process.exit(1);
}

console.log("✓ Build script completed successfully");
