const fs = require('fs');

function fixHeader() {
  const filePath = 'c:/ZComputer/zcomputer/fe/src/components/Header.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  const startPattern = '  const renderSuggestionsDropdown = () => {';
  const startIdx = content.indexOf(startPattern);
  
  const endPattern = '    );\n  };\n';
  const endIdx = content.indexOf(endPattern, startIdx) + endPattern.length;
  
  const functionCode = content.substring(startIdx, endIdx);
  
  // Remove it from current location
  content = content.replace(functionCode, '');
  
  // Find the return of Header component.
  // The Header component starts with:
  // export default function Header() {
  // It has a return (
  // <header
  
  const headerReturnPattern = '  return (\n    <>';
  const headerReturnIdx = content.indexOf(headerReturnPattern);
  
  content = content.substring(0, headerReturnIdx) + functionCode + '\n' + content.substring(headerReturnIdx);
  
  fs.writeFileSync(filePath, content);
  console.log("Fixed Header.tsx");
}

fixHeader();
