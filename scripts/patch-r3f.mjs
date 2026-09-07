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

// Silence THREE.Clock deprecation warning triggered by @react-three/fiber root store initialization
const threeFiles = [
  "node_modules/three/build/three.core.js",
  "node_modules/three/build/three.cjs",
  "node_modules/three/src/core/Clock.js",
];

for (const f of threeFiles) {
  const fullPath = path.resolve(__dirname, "..", f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");
    const target = "warn( 'Clock: This module has been deprecated. Please use THREE.Timer instead.' );";
    if (content.includes(target)) {
      content = content.replaceAll(target, "// [silenced for R3F compatibility] " + target);
      fs.writeFileSync(fullPath, content, "utf8");
      console.log("Silenced Clock deprecation warning in:", f);
    }
  }
}
