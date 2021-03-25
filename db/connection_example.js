const { Client, Pool } = require('pg');

const client = new Client({
    user: 'danielkosykh',
    host: 'localhost',
    database: 'productsDB',
    password: '1234abcd',
    port: 5432,
});
client.connect()
  .then(()=> console.log('DB pg connected'))
  .catch(err => console.log(err));

module.exports = client;

//  or

const { Pool } = require('pg');

const pool = new Pool({
  user: 'danielkosykh',
  host: 'localhost',
  database: 'productsDB',
  password: '1234abcd',
    port: 5432,
});

pool.connect()
  .then(()=> console.log('DB pg connected'))
  .catch(err => console.log(err));


module.exports = pool;
