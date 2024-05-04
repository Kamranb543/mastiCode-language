export function parseExpression(tokens, index, errors) {
  let current = index;
  let operands = [];
  let operators = [];

  while (
    current < tokens.length &&
    !(tokens[current].type === "paren" && tokens[current].value === ")")
  ) {
    const token = tokens[current];

    if (
      token.type === "number" ||
      token.type === "identifier" ||
      token.type === "string" ||
      token.type === "paren"
    ) {
      operands.push({ type: token.type, value: token.value });
    } else if (token.type === "operator") {
      operators.push(token.value);
    } else {
      errors.push(`Unexpected token in expression: ${token.value}`);
      return { errors, newIndex: current }; // Return immediately with error
    }
    current++;
  }

  if (operands.length === 0) {
    errors.push("No operands in expression.");
    return { errors, newIndex: current };
  }

  let expression = operands.shift();
  if (operators[0] === "++" || operators[0] === "--") {
    expression = {
      type: "unaryOperator",
      value: `${expression.value}${operators[0]}`,
    };
  } else {
    while (operators.length > 0 && operands.length > 0) {
      let operator = operators.shift();
      let nextOperand = operands.shift();
      expression = {
        type: expression.type,
        value: `${expression.value} ${operator} ${nextOperand.value}`,
      };
    }
  }
  return {
    expression: expression,
    newIndex: current,
    errors: errors,
  };
}

export default function parsePrintStatement(tokens, index, errors) {
  let current = index + 1; // Start after 'dikhao'

  if (
    current >= tokens.length ||
    tokens[current].type !== "paren" ||
    tokens[current].value !== "("
  ) {
    errors.push("Bhai! 'dikhao' ke baad '(' hona chahiye.");
    return { errors, newIndex: current };
  }

  current++;

  const { expression, newIndex } = parseExpression(tokens, current, errors);
  if (!expression) {
    return { errors, newIndex };
  }
  current = newIndex;

  if (
    current >= tokens.length ||
    tokens[current].type !== "paren" ||
    tokens[current].value !== ")"
  ) {
    errors.push("Ghalti se mistake! 'dikhao(' ke baad ')' bhool gaye kya?");
    return { errors, newIndex: current };
  }

  current++; // Move past the ')'

  // Check for the semicolon terminator
  if (current < tokens.length && tokens[current].type === "terminator") {
    current++; // Consume the terminator, like a semicolon
  } else {
    errors.push(
      "ERROR: Bhai! Statement ke end mein semicolon (';') lagana bhool gaye."
    );
  }

  if (current < tokens.length && tokens[current].type === "terminator") {
    current++; // Consume optional terminator, like a semicolon
  }
  return {
    ast: {
      type: "print",
      value: expression.value,
      valueType: expression.type,
    },
    newIndex: current,
    errors: [],
  };
}
