const fs = require('fs');
const path = require('path');
const ProductTransform = require('./ProductTransform.js');
const PhotosTransform = require('./ProductTransform.js');

const dirtyToCleanCSV = (file, newFileName, transformClass) => {
  let filename = path.join(__dirname, file);
  let readStream =  fs.createReadStream(filename, 'UTF8');
  let writeStream = fs.createWriteStream(newFileName, 'UTF8');
  let transformClassInit = new transformClass();
  readStream
      .pipe(transformClassInit)
      .pipe(writeStream)
}

dirtyToCleanCSV('product.csv', 'productClean.csv', ProductTransform);
