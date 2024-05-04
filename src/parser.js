import parseDeclaration from "./parseDeclaration.js";
import parseIfStatement from "./parseIfStatement.js";
import parseWhileStatement from "./parseLoop.js";
import parsePrintStatement from "./parsePrint.js";

export default function parser(tokens) {
  let ast = {
    type: "Program",
    body: [],
  };
  let errors = [];
  let current = 0;
  if (
    tokens[current].type === "keyword" &&
    tokens[current].value === "chaloShuruKren" &&
    tokens[tokens.length - 2].value === "basKhatam"
  ) {
    current++;
    if (
      tokens[current].type !== "block" ||
      tokens[current].value !== "{" ||
      tokens[tokens.length - 1].value !== "}"
    ) {
      errors.push(
        "Oi bhai! Code k shuru men aur akhir men { } ka istemal lazmi h!!"
      );
      return { ast, errors };
    }
    current++;
  } else {
    errors.push(
      `Bhai sahab, code ko "chaloShuruKren {  //code goes here//    basKhatam}" k andr likhen!!!`
    );
    return { ast, errors };
  }

  while (current < tokens.length - 2) {
    let token = tokens[current];
    if (token.type === "keyword") {
      switch (token.value) {
        case "rakho":
          try {
            let declaration = parseDeclaration(tokens, current, errors);
            ast.body.push(declaration.ast);
            current = declaration.newIndex;
          } catch (error) {
            errors.push(error.message);
            break;
          }
          break;
        case "dikhao":
          try {
            let printStatement = parsePrintStatement(tokens, current, errors);
            ast.body.push(printStatement.ast);
            current = printStatement.newIndex;
          } catch (error) {
            errors.push(error.message);
            break;
          }
          break;
        case "agar":
          try {
            let ifstatement = parseIfStatement(tokens, current, errors);
            ast.body.push(ifstatement.ast);
            current = ifstatement.newIndex;
          } catch (error) {
            errors.push(error.message);
            break;
          }
          current++;
          break;
        case "dohraoJabTak":
          try {
            let whileStatement = parseWhileStatement(tokens, current, errors);
            ast.body.push(whileStatement.ast);
            current = whileStatement.newIndex;
          } catch (error) {
            errors.push(error.message);
            break;
          }
          break;
        default:
          errors.push(
            `Ghalti hai bhai! '${token.value}' kiya h ye? Samajh nahi aaya.`
          );
          break;
      }
    } else {
      errors.push(`Kya aap syntax bhool gye?`);
      break;
    }
  }
  if (tokens[current].value === "basKhatam") {
    current++;
    if (tokens[current].type === "block" && tokens[current].value === "}") {
      current++;
    } else {
      errors.push('Code should end with "}" after "basKhatam"');
    }
  } else {
    errors.push('Expected "basKhatam" at the end of the code block.');
  }
  // console.log(ast);
  return { ast, errors };
}
