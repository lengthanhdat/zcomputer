const fs = require('fs');

function fixHeaderAgain() {
  const filePath = 'c:/ZComputer/zcomputer/fe/src/components/Header.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // The function is currently at the very beginning of the file.
  // It starts at index 0 and ends at `  };\n`
  const endPattern = '    );\n  };\n';
  const endIdx = content.indexOf(endPattern) + endPattern.length;
  
  const functionCode = content.substring(0, endIdx);
  content = content.substring(endIdx); // remove it from the top
  
  // Now find the start of the return in Header.
  // We can search for `  return (\n    <>` but let's be more robust:
  const headerReturnPattern = '  return (\n    <>';
  let headerReturnIdx = content.indexOf(headerReturnPattern);
  
  if (headerReturnIdx === -1) {
    headerReturnIdx = content.indexOf('  return (');
  }

  if (headerReturnIdx === -1) {
    console.log("Could not find Header return statement");
    return;
  }
  
  content = content.substring(0, headerReturnIdx) + functionCode + '\n' + content.substring(headerReturnIdx);
  
  // also fix the missing quotes around Z at the end of the file if it got messed up? no, that was a previous error.
  
  fs.writeFileSync(filePath, content);
  console.log("Fixed Header.tsx again");
}

fixHeaderAgain();
