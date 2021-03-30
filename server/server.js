const express = require('express');
const db = require('../db/connection.js');
const pgQuery = require('../db/dbController.js');

const app = express();
const PORT = 3005;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/productid', (req,res) => {
  pgQuery.getProductInfo(req.query[0], (err, result) => {
    if (err) console.log(err);
    res.send(result);
  });
});



app.get('/styles', (req,res) => {
  pgQuery.getStyles(req.query[0], (err, result) => {
    if (err) console.log(err);
    res.send(transformSkus(result));
  });
});

app.listen(PORT, () => {
  console.log(`DB server on port ${PORT}`)
});

const transformSkus = (dbResult) => {
  let results = [];
  let oldResults = dbResult[0].results ? dbResult[0].results : null;
  if (oldResults) {
    oldResults.forEach(style => {
    let newStyle = style;
    let newSkus = {};
    if (style.skus) {
      style.skus.forEach( sku => {
        newSkus[sku.sku_id] = { quantity: sku.quantity, size: sku.size }
      });
      newStyle.skus = newSkus;
      results.push(newStyle);
    }
    dbResult.results = results;
  });
  }
  return dbResult;
}