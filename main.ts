// Angry Judge: The Short Rant Contest — entry program.
// Writes one short, funny rant about an everyday annoyance to
// $MAKEFUN_OUTPUT_DIR/entry.txt. Node 22+, stdlib only, deterministic.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "Every Saturday at 7 a.m. my neighbor fires up his leaf blower to move " +
  "three leaves from his driveway onto my lawn. He waves. He smiles. He " +
  "has never once picked up a leaf — he just blows the same one in " +
  "circles for twenty minutes, a man at war with autumn, losing. The " +
  "leaves now live with me. He has a rake. I have seen it, hanging in " +
  "his garage like a museum piece.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const inputDir = process.env.MAKEFUN_INPUT_DIR ?? "/input";
void inputDir; // This entry takes no input; the dir is accepted for parity.

const scriptDir = dirname(fileURLToPath(import.meta.url));
void scriptDir; // Entry text is embedded; no file is read from the repo.

if (ENTRY.length < 1 || ENTRY.length > 400 || ENTRY.trim().length === 0) {
  throw new Error(`entry length ${ENTRY.length} is outside the 1-400 gate`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
