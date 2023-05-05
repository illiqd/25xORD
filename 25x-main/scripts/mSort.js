const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const sourceImage = './images/output/relocated.png';
const outputImage = './images/output/sorted.png';

// Load the source image and get its pixel data
loadImage(sourceImage).then((img) => {
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const pixelData = [];

  // Loop through each pixel and store its RGBA values in pixelData
  for (let i = 0; i < pixels.length; i += 4) {
    pixelData.push([
      pixels[i], // red
      pixels[i + 1], // green
      pixels[i + 2], // blue
      pixels[i + 3], // alpha
    ]);
  }

  // Sort the pixel data by color
  pixelData.sort((a, b) => {
    const aHex = rgbToHex(a[0], a[1], a[2]);
    const bHex = rgbToHex(b[0], b[1], b[2]);
    return aHex.localeCompare(bHex);
  });

  // Create a new canvas with the desired size
  const newCanvas = createCanvas(25, 25);
  const newCtx = newCanvas.getContext('2d');

  // Loop through the pixel data and paint each pixel onto the new canvas
  let x = 0;
  let y = 0;
  while (pixelData.length > 0) {
    const [r, g, b, a] = pixelData.shift();
    newCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    newCtx.fillRect(x, y, 1, 1);
    x++;
    if (x >= newCanvas.width) {
      x = 0;
      y++;
    }
  }

  // Export the resulting image
  const out = fs.createWriteStream(outputImage);
  const stream = newCanvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('The image was saved as sorted.png in images/output/'));
});

// Helper function to convert RGB values to hex color code
function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

// Helper function to convert a single RGB component to hex
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}