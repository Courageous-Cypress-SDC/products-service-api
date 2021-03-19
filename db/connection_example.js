const { Client } = require('pg');

const client = new Client({
    user: 'danielkosykh',
    host: 'localhost',
    database: 'testdb',
    password: '1234abcd',
    port: 5432,
});

client.connect();