const LineTransform = require('./LineTransform.js');

class FeatureTransform extends LineTransform {
  constructor(options) {
      options = options || {};
      super(options);
      this.headerFlag = true;
      this.remnant = '';
      this.numberOfFields = 4;
  }
  // [ id, product_id, feature, value ]
  transformFeatures(line){
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
        // conform product id, else 0
        reformatted.push(this.validNum(data[1], 'product_id'));
        // conform feature
        reformatted.push(this.validVarchar(data[2], 50, 'feature', 'null'));
        // conform feature value
        reformatted.push(this.validVarchar(data[3], 50, 'value', 'null'));

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
        this.push(this.transformFeatures(line))
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

module.exports = FeatureTransform;
