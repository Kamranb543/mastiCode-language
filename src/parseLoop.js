import { parseBlock } from "./parseIfStatement.js";
import { parseExpression } from "./parsePrint.js";

export default function parseWhileStatement(tokens, index, errors) {
  let current = index + 1; // Start after 'jabTak'
  if (tokens[current].type !== "paren" || tokens[current].value !== "(") {
    errors.push("Expected '(' after 'jabTak'");
    return { errors, newIndex: current };
  }
  current++;

  const { expression: condition, newIndex: afterConditionIndex } =
    parseExpression(tokens, current, errors);
  current = afterConditionIndex;

  if (tokens[current].type !== "paren" || tokens[current].value !== ")") {
    errors.push("Expected ')' after condition");
    return { errors, newIndex: current };
  }
  current++;
  current++;

  const data = parseBlock(tokens, current, errors);
  const loopBody = data.ast.body;
  current = data.newIndex;
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
