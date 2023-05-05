const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const inputPath = './images/output/relocated.png';
const outputPath = './images/output/cluster.png';

const size = 25;

async function main() {
  const image = await loadImage(inputPath);
  const srcCanvas = createCanvas(image.width, image.height);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(image, 0, 0);

  const pixelArray = [];

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const pixel = srcCtx.getImageData(x, y, 1, 1).data;
      pixelArray.push({ x, y, pixel });
    }
  }

  pixelArray.sort((a, b) => a.pixel.join(',') > b.pixel.join(',') ? 1 : -1);

  const newCanvas = createCanvas(size, size);
  const newCtx = newCanvas.getContext('2d');
  const assigned = Array(size).fill(null).map(() => Array(size).fill(false));

  const getAdjacentPositions = (x, y) => [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];

  const isAvailable = (x, y) => x >= 0 && x < size && y >= 0 && y < size && !assigned[y][x];

  const randomAvailablePosition = () => {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
      };
    } while (!isAvailable(position.x, position.y));
    return position;
  };

  let lastPixel;
  while (pixelArray.length > 0) {
    const currentPixel = pixelArray.shift();
    let position;

    if (lastPixel && lastPixel.pixel.join(',') === currentPixel.pixel.join(',')) {
      const adjacents = getAdjacentPositions(lastPixel.x, lastPixel.y).filter(pos => isAvailable(pos.x, pos.y));
      if (adjacents.length > 0) {
        position = adjacents[Math.floor(Math.random() * adjacents.length)];
      }
    }

    if (!position) {
      position = randomAvailablePosition();
    }

    assigned[position.y][position.x] = true;
    newCtx.fillStyle = `rgba(${currentPixel.pixel[0]}, ${currentPixel.pixel[1]}, ${currentPixel.pixel[2]}, ${currentPixel.pixel[3] / 255})`;
    newCtx.fillRect(position.x, position.y, 1, 1);

    lastPixel = { ...position, pixel: currentPixel.pixel };
  }

  const buffer = newCanvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

main();
