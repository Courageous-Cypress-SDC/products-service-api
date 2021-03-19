const stream = require('stream');

class LineTransform extends stream.Transform {
  constructor(options) {
      options = options || {};
      super(options);

      this.separator = options.separator || '[\r\n|\n|\r]+';
      this.chunkRegEx = new RegExp(this.separator);
      this.remnantRegEx = new RegExp(this.separator + '$');
      this.headerFlag = false;

      this.remnant = '';
  }

  parseForNum(anything){
    return anything ? JSON.stringify(anything).replace(/\D/g, '') : 0;
  }

  colRemove(anything, column) {
    return anything.replace(new RegExp(`${column}:`), '');
  }

  validNum(data, targetType){
    if (isNaN(data)) {
      return [this.parseForNum(data)];
    } else {
      return data;
    }
  };

  nullCheckOk(data, returnIfNull, colName){
    if (!data) {
      return [' '];
    } else {
      return [this.colRemove(data, colName)];
    };
  }

  validVarchar(data, maxLength, columnName, handleError){
    if (!data) {
      return handleError;
    } else {
      return data.length < maxLength ? this.colRemove(data, columnName) : this.colRemove(data.slice(0, maxLength - 1), columnName) ;
    }
  }

  transformProducts(line){
      // line = line.toString();
      let data = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let reformatted = [];
      let incomplete;
      if (data.length !== 6) {
        incomplete = line;
      } else {
        // skip id if no id
        reformatted.push(this.validNum(data[0], 'number'));
        if (!reformatted) {
          // console.log('hell')
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
    // Prepend any remnant
    if (this.remnant.length > 0) {
        chunk = this.remnant + chunk;
        this.remnant = '';
    }
    // Split lines _________________________
    var lines = chunk.split(this.chunkRegEx);
    // Check to see if the chunk ends exactly with the separator
    if (chunk.search(this.remnantRegEx) === -1) {
        // It doesn't so save off the remnant
        this.remnant = lines.pop();
    }

    let startPoint = this.headerFlag ? 0 : 1;
    // Push each line
    lines.slice(startPoint).forEach(line => {
      if (line !== '') {
        this.push(this.transformProducts(line))
      }
      this.headerFlag = true;
    }, this);

    return setImmediate(callback);
  }

  _flush(callback) {
      // Do we have a remnant?
      if (this.remnant.length > 0) {
          this.push(this.remnant);
          this.remnant = '';
      }

      return setImmediate(callback);
  }
}

module.exports = LineTransform;
