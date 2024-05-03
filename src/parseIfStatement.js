import parseDeclaration from "./parseDeclaration.js";
import parsePrintStatement, { parseExpression } from "./parsePrint.js";

export default function parseIfStatement(tokens, currentIndex, errors) {
  let node = {
    type: "IfStatement",
    test: null,
    testType: null,
    consequent: null,
    alternate: null,
  };

  // Skip 'agar'
  currentIndex++;
  if (
    tokens[currentIndex]?.type !== "paren" ||
    tokens[currentIndex]?.value !== "("
  ) {
    errors.push("Expected '(' after 'agar'");
    return { errors, newIndex: currentIndex };
  }

  // Move past '('
  currentIndex++;
  const expressionResult = parseExpression(tokens, currentIndex, errors);

  if (expressionResult.errors.length) {
    return {
      errors: expressionResult.errors,
      newIndex: expressionResult.newIndex,
    };
  }

  node.test = expressionResult.expression.value;
  node.testType = expressionResult.expression.type;
  currentIndex = expressionResult.newIndex;

  // Check for closing ')'
  if (
    tokens[currentIndex]?.type !== "paren" ||
    tokens[currentIndex]?.value !== ")"
  ) {
    errors.push("Expected ')' after condition");
    return { errors, newIndex: currentIndex };
  }

  // Move past ')'
  currentIndex++;

  // Check for opening '{'
  if (
    tokens[currentIndex]?.type !== "block" ||
    tokens[currentIndex]?.value !== "{"
  ) {
    errors.push("Expected '{' after ')'");
    return { errors, newIndex: currentIndex };
  }

  currentIndex++;
  const consequentResult = parseBlock(tokens, currentIndex, errors);
  node.consequent = consequentResult.ast.body;
  currentIndex = consequentResult.newIndex;

  if (
    tokens[currentIndex]?.type === "keyword" &&
    tokens[currentIndex]?.value === "nahiTo"
  ) {
    currentIndex++;

    if (
      tokens[currentIndex]?.type !== "block" ||
      tokens[currentIndex]?.value !== "{"
    ) {
      errors.push("Expected '{' after 'nahiTo'");
      return { errors, newIndex: currentIndex };
    }

    currentIndex++;
    const alternateResult = parseBlock(tokens, currentIndex, errors);
    node.alternate = alternateResult.ast.body;
    currentIndex = alternateResult.newIndex;
  }
  return { ast: node, newIndex: currentIndex, errors };
}

////////////////

export function parseBlock(tokens, index, errors) {
  let current = index;
  let ast = {
    type: "Block",
    body: [],
  };

  // Loop until the end of the block is reached or tokens run out
  while (
    current < tokens.length &&
    (tokens[current].type !== "block" || tokens[current].value !== "}")
  ) {
    let token = tokens[current];

    switch (token.value) {
      case "dikhao":
        const printResult = parsePrintStatement(tokens, current, errors);
        if (printResult.errors.length > 0) {
          errors.push(...printResult.errors);
          return { errors, newIndex: current };
        }
        ast.body.push(printResult.ast);
        current = printResult.newIndex;
        break;

      case "rakho":
        const declarationResult = parseDeclaration(tokens, current, errors);

        if (declarationResult.errors.length > 0) {
          errors.push(...declarationResult.errors);
          return { errors, newIndex: current };
        }
        ast.body.push(declarationResult.ast);
        current = declarationResult.newIndex;
        break;

      default:
        errors.push(`Unexpected token ${token.value} at index ${current}`);
        return { ast, newIndex: current, errors };
    }

    // Increment to skip past terminators or manage other control flow cases
    if (current < tokens.length && tokens[current].type === "terminator") {
      current++; // Move past the terminator, if present
    }
  }

  if (
    current < tokens.length &&
    tokens[current].type === "block" &&
    tokens[current].value === "}"
  ) {
    current++; // Step past the closing '}'
  } else {
    errors.push("Expected '}' at the end of the block.");
  }
  return {
    ast: ast,
    newIndex: current,
    errors: errors,
  };
}
// trying to make this function handle multiple lines and instead of ifelse use switch
// i will try to re assemble full function to hanlde multiple lilnes of code
