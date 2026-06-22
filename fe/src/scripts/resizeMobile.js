const fs = require('fs');

const hotSalePath = 'c:/ZComputer/zcomputer/fe/src/components/HotSaleSection.tsx';
let hotSale = fs.readFileSync(hotSalePath, 'utf8');

hotSale = hotSale.replace(
  'className="xl:w-[280px] shrink-0 p-8 flex flex-col items-center justify-center',
  'className="xl:w-[280px] shrink-0 p-4 md:p-8 flex flex-col items-center justify-center'
);

hotSale = hotSale.replace(
  'text-[36px] font-black uppercase italic tracking-tighter text-white',
  'text-[28px] md:text-[36px] font-black uppercase italic tracking-tighter text-white'
);

hotSale = hotSale.replace(
  'text-[36px] font-black uppercase italic tracking-tighter text-primary',
  'text-[28px] md:text-[36px] font-black uppercase italic tracking-tighter text-primary'
);

hotSale = hotSale.replace(
  'flex-none w-[280px] bg-white rounded-2xl',
  'flex-none w-[160px] sm:w-[200px] md:w-[280px] bg-white rounded-2xl'
);

hotSale = hotSale.replace(
  'aspect-[4/3] p-6 flex items-center justify-center',
  'aspect-[4/3] p-3 md:p-6 flex items-center justify-center'
);

hotSale = hotSale.replace(
  'className="p-5 flex flex-col flex-1 bg-white',
  'className="p-3 md:p-5 flex flex-col flex-1 bg-white'
);

hotSale = hotSale.replace(
  'text-gray-800 text-[14px] font-bold leading-snug line-clamp-2',
  'text-gray-800 text-[12px] md:text-[14px] font-bold leading-snug line-clamp-2'
);

hotSale = hotSale.replace(
  'text-primary text-[18px] font-black leading-none tracking-tight',
  'text-primary text-[15px] md:text-[18px] font-black leading-none tracking-tight'
);

hotSale = hotSale.replace(
  'text-gray-400 text-[13px] font-semibold line-through ml-2',
  'text-gray-400 text-[11px] md:text-[13px] font-semibold line-through ml-2'
);

// Decrease text sizes for buttons
hotSale = hotSale.replace(
  'text-[10px] font-black text-gray-500 tracking-widest uppercase bg-gray-100 px-2.5 py-1',
  'text-[9px] md:text-[10px] font-black text-gray-500 tracking-widest uppercase bg-gray-100 px-1.5 md:px-2.5 py-1'
);

fs.writeFileSync(hotSalePath, hotSale);

const videoReviewPath = 'c:/ZComputer/zcomputer/fe/src/components/VideoReviewSection.tsx';
let videoReview = fs.readFileSync(videoReviewPath, 'utf8');

videoReview = videoReview.replace(
  'className="min-w-[260px] w-[75vw] sm:w-[45vw] md:w-auto md:min-w-0 shrink-0 snap-center md:snap-align-none"',
  'className="min-w-[150px] w-[45vw] sm:w-[35vw] md:w-auto md:min-w-0 shrink-0 snap-center md:snap-align-none"'
);

videoReview = videoReview.replace(
  'font-bold text-[11px] uppercase opacity-80 group-hover/btn:opacity-100 mb-0.5',
  'font-bold text-[9px] md:text-[11px] uppercase opacity-80 group-hover/btn:opacity-100 mb-0.5'
);

videoReview = videoReview.replace(
  'font-bold text-sm line-clamp-1 px-2 text-center flex items-center gap-1',
  'font-bold text-[10px] md:text-sm line-clamp-1 px-1 md:px-2 text-center flex items-center justify-center gap-1'
);

fs.writeFileSync(videoReviewPath, videoReview);
