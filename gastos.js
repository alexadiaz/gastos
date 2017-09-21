const readline = require("readline");
const pgp = require("pg-promise")();

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

const db = pgp({
        host:"localhost",
        port:5432,
        database:"controlgastos",
        user:"postgres",
        password:"postgres"
});

let gastos = {
    insertar: insertarGastos()
};

function insertarGastos(){
    rl.question("Ingrese gasto ",nombreGasto =>{
        db.none(`insert into gastos (nombre) values ('${nombreGasto}')`)
        .then(()=> console.log("Gasto insertado"))
        .catch(error => console.log("El nombre ya existe"));
    });
}

//module.exports = gastos;