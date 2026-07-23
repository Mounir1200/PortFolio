import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(".");
const output = resolve("dist");

if (existsSync(output)) rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const path of ["index.html", "styles.css", "hero.css", "app.js", "assets", "CV"]) {
  cpSync(resolve(root, path), resolve(output, path), { recursive: true });
}

console.log("Build terminé dans dist/");
