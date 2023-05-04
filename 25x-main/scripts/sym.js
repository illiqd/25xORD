const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const inputImage = './images/output/relocated.png';
const outputImage = './images/output/color-gradient.png';

// Load input image
loadImage(inputImage).then((img) => {

  // Create a new canvas
  const canvas = createCanvas(25, 25);
  const ctx = canvas.getContext('2d');

  // Extract pixel data from the input image
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const pixels = imageData.data;

  // Create an array to store the unique pixel values
  const uniquePixels = [];

  // Loop through all the pixels and store unique ones in the array
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Check if pixel is unique
    const isUnique = uniquePixels.every((pixel) => {
      return pixel.r !== r || pixel.g !== g || pixel.b !== b || pixel.a !== a;
    });

    // If pixel is unique, add it to the array
    if (isUnique) {
      uniquePixels.push({ r, g, b, a });
    }
  }

  // Shuffle the unique pixel array to randomize the order
  for (let i = uniquePixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniquePixels[i], uniquePixels[j]] = [uniquePixels[j], uniquePixels[i]];
  }

  // Loop through all the pixels in the new canvas and assign them a color
  let index = 0;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const pixel = uniquePixels[index];
      ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
      ctx.fillRect(x, y, 1, 1);
      index++;
    }
  }

  // Export the new image as a PNG file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputImage, buffer);
}).catch((err) => {
  console.log(err);
});