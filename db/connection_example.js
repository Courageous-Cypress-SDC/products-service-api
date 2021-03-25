const { Pool } = require('pg');

const pool = new Pool({
  user: 'danielkosykh',
  host: '13.57.192.192',
  database: 'productsDB',
  password: '1234abcd',
    port: 5432,
});

pool.connect()
  .then(()=> console.log('DB pg connected'))
  .catch(err => console.log(err));


module.exports = pool;
