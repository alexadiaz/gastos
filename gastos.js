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
    borrar: borrarGastos,
    renombrar:renombrarGastos(),
    consultar:consultarGastos
};

function insertarGastos(){
    rl.question("Ingrese gasto: ",nombreGasto =>{
        db.none(`insert into gastos (nombre) values ('${nombreGasto}')`)
        .then(()=> console.log("Gasto insertado"))
        .catch(() => console.log("Gasto ya existe"));
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
            return "Gasto no existe";
        }).then(mensaje =>{
            console.log(mensaje);
            rl.close();
        });
    });
}

function renombrarGastos(){
    rl.question("Ingrese gasto: ",nombreGasto =>{
        isGuardado(nombreGasto)
        .then(result =>{
            if(result){
                return new Promise(resolve =>{
                    rl.question("Ingrese nuevo nombre: ",nuevoGasto =>{
                        db.none(`update gastos set nombre = '${nuevoGasto}' where nombre = '${nombreGasto}'`)
                        .then(()=> resolve ("Gasto renombrado"))
                        .catch(()=> resolve ("Nombre ya existe"));
                    });
                });
            }
            return "Gasto no existe";
        }).then(mensaje =>{
            console.log(mensaje);
            rl.close();
        });
    });

}

function consultarGastos(){
    db.any("select nombre from gastos")
    .then(result => console.log(result));
}

function isGuardado(nombreGasto){
    return db.one(`select nombre from gastos where nombre = '${nombreGasto}'`)
        .then(()=> true)
        .catch(()=> false);
}

//module.exports = gastos;