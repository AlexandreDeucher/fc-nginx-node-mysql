const http = require('http');
const { faker } = require('@faker-js/faker');
const mysql = require('mysql');

const config = {
    host: 'db',
    user: 'root',
    password: 'root=root',
    database: 'nodedb'
};

let connection;

function connect() {
    connection = mysql.createConnection(config);

    connection.connect(err => {
        if (err) {
            console.log('Erro ao conectar ao MySQL. Tentando novamente...');
            return setTimeout(connect, 3000);
        }

        console.log('Conectado ao MySQL');
    });

    connection.on('error', connect);
}

connect();

http.createServer((req, res) => {
    if (req.url !== '/') return res.end();

    connection.query(
        'INSERT INTO people (name) VALUES (?)',
        [faker.person.fullName()],
        err => {
            if (err) {
                console.error('Erro ao inserir pessoa:', err);
                res.writeHead(500);
                return res.end('Erro ao inserir pessoa');
            }

            connection.query('SELECT name FROM people', (err, rows) => {
                if (err) {
                    console.error('Erro ao buscar pessoas:', err);
                    res.writeHead(500);
                    return res.end('Erro ao buscar pessoas');
                }

                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(
                    '<h1>Full Cycle Rocks!</h1><ul>' +
                    rows.map(r => `<li>${r.name}</li>`).join('') +
                    '</ul>'
                );
            });
        }
    );
}).listen(3000, () => console.log('Servidor rodando na porta 3000'));