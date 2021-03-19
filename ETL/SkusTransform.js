const LineTransform = require('./LineTransform.js');

class SkusTransform extends LineTransform {
  constructor(options) {
      options = options || {};
      super(options);
      this.headerFlag = false;
      this.remnant = '';
      this.numberOfFields = 4;
  }
  // [ id, style_id, size, quantity]
  transformSkus(line){
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
        // conform style id
        reformatted.push(this.validNum(data[1]));
        // confrom size
        reformatted.push(this.validVarchar(data[2], 7, 'size', null));
        // conform quanitity
        reformatted.push(this.validNum(data[3]));

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
        this.push(this.transformSkus(line))
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

module.exports = SkusTransform;
