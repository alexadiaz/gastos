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

let controlGastos = {
    gastos:{
        insertar: () => insertar("gastos"),
        borrar: borrarGastos,
        renombrar:renombrarGastos,
        consultar:consultarGastos
    },
    ingresos:{
        insertar: () => insertar("ingresos")
    }
   
};

function insertar(tabla){
    rl.question("Ingrese nombre: ",nombre =>{
        if (nombre !== ""){
            db.none(`insert into ${tabla} (nombre) values ('${nombre}')`)
            .then(()=> console.log("Nombre insertado"))
            .catch(() => console.log("Nombre ya existe"));
        }
    });
}

function borrar(tabla){
    rl.question("Ingrese nombre: ",nombre =>{
        isGuardado(tabla,nombre)
        .then(result => {
            if (result){
                return db.none(`delete from ${tabla} where nombre = '${nombre}'`)
                .then(()=> {return "Nombre borrado";});
            }
            return "Nombre no existe";
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
                        if(nuevoGasto !== ""){
                            db.none(`update gastos set nombre = '${nuevoGasto}' where nombre = '${nombreGasto}'`)
                            .then(()=> resolve ("Gasto renombrado"))
                            .catch(()=> resolve ("Nombre ya existe"));
                        }
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

function isGuardado(tabla,nombre){
    return db.one(`select nombre from ${tabla} where nombre = '${nombre}'`)
        .then(()=> true)
        .catch(()=> false);
}

//module.exports = controlGastos;