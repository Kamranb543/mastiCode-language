export default function codeGenerator(raw) {
  let node = raw;
  switch (node.type) {
    case "Program":
      return node.body.map(codeGenerator).join("\n");
    case "print":
      // Format the output based on the value type
      const formattedValue = formatValue(node.value, node.valueType);
      return `console.log(${formattedValue});`;
    case "Declaration":
      if (!node.name || node.value === undefined) {
        console.error(
          "ERROR: Kuch to gadbad hai daya, check kro 'rakho' command properly."
        );
      }
      // Use the formatted value based on valueType
      const declaredValue = formatValue(node.value, node.valueType);
      return `let ${node.name} = ${declaredValue};`;

    case "IfStatement":
      const consequentCode = node.consequent.map(codeGenerator).join("\n");
      let ifCode = `if (${node.test}) {\n${consequentCode}\n}`;
      if (node.alternate && node.alternate.length > 0) {
        const alternateCode = node.alternate.map(codeGenerator).join("\n");
        ifCode += ` else {\n${alternateCode}\n}`;
      }
      return ifCode;
    case "WhileStatement":
      const bodyCode = node.body.map(codeGenerator).join("\n");
      return `while (${node.test}) {\n${bodyCode}\n}`;
    default:
      console.error(`ERROR: Yeh kya bakwas node hai bhai? -> ${node.type}`);
  }
}

function formatValue(value, valueType) {
  switch (valueType) {
    case "string":
      return `'${value}'`; // Wrap string values with single quotes
    case "number":
      return value; // Use number values directly
    case "identifier":
      return value; // Direct use of identifier names (assuming they are variables)
    default:
      console.error(`ERROR: Unhandled value type: ${valueType}`);
      return value; // Fallback, just in case
  }
}
