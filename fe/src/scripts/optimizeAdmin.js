const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/ZComputer/zcomputer/fe/src/app/admin');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Wrap tables in whitespace-nowrap if not present
  if (content.includes('<table ')) {
    const newContent = content.replace(/<table\s+className="([^"]*)"/g, (match, classes) => {
      if (!classes.includes('whitespace-nowrap')) {
        return `<table className="whitespace-nowrap min-w-max ${classes}"`;
      }
      return match;
    });
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }

  // 2. Reduce padding on mobile
  if (content.includes('p-8')) {
    // Only target p-8 when it is part of a class name
    const newContent = content.replace(/(["' ])p-8(["' ])/g, '$1p-4 md:p-8$2');
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }
  
  if (content.includes('p-6')) {
    const newContent = content.replace(/(["' ])p-6(["' ])/g, '$1p-4 md:p-6$2');
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }

  // 3. Fix fixed grids that break on mobile
  if (content.includes('grid-cols-2') && !content.includes('md:grid-cols-2') && !content.includes('sm:grid-cols-2')) {
     const newContent = content.replace(/grid-cols-2/g, 'grid-cols-1 sm:grid-cols-2');
     if (newContent !== content) {
         content = newContent;
         changed = true;
     }
  }

  // 4. Products page specific: the top filters grid
  if (content.includes('grid-cols-2 lg:grid-cols-5')) {
     const newContent = content.replace('grid-cols-2 lg:grid-cols-5', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5');
     if (newContent !== content) {
         content = newContent;
         changed = true;
     }
  }

  // 5. Some other common fixes: <div className="flex items-center gap-4"> => flex-col sm:flex-row if it has buttons
  // Actually, we'll just fix flex-wrap
  if (content.includes('flex items-center justify-between mb-6')) {
    const newContent = content.replace(/flex items-center justify-between mb-6/g, 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6');
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
