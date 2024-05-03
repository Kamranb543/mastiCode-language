import { parseBlock } from "./parseIfStatement";
import { parseExpression } from "./parsePrint";

export default function parseWhileStatement(tokens, index, errors) {
  let current = index + 1; // Start after 'jabTak'

  if (tokens[current].type !== "paren" || tokens[current].value !== "(") {
    errors.push("Expected '(' after 'jabTak'");
    return { errors, newIndex: current };
  }
  current++; // Move past '('

  const { expression: condition, newIndex: afterConditionIndex } =
    parseExpression(tokens, current, errors);
  current = afterConditionIndex;

  if (tokens[current].type !== "paren" || tokens[current].value !== ")") {
    errors.push("Expected ')' after condition");
    return { errors, newIndex: current };
  }
  current++; // Move past ')'

  const { body: loopBody, newIndex: afterBodyIndex } = parseBlock(
    tokens,
    current,
    errors
  );
  current = afterBodyIndex;

  return {
    ast: {
      type: "WhileStatement",
      test: condition.value,
      body: loopBody,
    },
    newIndex: current,
    errors,
  };
}
