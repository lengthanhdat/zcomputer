const fs = require('fs');

const homeClientPath = 'c:/ZComputer/zcomputer/fe/src/components/HomeClient.tsx';
const hotSalePath = 'c:/ZComputer/zcomputer/fe/src/components/HotSaleSection.tsx';

let homeLines = fs.readFileSync(homeClientPath, 'utf8').split('\n');
let hotSaleLines = fs.readFileSync(hotSalePath, 'utf8').split('\n');

// HomeClient inner card lines
const innerCardLines = homeLines.slice(533, 670);

// HotSaleSection inner card replacement
const newHotSaleLines = [
  ...hotSaleLines.slice(0, 232),
  ...innerCardLines,
  ...hotSaleLines.slice(371)
];

let hotSaleContent = newHotSaleLines.join('\n');

// Import LikeButton
if (hotSaleContent.indexOf('import LikeButton') === -1) {
  hotSaleContent = hotSaleContent.replace(
    'import DraggableSlider from "./DraggableSlider";',
    'import DraggableSlider from "./DraggableSlider";\nimport LikeButton from "./LikeButton";'
  );
}

// Re-apply mobile resize for HotSaleSection Left Sidebar
hotSaleContent = hotSaleContent.replace(
  'className="xl:w-[280px] shrink-0 p-8 flex flex-col items-center justify-center',
  'className="xl:w-[280px] shrink-0 p-4 md:p-8 flex flex-col items-center justify-center'
);

hotSaleContent = hotSaleContent.replace(
  'text-[36px] font-black uppercase italic tracking-tighter text-white',
  'text-[28px] md:text-[36px] font-black uppercase italic tracking-tighter text-white'
);

hotSaleContent = hotSaleContent.replace(
  'text-[36px] font-black uppercase italic tracking-tighter text-primary',
  'text-[28px] md:text-[36px] font-black uppercase italic tracking-tighter text-primary'
);

// We need to change the outer card container in HotSaleSection for mobile width
hotSaleContent = hotSaleContent.replace(
  'className={`flex-none w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-[0_20px_40px_var(--primary-ring)] hover:border-primary/50 hover:-translate-y-2 transition-all duration-500 flex flex-col relative ${isOutOfStock ? \'opacity-80\' : \'\'}`}',
  'className={`flex-none w-[180px] sm:w-[220px] md:w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-[0_20px_40px_var(--primary-ring)] hover:border-primary/50 hover:-translate-y-2 transition-all duration-500 flex flex-col relative ${isOutOfStock ? \'opacity-80\' : \'\'}`}'
);

fs.writeFileSync(hotSalePath, hotSaleContent);
console.log("Card replaced successfully in HotSaleSection");
