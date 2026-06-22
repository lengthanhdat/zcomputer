const fs = require('fs');

const path = 'c:/ZComputer/zcomputer/fe/src/components/CategoryClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the specific motion.div block with standard div
content = content.replace(
  /<motion\.div\s+initial=\{\{ opacity: 0, y: 40 \}\}\s+whileInView=\{\{ opacity: 1, y: 0 \}\}\s+viewport=\{\{ once: true, margin: "-50px" \}\}\s+transition=\{\{ duration: 0\.5, ease: "easeOut" \}\}\s+key=\{product\._id\}\s+className=\{`/g,
  '<div\n                      key={product._id}\n                      className={`animate-in fade-in slide-in-from-bottom-4 duration-500 '
);

// We should also replace the closing </motion.div> for that block
// But there are other motion.divs in the file! (like the sidebar, the top bar, the "not found" box).
// Wait! If we look at the file, the other motion.divs are:
// - <motion.aside (1)
// - <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} (1)
// - <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} (1)
// And the product card one.
// We can just find the closing tag of the product card which is followed by `);` and change it.
// Actually, it's easier to just use a regular expression for the specific closing tag.
// Let's replace `</motion.div>` with `</div>` but ONLY if it's right before `);` for the product map return.
content = content.replace(/<\/motion\.div>\s+\);\s+\}\);/g, '</div>\n                    );\n                  });');

// Let's also check if I missed replacing the opening tag. If not, maybe we can just do a more precise replacement.

fs.writeFileSync(path, content);
