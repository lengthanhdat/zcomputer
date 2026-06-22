const fs = require('fs');

const homeClientPath = 'c:/ZComputer/zcomputer/fe/src/components/HomeClient.tsx';
const hotSalePath = 'c:/ZComputer/zcomputer/fe/src/components/HotSaleSection.tsx';

let homeContent = fs.readFileSync(homeClientPath, 'utf8');
let hotSaleContent = fs.readFileSync(hotSalePath, 'utf8');

// Find the start of the card in HomeClient
const homeCardStartPattern = '<Link href={`/${product.slug}`} className="absolute inset-0 z-20"></Link>';
const homeCardStartIndex = homeContent.indexOf(homeCardStartPattern);

// Find the end of the card in HomeClient
const homeCardEndPattern = '</div>\n    </div>';
const homeCardEndIndex = homeContent.indexOf(homeCardEndPattern, homeCardStartIndex) + homeCardEndPattern.length;

const cardCode = homeContent.substring(homeCardStartIndex, homeCardEndIndex);

// Find the start of the card in HotSaleSection
const hotSaleCardStartPattern = '<Link href={`/${product.slug}`} className="absolute inset-0 z-20"></Link>';
const hotSaleCardStartIndex = hotSaleContent.indexOf(hotSaleCardStartPattern);

// Find the end of the card in HotSaleSection
const hotSaleCardEndPattern = '</div>\n                      </div>';
const hotSaleCardEndIndex = hotSaleContent.indexOf(hotSaleCardEndPattern, hotSaleCardStartIndex) + hotSaleCardEndPattern.length;

// Replace
hotSaleContent = hotSaleContent.substring(0, hotSaleCardStartIndex) + cardCode + hotSaleContent.substring(hotSaleCardEndIndex);

// Add LikeButton import if not exists
if (hotSaleContent.indexOf('import LikeButton') === -1) {
  hotSaleContent = hotSaleContent.replace(
    'import DraggableSlider from "./DraggableSlider";',
    'import DraggableSlider from "./DraggableSlider";\nimport LikeButton from "./LikeButton";'
  );
}

fs.writeFileSync(hotSalePath, hotSaleContent);
console.log("Card copied successfully");
