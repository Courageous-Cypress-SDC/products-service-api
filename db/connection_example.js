const { Client, Pool } = require('pg');

const client = new Client({
    user: 'danielkosykh',
    host: 'localhost',
    database: 'testdb',
    password: '1234abcd',
    port: 5432,
});

//  or

const pool = new Pool({
    user: 'danielkosykh',
    host: 'localhost',
    database: 'testdb',
    password: '1234abcd',
    port: 5432,
});

client.connect();

// or

pool.connect()
  .then(()=> console.log('DB pg connected'))
  .catch(err => console.log(err));

module.exports = pool