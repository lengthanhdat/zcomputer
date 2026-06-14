const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');

async function processImage() {
    try {
        console.log("Removing background...");
        const blob = await removeBackground('d:/zcomputer/fe/public/hero-composition.jpg');
        console.log("Converting to buffer...");
        const buffer = Buffer.from(await blob.arrayBuffer());
        console.log("Writing to file...");
        fs.writeFileSync('d:/zcomputer/fe/public/hero-composition-transparent.png', buffer);
        console.log("Done!");
    } catch (e) {
        console.error("Error:", e);
    }
}
processImage();
