// import stream from 'stream';
const stream = require('stream');
const LineTransform = require('./LineTransform.js');

class ProductTransform extends LineTransform {
  constructor(options) {
      options = options || {};
      super(options);
      this.headerFlag = false;
      this.remnant = '';
  }

  transformProducts(line){
      let data = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let reformatted = [];
      let incomplete;
      if (data.length !== 6) {
        incomplete = line;
      } else {
        // skip id if no id
        reformatted.push(this.validNum(data[0], 'number'));
        if (!reformatted) {
          return null;
        }
        // // conform name length or no length
        reformatted.push(this.validVarchar(data[1], 255, 'name', 'Product Name'));
        // // conform slogan length or no length
        reformatted.push(this.validVarchar(data[2], 255, 'slogan', 'Product Slogan'));
        // // conform product description (can be null)
        reformatted.push(this.nullCheckOk(data[3], '', 'description'));
        // // confrom category length or no length
        reformatted.push(this.validVarchar(data[4], 30, 'category', 'Misc'));
        // // conform default price
        reformatted.push(this.validNum(data[5], 'number'));
        return reformatted + '\n';
      }
      return incomplete;
    }

  _transform(chunk, encoding, callback) {
    // Convert buffer to a string for splitting
    if (Buffer.isBuffer(chunk)) {
      chunk = chunk.toString('utf8');
    }

    if (this.remnant.length > 0) {
        chunk = this.remnant + chunk;
        this.remnant = '';
    }
    // Split lines _________________________
    var lines = chunk.split(this.chunkRegEx);
    if (chunk.search(this.remnantRegEx) === -1) {
        this.remnant = lines.pop();
    }

    let startPoint = this.headerFlag ? 0 : 1;
    lines.slice(startPoint).forEach(line => {
      if (line !== '') {
        this.push(this.transformProducts(line))
      }
      this.headerFlag = true;
    }, this);

    return setImmediate(callback);
  }

  _flush(callback) {
      if (this.remnant.length > 0) {
          this.push(this.remnant);
          this.remnant = '';
      }
      return setImmediate(callback);
  }
}

module.exports = ProductTransform;
