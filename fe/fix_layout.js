const fs = require('fs');
const path = 'c:/ZComputer/zcomputer/fe/src/app/[slug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const startSidebar = content.indexOf('          {/* Right Column: Sidebar (Similar Products) */}');
const endSidebar = content.indexOf('        </div> {/* End Right Column */}') + '        </div> {/* End Right Column */}'.length;

const startMap = content.indexOf('{similarProducts.slice(0, 5).map((p) => {');
const endMap = content.indexOf('</div>\n                    </div>\n                  </div>\n                );\n              })}');

let cardInner = content.substring(startMap, endMap + '</div>\n                    </div>\n                  </div>\n                );\n              })}'.length);

let fullSliderMap = cardInner.replace('{similarProducts.slice(0, 5).map((p) => {', '{similarProducts.map((p) => {');

fullSliderMap = fullSliderMap.replace('className={\w-full bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm flex flex-col relative transition-all duration-300 \\}', 'className={\snap-start shrink-0 w-[170px] md:w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-md flex flex-col relative transition-all duration-500 \\}');

const title1 = Buffer.from('U+1EA3n ph+1EA9m kh+E1c', 'ascii').toString(); // We'll just read the title from the original!
// Wait, we can just use the exact strings from the file to avoid encoding issues!
const originalTitle = content.substring(content.indexOf('S?n ph?m tuong t?'), content.indexOf('S?n ph?m tuong t?') + 17);

const minimalSidebar =           {/* Right Column: Sidebar (Minimal Products) */}
          <div className="lg:col-span-4 space-y-8">
            {similarProducts.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sticky top-24">
                <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight relative inline-block">
                  S?n ph?m khác
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
                </h2>
                <div className="flex flex-col gap-4">
                  {similarProducts.slice(0, 5).map((p) => {
                    const currentPrice = (p.isHotSale && p.flashSalePrice && p.flashSalePrice < p.price) ? p.flashSalePrice : p.price;
                    return (
                      <Link key={p._id} href={\/\\} className="flex gap-4 items-center group hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-colors">
                        <div className="w-20 h-20 shrink-0 bg-white border border-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center p-2">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" unoptimized />
                          ) : null}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-1">{p.name}</h3>
                          <span className="text-primary font-black text-[14px]">\</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div> {/* End Right Column */}
;

const fullSliderSection = 
        {/* Full Similar Products Slider */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight relative inline-block">
              S?n ph?m tuong t?
              <div className="absolute -bottom-3 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar scroll-smooth">
              \
            </div>
          </div>
        )}
;

content = content.substring(0, startSidebar) + minimalSidebar + content.substring(endSidebar);

const gridEnd = content.indexOf('      </div> {/* End Bottom Section Grid */}') + '      </div> {/* End Bottom Section Grid */}'.length;
content = content.substring(0, gridEnd) + '\\n' + fullSliderSection + content.substring(gridEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('Success');
