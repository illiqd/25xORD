const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');


const canvas = createCanvas(25, 25);
const ctx = canvas.getContext('2d');

const fileNames = fs.readdirSync('./images/sprites').slice(0, 25);
const images = fileNames.map((fileName) => loadImage(`./images/sprites/${fileName}`));

Promise.all(images)
  .then((loadedImages) => {
    loadedImages.forEach((img, index) => {
      const xPos = (index % 5) * 5;
      const yPos = Math.floor(index / 5) * 5;
      ctx.drawImage(img, xPos, yPos, 5, 5);
    });
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./images/output/collage.png', buffer);
  })
  .catch((err) => {
    console.log(err);
  });