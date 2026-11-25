// TDD-lite checks for the Angry Judge entry (run from the entry dir):
// gate (1-400 chars, UTF-8, not only whitespace), determinism,
// stdlib-only imports in main.ts.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const entryDir = process.cwd();
const mainTs = readFileSync(join(entryDir, "main.ts"), "utf8");

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

// 1. Stdlib-only: every import must start with "node:".
const imports = [...mainTs.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
check(
  "stdlib-only imports",
  imports.length > 0 && imports.every((i) => i.startsWith("node:")),
  imports.join(", "),
);

// 2 + 3. Run twice into fresh temp dirs: gate + determinism.
const outputs = [];
for (let i = 0; i < 2; i++) {
  const dir = mkdtempSync(join(tmpdir(), "angry-judge-test-"));
  execFileSync("node", ["main.ts"], {
    cwd: entryDir,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: dir, MAKEFUN_INPUT_DIR: "/input" },
    stdio: "pipe",
  });
  outputs.push(readFileSync(join(dir, "entry.txt"), "utf8"));
  rmSync(dir, { recursive: true, force: true });
}
const text = outputs[0];
check("entry is 1-400 chars", text.length >= 1 && text.length <= 400, `${text.length} chars`);
check("entry is not only whitespace", text.trim().length > 0);
check("entry is valid UTF-8 text (round-trips)", Buffer.from(text, "utf8").toString("utf8") === text);
check("deterministic across runs", outputs[0] === outputs[1]);

if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log("All checks passed.");
console.log("ENTRY:", JSON.stringify(text));
