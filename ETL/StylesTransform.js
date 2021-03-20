// import stream from 'stream';
const stream = require('stream');
const LineTransform = require('./LineTransform.js');

class StylesTransform extends LineTransform {
  constructor(options) {
      options = options || {};
      super(options);
      this.headerFlag = false;
      this.remnant = '';
      this.numberOfFields = 6;
  }
  // [ id, productId, name, sale_price, original_price, default_style ]
  transformStyles(line){
      let data = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let reformatted = [];
      let incomplete;
      if (data.length !== this.numberOfFields) {
        incomplete = line;
      } else {
        // skip id if no id
        reformatted.push(this.validNum(data[0]));
        if (!reformatted) {
          return null;
        }
        // conform product id
        reformatted.push(this.validNum(data[1]));
        // confrom name
        reformatted.push(this.validVarchar(data[2], 100, 'name', 'Stylish'));

        // conform sale price
        reformatted.push(this.validNum(data[3]));

        // conform original price
        reformatted.push(this.validNum(data[4]));

        // conform default
        reformatted.push(data[5] === 1 || data[5] === '1' ? 1 : 0);
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
        this.push(this.transformStyles(line))
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

module.exports = StylesTransform;
