#!/usr/bin/env node
/*
Copilot instructions:
- If the user says exactly "generate new thumbnails" or "generate thumbnails", run this script.
- This script deletes the old `thumbnails/` folder, recreates it, and generates new thumbnails from `images/`.
- Thumbnails are written to `thumbnails/` with the same base filename and `_thumb` suffix (e.g. `10_thumb.jpg`).
- Default thumbnail width: 300px (keeps aspect ratio).
- Supported input formats: jpg, jpeg, png.

Usage:
  npm run generate-thumbnails
  npm run generate-new-thumbnails

*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const THUMBS_DIR = path.join(__dirname, '..', 'thumbnails');
const WIDTH = 300;

async function ensureEmptyDir(dir) {
  if (fs.existsSync(dir)) {
    await fs.promises.rm(dir, { recursive: true, force: true });
  }
  await fs.promises.mkdir(dir, { recursive: true });
}

async function generate() {
  try {
    console.log('Preparing thumbnails folder...');
    await ensureEmptyDir(THUMBS_DIR);

    const files = await fs.promises.readdir(IMAGES_DIR);
    const imageFiles = files.filter(f => /\.(jpe?g|png)$/i.test(f));

    if (imageFiles.length === 0) {
      console.log('No images found in', IMAGES_DIR);
      return;
    }

    console.log(`Found ${imageFiles.length} images. Generating thumbnails ...`);

    const tasks = imageFiles.map(async (file) => {
      const inputPath = path.join(IMAGES_DIR, file);
      const ext = path.extname(file);
      const base = path.basename(file, ext);
      const outName = `${base}_thumb${ext.toLowerCase()}`;
      const outPath = path.join(THUMBS_DIR, outName);

      try {
        await sharp(inputPath)
          .resize({ width: WIDTH })
          .toFile(outPath);
        console.log('Created', outName);
      } catch (err) {
        console.error('Failed to process', file, err.message);
      }
    });

    await Promise.all(tasks);

    console.log('All thumbnails generated in', THUMBS_DIR);
  } catch (err) {
    console.error('Error during thumbnail generation:', err);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  generate();
}

module.exports = { generate };
