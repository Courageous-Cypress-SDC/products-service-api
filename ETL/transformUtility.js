const fs = require('fs');
const path = require('path');
const ProductTransform = require('./ProductTransform.js');
const PhotosTransform = require('./PhotosTransform.js');
const FeaturesTransform = require('./FeaturesTransform.js');
const SkusTransform = require('./SkusTransform.js');
const StylesTransform = require('./StylesTransform.js');

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
dirtyToCleanCSV('photos.csv', 'photosClean.csv', PhotosTransform);
dirtyToCleanCSV('features.csv', 'featuresClean.csv', FeaturesTransform);
dirtyToCleanCSV('skus.csv', 'skusClean.csv', SkusTransform);
dirtyToCleanCSV('styles.csv', 'stylesClean.csv', StylesTransform);
