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
        insertar:() => insertarPeriodos(),
        borrar: () => borrarPeriodos()
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
        .then(id => {
            if (!id){
                return "Nombre no existe";
            }
            return db.none(`delete from ${tabla} where nombre = '${nombre}'`)
            .then(()=> {return "Nombre borrado";})
            .catch(() => {return "Nombre esta siendo usado en pagos realizados y/o recibidos";});
        }).then(mensaje =>{
            console.log(mensaje);
            rl.close();
        });
    });
}

function renombrar(tabla){
    rl.question("Ingrese nombre: ",nombre =>{
        isGuardado(tabla,nombre)
        .then(id =>{
            if(!id){
                return "Nombre no existe";
            }
            return isGuardadoPagos(tabla,id)
            .then(result =>{
                if(result.length !== 0){
                    return "Nombre esta siendo usado en pagos realizados y/o recibidos";
                }
                return new Promise(resolve =>{
                    rl.question("Ingrese nuevo nombre: ",nuevoNombre =>{
                        if(nuevoNombre !== ""){
                            db.none(`update ${tabla} set nombre = '${nuevoNombre}' where nombre = '${nombre}'`)
                            .then(()=> resolve ("Nombre renombrado"))
                            .catch(()=> resolve ("Nombre ya existe"));
                        }
                    });
                });
            });
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
    return db.one(`select id from ${tabla} where nombre = '${nombre}'`)
        .then((id)=> id)
        .catch(()=> false);
}

function isGuardadoPagos(tabla,id){
    let tablaConsultar = null;
    let campo = null;
    if(tabla === "gastos"){
        tablaConsultar = "pagosrealizados";
        campo = "gastosid";
    }
    else{
        tablaConsultar = "pagosrecibidos";
        campo = "ingresoid"; 
    }
    return db.any(`select id from ${tablaConsultar} where ${campo} = ${id.id}`)
    .then((result)=> result);
}

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

function borrarPeriodos(){
    rl.question("Ingrese mes: ",mes =>{
        if (mes !== ""){
            rl.question("Ingrese ano: ",ano =>{
                isGuardadoPeriodo("periodos",mes,ano)
                .then(result =>{
                    if (result){
                        return db.none(`delete from periodos where mes = ${mes} and ano = ${ano}`)
                        .then(()=> {return "Periodo borrado";})
                        .catch(() => {return "Periodo esta siendo usado en pagos realizados y/o recibidos";});
                    }
                    return "Periodo no existe";
                }).then(mensaje =>{
                    console.log(mensaje);
                    rl.close();
                });
            });
        }
    });
}

function isGuardadoPeriodo(tabla,mes,ano){
     return db.one(`select mes,ano from ${tabla} where mes=${mes} and ano=${ano}`)
    .then(() => true)
    .catch(() => false);
}

//module.exports = controlGastos;