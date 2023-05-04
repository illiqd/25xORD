const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Load the image to relocate its pixels
loadImage('./images/output/collage.png').then((img) => {
  const width = img.width;
  const height = img.height;

  // Create a new canvas to draw the relocated pixels on
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Get the image data of the original image
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);

  // Randomly relocate the pixels
  for (let i = 0; i < imageData.data.length; i += 4) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Save the relocated pixel image as a new PNG file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./images/output/relocated.png', buffer);
}).catch((err) => {
  console.log(err);
});