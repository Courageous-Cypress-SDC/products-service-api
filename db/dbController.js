const db = require('./connection.js');

const pgQuery = {

  getProductInfo: (product_id, callback) => {
    db.query(`
      SELECT product_id, name, slogan, description, category, default_price, (
        SELECT json_agg(row_to_json(features_json)) AS features FROM (
            SELECT
              feature, value
            FROM
              features
            WHERE
              product_id = $1
          ) features_json
        )
      FROM product_info WHERE product_id = $1;
    `,[product_id], (err, result) => {
      if (err) {
        callback(err, result);
      } else {
        callback(null, result.rows);
      }
    });
  },

  getStyles: (product_id, callback) => {
    db.query(`
      SELECT
        product_id, (
          SELECT json_agg( row_to_json(resultsjson) ) AS results FROM (
            SELECT
              style_id, name, original_price, sale_price, if_default, (
                SELECT json_agg(row_to_json(photosjson)) AS photos FROM (
                  SELECT
                    photos.thumbnail_url, photos.url
                  FROM
                    photos
                  WHERE
                    photos.style_id = styles.style_id
                ) photosjson
              ), (
                SELECT json_agg(row_to_json(skusjson)) AS skus FROM (
                  SELECT
                    sku_id, size, quantity
                  FROM
                    skus
                  WHERE
                    skus.style_id = styles.style_id
                ) skusjson
              )
            FROM
              styles
            WHERE
              product_id = $1
          ) resultsjson
        )
      FROM product_info WHERE product_id = $1;
    `,[product_id], (err, result) => {
      if (err) {
        callback(err, result);
      } else {
        callback(null, result.rows)
      }
    });
  }
}

module.exports = pgQuery;