const fs = require('fs');

function refactorHeader() {
  const filePath = 'c:/ZComputer/zcomputer/fe/src/components/Header.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  const startPattern = '{showSuggestions && (searchQuery.trim().length >= 1 ? suggestions.length > 0 : defaultSuggestions.length > 0) && (';
  const startIdx = content.indexOf(startPattern);
  if (startIdx === -1) {
    console.log("Could not find start pattern");
    return;
  }
  
  let openBrackets = 0;
  let endIdx = -1;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{' || content[i] === '(') openBrackets++;
    if (content[i] === '}' || content[i] === ')') openBrackets--;
    
    if (openBrackets === 0) {
      endIdx = i + 1;
      break;
    }
  }

  const dropdownCode = content.substring(startIdx, endIdx);

  const innerCode = dropdownCode.replace(startPattern, '').slice(0, -1).trim();

  const functionCode = `
  const renderSuggestionsDropdown = () => {
    if (!showSuggestions) return null;
    if (!(searchQuery.trim().length >= 1 ? suggestions.length > 0 : defaultSuggestions.length > 0)) return null;

    return (
      ${innerCode}
    );
  };
`;

  content = content.replace(dropdownCode, '{renderSuggestionsDropdown()}');

  const clearHistoryIdx = content.indexOf('const clearHistory');
  const returnIdx = content.indexOf('  return (', clearHistoryIdx);
  
  if (returnIdx === -1) {
    console.log("Could not find Header return statement");
    return;
  }
  content = content.substring(0, returnIdx) + functionCode + '\n' + content.substring(returnIdx);

  const oldMobileSearch = `        {/* Mobile Search Bar (Only visible on small devices) */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm linh kiện, PC, Laptop..."
              className="w-full border-2 border-primary rounded-full py-1.5 pl-4 pr-10 text-xs focus:outline-none"
            />
            <button type="submit" className="absolute right-0 top-0 h-full w-10 bg-primary rounded-r-full text-white flex items-center justify-center" aria-label="Tìm kiếm">
              <Search size={16} />
            </button>
          </form>
        </div>`;
        
  // Handle carriage returns
  const oldMobileSearchCRLF = oldMobileSearch.replace(/\n/g, '\r\n');
  const newMobileSearchCRLF = `        {/* Mobile Search Bar (Only visible on small devices) */}
        <div className="md:hidden px-4 pb-3 relative z-50">
          <form onSubmit={handleSearch} className="relative w-full group/search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm linh kiện, PC, Laptop..."
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full border-2 border-primary/20 bg-white/60 backdrop-blur-md rounded-full py-1.5 pl-4 pr-10 text-xs focus:outline-none focus:bg-white focus:border-primary/60 transition-all duration-300 shadow-inner group-hover/search:shadow-[0_0_15px_var(--primary-ring)]"
            />
            <button type="submit" className="absolute right-0 top-0 h-full w-10 bg-primary rounded-r-full text-white flex items-center justify-center hover:brightness-110" aria-label="Tìm kiếm">
              <Search size={16} />
            </button>
          </form>
          {renderSuggestionsDropdown()}
        </div>`.replace(/\n/g, '\r\n');

  if (content.indexOf(oldMobileSearchCRLF) !== -1) {
     content = content.replace(oldMobileSearchCRLF, newMobileSearchCRLF);
  } else if (content.indexOf(oldMobileSearch) !== -1) {
     content = content.replace(oldMobileSearch, newMobileSearchCRLF.replace(/\r\n/g, '\n'));
  } else {
     console.log("Could not find old mobile search");
  }

  fs.writeFileSync(filePath, content);
  console.log("Refactored Header.tsx successfully");
}

refactorHeader();
