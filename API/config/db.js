const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Projeto_Assentamento_PA_Egidio_Brunetto1',
    password: '123',
    port: 5432,
});

module.exports = pool;
