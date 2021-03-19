const fs = require('fs');
const path = require('path');
const LineTransform = require('./LineTransform');

// parses for number if number field
const parseForNum = (anything) => anything ? JSON.stringify(anything).replace(/\D/g, '') : 0;
//remove column name if included
const colRemove = (anything, column) => anything.replace(new RegExp(`${column}:`), '');

// data - piece of info in
// targetType - typeof should equal
const validNum = (data, targetType) => {
  // console.log(typeof data, data)
  if (isNaN(data)) {
    return [parseForNum(data)];
  } else {
    return data;
  }
};

const nullCheckOk = (data, returnIfNull, colName) => {
  if (!data) {
    return [' '];
  } else {
    return [colRemove(data, colName)];
  };
}

// data - piece of info in
// maxLength - max length of varchar
// colName - remove column name if included
// handleError - return this as instead if maxlength condition fails
const validVarchar = (data, maxLength, columnName, handleError) => {
  if (!data) {
    return handleError;
  } else {
    return data.length < maxLength ? colRemove(data, columnName) : colRemove(data.slice(0, maxLength - 1), columnName) ;
  }
}

// columns: [ 'id', 'name', 'slogan', 'description', 'category', 'default_price'
const transformProducts = (chunkArray) => {
  let newChunk = chunkArray.map(line => {
    let incomplete = [];
    let data = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let reformatted = [];
    if (data.length !== 6) {
      incomplete = line;
    } else {
      // skip id if no id
      reformatted.push(validNum(data[0], 'number'));
      if (!reformatted) {
        return null;
      }
      // // conform name length or no length
      reformatted.push(validVarchar(data[1], 255, 'name', 'Product Name'));
      // // conform slogan length or no length
      reformatted.push(validVarchar(data[2], 255, 'slogan', 'Product Slogan'));
      // // conform product description (can be null)
      reformatted.push(nullCheckOk(data[3], '', 'description'));
      // // confrom category length or no length
      reformatted.push(validVarchar(data[4], 30, 'category', 'Misc'));
      // // conform default price
      reformatted.push(validNum(data[5], 'number'));
      return reformatted + '\n';
    }
    return incomplete;
  })
  return newChunk
}

// _________________________
const transformers = {

  productsTransform: (file) => {
    let filename = path.join(__dirname, file);
    let readStream =  fs.createReadStream(filename, 'UTF8');
    let productWriteStream = fs.createWriteStream('./productClean.csv', 'UTF8');
    const lineTransform = new LineTransform();


    readStream
      .pipe(lineTransform)
      .pipe(productWriteStream)
    // start stream chunks, split on new lines
  //   readStream.on('data', chunk => {
  //     let chunkSplit = chunk.split('\n').slice(1);
  //     readStream.pause();
  //     leftover.length ? console.log(leftover) : null;
  //     let transformedArray = leftover.concat(transformProducts(chunkSplit));
  //     if (transformedArray[transformedArray.length - 1].length < 6) {
  //       // console.log(transformedArray[transformedArray.length - 1])
  //       leftover = transformedArray[transformedArray.length - 1];
  //     } else {
  //       leftover = [];
  //     }
  //     console.log(transformedArray)
  //     let streamArray = transformedArray.join('');
  //     productWriteStream.write(streamArray);
  //     readStream.resume();
  //   })

  //   productWriteStream.on('finish', () => {
  //     console.log(`wrote all the array data to file`);
  //  });

  }
}

transformers.productsTransform('product.csv');

// const transformers = {

//   productsTransform: (file) => {
//     let filename = path.join(__dirname, file);
//     let readStream =  fs.createReadStream(filename, 'UTF8');
//     let productWriteStream = fs.createWriteStream('./productsClean.csv', 'UTF8');
//     let leftover = [];
//     // start stream chunks, split on new lines
//     readStream.on('data', chunk => {
//       let chunkSplit = chunk.split('\n').slice(1);
//       readStream.pause();
//       leftover.length ? console.log(leftover) : null;
//       let transformedArray = leftover.concat(transformProducts(chunkSplit));
//       if (transformedArray[transformedArray.length - 1].length < 6) {
//         // console.log(transformedArray[transformedArray.length - 1])
//         leftover = transformedArray[transformedArray.length - 1];
//       } else {
//         leftover = [];
//       }
//       console.log(transformedArray)
//       let streamArray = transformedArray.join('');
//       productWriteStream.write(streamArray);
//       readStream.resume();
//     })

//     productWriteStream.on('finish', () => {
//       console.log(`wrote all the array data to file`);
//    });

//   }
// }
