const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// Define the folder path for the input and output images
const inputFolderPath = './images/inscriptions';
const outputFolderPath = './images/sprites';

// Get a list of all files within the input folder
const fileList = fs.readdirSync(inputFolderPath);

// Loop through each file in the folder
fileList.forEach(async (filename) => {
  // Load the image from disk
  const image = await loadImage(`${inputFolderPath}/${filename}`);

  // Determine the aspect ratio of the image
  const aspectRatio = image.width / image.height;

  // Define the dimensions for the cropped and resized image
  let cropWidth, cropHeight, cropX, cropY;
  if (aspectRatio > 1) {
    cropWidth = image.height;
    cropHeight = image.height;
    cropX = (image.width - image.height) / 2;
    cropY = 0;
  } else {
    cropWidth = image.width;
    cropHeight = image.width;
    cropX = 0;
    cropY = (image.height - image.width) / 2;
  }

  // Create a canvas and set its dimensions to 5px by 5px
  const canvas = createCanvas(5, 5);
  const ctx = canvas.getContext('2d');

  // Draw the cropped and resized image onto the canvas
  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, 5, 5);

  // Export the canvas as a PNG file in the output folder
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`${outputFolderPath}/${filename}`, buffer);
});