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
    insertar: insertarGastos,
    borrar: borrarGastos()
};

function insertarGastos(){
    rl.question("Ingrese gasto: ",nombreGasto =>{
        db.none(`insert into gastos (nombre) values ('${nombreGasto}')`)
        .then(()=> console.log("Gasto insertado"))
        .catch(error => console.log("El gasto ya existe"));
    });
}

function borrarGastos(){
    rl.question("Ingrese gasto: ",nombreGasto =>{
        isGuardado(nombreGasto)
        .then(result => {
            if (result){
                return db.none(`delete from gastos where nombre = '${nombreGasto}'`)
                .then(()=> {return "Gasto borrado";});
            }
            return "El gasto no existe";
        }).then(mensaje =>{
            console.log(mensaje);
            rl.close();
        });
    });
}

function isGuardado(nombreGasto){
    return new Promise(resolve =>{
        db.one(`select nombre from gastos where nombre = '${nombreGasto}'`)
        .then(()=> resolve (true))
        .catch(()=> resolve(false));
    });
}

//module.exports = gastos;