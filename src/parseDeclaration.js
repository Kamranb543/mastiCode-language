export default function parseDeclaration(tokens, index, errors) {
  let current = index + 1; // Start after 'rakho'
  if (current >= tokens.length) {
    errors.push("ERROR: 'rakho' ke baad kuch likhna to banta hai.");
    return { errors, newIndex: current };
  }

  let tokenName = tokens[current];
  if (tokenName.type !== "identifier") {
    errors.push("ERROR: Arrey bhai! 'rakho' ke baad identifier hi aata hai.");
    return { errors, newIndex: findNextStatementOrKeyword(tokens, current) };
  }
  current++;

  if (current >= tokens.length || tokens[current].type === "terminator") {
    errors.push("ERROR: Bhai identifier ke baad '=' kahan gaya?");
    return { errors, newIndex: findNextStatementOrKeyword(tokens, current) };
  }

  let operatorToken = tokens[current];
  if (operatorToken.type !== "operator" || operatorToken.value !== "=") {
    errors.push("ERROR: Masti na karo, identifier ke baad '=' lagao.");
    return {
      errors,
      newIndex: findNextStatementOrKeyword(tokens, current + 1),
    };
  }
  current++;

  if (current >= tokens.length) {
    errors.push("ERROR: '=' ke baad to kuch value honi chahiye na?");
    return { errors, newIndex: findNextStatementOrKeyword(tokens, current) };
  }

  let expression = "";
  let valueType = "variable"; // Default to variable, will change if a specific type is detected
  while (
    current < tokens.length &&
    tokens[current].type !== "terminator" &&
    tokens[current].type !== "keyword"
  ) {
    if (tokens[current].type === "string") {
      expression += "'" + tokens[current].value + "'";
      valueType = "string"; // Change type to string
    } else {
      expression += tokens[current].value;
      if (tokens[current].type === "number") {
        valueType = "number"; // Change type to number if number is detected
      }
    }
    current++;
  }
  if (current >= tokens.length || tokens[current].type !== "terminator") {
    errors.push("ERROR: Are bhai! Semicolon (';') lagana bhool gaye.");
    current = findNextStatementOrKeyword(tokens, current); // Move to the start of the next valid statement or keyword
  } else {
    current++; // Move past the terminator if it exists
  }

  return {
    ast: {
      type: "Declaration",
      name: tokenName.value,
      value: expression.trim(),
      valueType: valueType,
    },
    newIndex: current,
    errors,
  };
}

// Utility to find the index of the next statement or keyword
function findNextStatementOrKeyword(tokens, startIndex) {
  for (let i = startIndex; i < tokens.length; i++) {
    if (tokens[i].type === "terminator" || tokens[i].type === "keyword") {
      return i + 1; // Position after the terminator or keyword
    }
  }
  return tokens.length; // If no terminator or keyword is found, return end of tokens
}
