const express = require('express');
const db = require('../db/connection.js');
const pgQuery = require('../db/dbController.js');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/productid', (req,res) => {
  let start = Date.now();
  pgQuery.getProductInfo(req.query[0], (err, result) => {
    if (err) console.log(err);
    console.log(Date.now() - start + 'ms Produc Info');
    res.send(result);
  });
});

app.get('/styles', (req,res) => {
  let start = Date.now();
  pgQuery.getStyles(req.query[0], (err, result) => {
    if (err) console.log(err);
    console.log(Date.now() - start + 'ms Styles');
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log('DB server on port 3001')
});