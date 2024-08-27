import { readFileSync, writeFileSync } from "fs";
import generateVersion from "./gen-version.mjs";

const pack = JSON.parse(readFileSync("package.json"));
pack.version = generateVersion();

writeFileSync("package.json", JSON.stringify(pack, null, "\t") + "\n");