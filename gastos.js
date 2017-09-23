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
        borrar: () => borrar("gastos"),
        renombrar: () => renombrar("gastos"),
        consultar: () => consultar("gastos")
    },
    ingresos:{
        insertar: () => insertar("ingresos"),
        borrar: () => borrar("ingresos"),
        renombrar: () => renombrar("ingresos"),
        consultar: () => consultar("ingresos")
    },
    periodos:{
        insertar:() => insertarPeriodos()
    }
};

function insertarPeriodos(){
    rl.question("Ingrese mes: ",mes =>{
        if (mes !== ""){
            rl.question("Ingrese ano: ",ano =>{
                if(ano !== ""){
                    db.none(`insert into periodos (mes,ano) values (${mes},${ano})`)
                    .then(()=> console.log("Periodo ingresado"))
                    .catch(()=> console.log("Periodo no valido o ya existe"));
                }
            });
        }
    });
}

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

function renombrar(tabla){
    rl.question("Ingrese nombre: ",nombre =>{
        isGuardado(tabla,nombre)
        .then(result =>{
            if(result){
                return new Promise(resolve =>{
                    rl.question("Ingrese nuevo nombre: ",nuevoNombre =>{
                        if(nuevoNombre !== ""){
                            db.none(`update ${tabla} set nombre = '${nuevoNombre}' where nombre = '${nombre}'`)
                            .then(()=> resolve ("Nombre renombrado"))
                            .catch(()=> resolve ("Nombre ya existe"));
                        }
                    });
                });
            }
            return "Nombre no existe";
        }).then(mensaje =>{
            console.log(mensaje);
            rl.close();
        });
    });
}

function consultar(tabla){
    db.any(`select nombre from ${tabla}`)
    .then(result => console.log(result));
}

function isGuardado(tabla,nombre){
    return db.one(`select nombre from ${tabla} where nombre = '${nombre}'`)
        .then(()=> true)
        .catch(()=> false);
}

//module.exports = controlGastos;