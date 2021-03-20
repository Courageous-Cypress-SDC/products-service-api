const LineTransform = require('./LineTransform.js');

class PhotosTransform extends LineTransform {
  constructor(options) {
      options = options || {};
      super(options);
      this.headerFlag = false;
      this.remnant = '';
      this.numberOfFields = 4;
  }
  //  [ id , styleid,  thumbnailurl, url ]
  transformPhotos(line){
    let data = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let reformatted = [];
    let incomplete;

    if (data.length === 1) {
      data = data[0] + '"';
      data = data.split(',');
    }

    if (data.length !== this.numberOfFields) {
      incomplete = line;
    } else {
      // skip id if no id
      reformatted.push(this.validNum(data[0], 'number'));
      if (!reformatted) {
        return null;
      }
      // check style id if integer, else 0
      reformatted.push(this.validNum(data[1], 'number'));
      // check url for url, else default url
      reformatted.push(this.nullCheckOk(data[2], 'http://rthotel.com/wp/wp-content/uploads/2015/04/default_image_01.png', 'url'));
      // check thumbnail url for url, else null ok
      reformatted.push(this.nullCheckOk(data[3], 'http://rthotel.com/wp/wp-content/uploads/2015/04/default_image_01.png', 'thumbnail_url'));

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
        this.push(this.transformPhotos(line))
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

module.exports = PhotosTransform;
