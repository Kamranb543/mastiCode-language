import tokenizer from "./tokenGenerator.js";
import parser from "./parser.js";
import codeGenerator from "./codeGenerator.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function compiler(code) {
  const tokens = tokenizer(code);
  const result = parser(tokens);

  if (result.errors.length) {
    console.log(result.errors);
  } else {
    const generatedCode = codeGenerator(result.ast);
    eval(generatedCode);
  }
}
const currentPath = fileURLToPath(import.meta.url);
const scriptPath = path.resolve(process.argv[1]);

if (scriptPath === currentPath) {
  console.log("Running as main script");
  if (process.argv.length < 3) {
    console.log("Usage: node compiler.js <filename.masti>");
    process.exit(1);
  }

  const filename = process.argv[2];
  const filePath = path.resolve(filename);
  try {
    const code = fs.readFileSync(filePath, "utf8");
    console.log("Compiling file:", filePath);
    compiler(code);
  } catch (err) {
    console.error("Error reading file:", err);
  }
} else {
  console.log("Script running as imported module");
}
