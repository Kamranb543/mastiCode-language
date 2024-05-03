export default function tokenizer(code) {
  const tokens = [];
  let current = 0;
  const WHITESPACE = /\s/;
  const NUMBERS = /[0-9]/;
  const LETTERS = /[a-zA-Z]/;
  const OPERATORS = /[\+\-\*\/=<>!&|]/; // Updated to include comparison and logical operators

  const KEYWORDS = [
    "rakho",
    "dikhao",
    "agar",
    "nahiTo",
    "chaloShuruKren",
    "basKhatam",
    "dohraoJabTak", // add this line
  ];

  while (current < code.length) {
    let char = code[current];
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    if (char === "{" || char === "}") {
      tokens.push({ type: "block", value: char });
      current++;
      continue;
    }

    if (LETTERS.test(char)) {
      let word = "";
      while (LETTERS.test(char) && current < code.length) {
        word += char;
        char = code[++current];
      }
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: "keyword", value: word });
      } else {
        tokens.push({ type: "identifier", value: word });
      }
      continue;
    }

    if (char === ";" || char === ",") {
      tokens.push({ type: "terminator", value: char });
      current++;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      current++;
      continue;
    }

    if (char === "'" || char === '"') {
      let value = "";
      let startQuote = char;
      char = code[++current];

      while (char !== startQuote) {
        if (current >= code.length) {
          throw new TypeError("Unterminated string literal");
        }
        value += char;
        char = code[++current];
      }
      tokens.push({ type: "string", value: value });
      current++;
      continue;
    }

    if (NUMBERS.test(char)) {
      let num = "";
      while (NUMBERS.test(char)) {
        num += char;
        char = code[++current];
      }
      tokens.push({ type: "number", value: parseInt(num) });
      continue;
    }

    if (OPERATORS.test(char)) {
      let operator = char;
      char = code[++current];
      // Handle multi-character operators (like '&&', '||', '==', etc.)
      if (
        (operator === "&" && char === "&") ||
        (operator === "|" && char === "|") ||
        (operator === "=" && char === "=") ||
        (operator === "!" && char === "=") ||
        (operator === ">" && char === "=") ||
        (operator === "<" && char === "=")
      ) {
        operator += char;
        current++;
      }
      tokens.push({ type: "operator", value: operator });
      continue;
    }

    throw new TypeError("Unknown character: " + char);
  }
  return tokens;
}
