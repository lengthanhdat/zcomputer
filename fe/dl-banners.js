const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
    await download('https://w.ladicdn.com/s2200x1050/624d648c467ecd0012c548a9/2-20260602190134-51577.png', 'd:/zcomputer/fe/public/ladibanner1.png');
    await download('https://w.ladicdn.com/s2200x1050/624d648c467ecd0012c548a9/1-20260602190133-nibz_.png', 'd:/zcomputer/fe/public/ladibanner2.png');
    console.log("Downloaded");
})();
