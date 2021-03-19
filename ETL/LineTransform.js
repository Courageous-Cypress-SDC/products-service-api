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
  // check for a number if embedded in string, return only the number
  parseForNum(anything){
    return anything ? JSON.stringify(anything).replace(/\D/g, '') : 0;
  }

  //remove column name; ex 'default_price:'
  colRemove(anything, column) {
    return anything.replace(new RegExp(`${column}:`), '');
  }

  // check if the field is only an integer; if not return 0
  validNum(data, targetType){
    if (isNaN(data)) {
      return [this.parseForNum(data)];
    } else {
      return data;
    }
  };

  // check if filed is null; if null assign an empty string
  nullCheckOk(data, returnIfNull, colName){
    if (!data) {
      return [' '];
    } else {
      return [this.colRemove(data, colName)];
    };
  }

  // check to see if the field conforms to varchar rules, if not, makes it conform to varchar rules
  validVarchar(data, maxLength, columnName, handleError){
    if (!data) {
      return handleError;
    } else {
      return data.length < maxLength ? this.colRemove(data, columnName) : this.colRemove(data.slice(0, maxLength - 1), columnName) ;
    }
  }

  // handles chunk data line by line
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
        this.push(line)
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
