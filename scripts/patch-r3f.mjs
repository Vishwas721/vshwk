import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  "node_modules/@react-three/fiber/dist/react-three-fiber.cjs.js",
  "node_modules/@react-three/fiber/dist/react-three-fiber.esm.js",
  "node_modules/@react-three/fiber/dist/react-three-fiber.cjs.dev.js",
  "node_modules/@react-three/fiber/dist/react-three-fiber.cjs.prod.js",
];

for (const f of files) {
  const fullPath = path.resolve(__dirname, "..", f);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf8");
    if (!content.startsWith('"use client";')) {
      fs.writeFileSync(fullPath, '"use client";\n' + content, "utf8");
      console.log("Patched client boundary in:", f);
    }
  }
}
