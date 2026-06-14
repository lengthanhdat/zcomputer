const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status: ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  try {
    console.log('Downloading laptop...');
    await download('https://freepngimg.com/thumb/laptop/11-laptop-png-image.png', 'd:/zcomputer/fe/public/laptop.png');
    console.log('Downloading PC...');
    await download('https://freepngimg.com/thumb/pc/8-pc-computer-png-image-thumb.png', 'd:/zcomputer/fe/public/pc.png');
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
})();
