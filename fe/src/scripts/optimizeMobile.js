const fs = require('fs');

const hotSalePath = 'c:/ZComputer/zcomputer/fe/src/components/HotSaleSection.tsx';
let hotSale = fs.readFileSync(hotSalePath, 'utf8');

hotSale = hotSale.replace(
  'className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4000px] h-[4000px] bg-[conic-gradient(from_0deg,transparent_0_300deg,var(--primary)_360deg)] animate-[spin_6s_linear_infinite] z-0 opacity-100"',
  'className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4000px] h-[4000px] bg-[conic-gradient(from_0deg,transparent_0_300deg,var(--primary)_360deg)] animate-[spin_6s_linear_infinite] z-0 opacity-100"'
);

// Fallback border for mobile
hotSale = hotSale.replace(
  '<div className="absolute inset-0 bg-gray-800 z-0"></div>',
  '<div className="absolute inset-0 bg-gray-800 z-0"></div>\n        <div className="md:hidden absolute inset-0 rounded-2xl border-[3px] border-primary z-0"></div>'
);

hotSale = hotSale.replace(
  'className="bg-[#0b0f19]/70 backdrop-blur-3xl rounded-[13px] overflow-hidden relative z-10 h-full w-full border border-white/5"',
  'className="bg-[#0b0f19]/70 backdrop-blur-md md:backdrop-blur-3xl rounded-[13px] overflow-hidden relative z-10 h-full w-full border border-white/5"'
);

hotSale = hotSale.replace(
  'className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen"',
  'className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-primary/20 blur-[60px] md:blur-[120px] rounded-full mix-blend-screen"'
);

hotSale = hotSale.replace(
  'className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"',
  'className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-blue-600/20 blur-[60px] md:blur-[120px] rounded-full mix-blend-screen"'
);

hotSale = hotSale.replace(
  '<Zap size={56} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse -ml-4" />',
  '<Zap size={56} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] md:animate-pulse -ml-4" />'
);

hotSale = hotSale.replace(
  '<Timer size={24} className="text-primary animate-pulse shrink-0 drop-shadow-[0_0_5px_var(--primary-ring)]" />',
  '<Timer size={24} className="text-primary md:animate-pulse shrink-0 drop-shadow-[0_0_5px_var(--primary-ring)]" />'
);

fs.writeFileSync(hotSalePath, hotSale);
console.log("Optimized HotSaleSection for mobile");
