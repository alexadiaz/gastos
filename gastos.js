const readline = require("readline");
const pgp = require("pg-promise")();

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const connection = {
    host:"localhost",
    port:5432,
    database:"controlgastos",
    user:"postgres",
    password:"postgres"
};

const db = pgp(connection);