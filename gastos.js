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
        borrar: () => borrarPeriodos(),
        renombrar: () => renombrarPeriodos(),
        consultar: () => consultarPeriodos()
    },
    pagosrecibidos:{
        insertar: () => insertarPagos("pagosrecibidos","ingresos","ingresoid"),
        borrar: () => borrarPagos("pagosrecibidos"),
        renombrar: () => renombrarPagos("pagosrecibidos","ingresos","ingresoid"),
        consultar: () => consultarPagosRecibidos()
    },
    pagosrealizados:{
        insertar: () => insertarPagos("pagosrealizados","gastos","gastosid"),
        borrar: () => borrarPagos("pagosrealizados"),
        renombrar: () => renombrarPagos("pagosrealizados","gastos","gastosid"),
        consultar: () => consultarPagosRealizados()
    }
};
renombrarPagos("pagosrealizados","gastos","gastosid");
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
                return nuevoRenombrar(tabla,nombre);
            });
        }).then(mensaje =>{
            console.log(mensaje);
            rl.close();
        });
    });
}

function nuevoRenombrar(tabla,nombre){
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
    else if(tabla === "ingresos"){
        tablaConsultar = "pagosrecibidos";
        campo = "ingresoid"; 
    }
    else if(tabla === "pagosrecibidos"){
        tablaConsultar = tabla;
        campo =  "periodoid";
    }
    else{
        tablaConsultar = tabla;
        campo =  "periodoid";
    }
    return db.any(`select id from ${tablaConsultar} where ${campo} = ${id.id}`)
    .then((result)=> result);
}

function insertarPeriodos(){
    periodos()
    .then(datos =>{
        if(datos){
            db.none(`insert into periodos (mes,ano) values (${datos.mes},${datos.ano})`)
            .then(()=> console.log("Periodo ingresado"))
            .catch(()=> console.log("Periodo no valido o ya existe"));
        }
    });
}

function borrarPeriodos(){
    periodos()
    .then(datos =>{
        if(datos){
            isGuardadoPeriodo(datos.mes,datos.ano)
            .then(result =>{
                if (result){
                    return db.none(`delete from periodos where mes = ${datos.mes} and ano = ${datos.ano}`)
                    .then(()=> {return "Periodo borrado";})
                    .catch(() => {return "Periodo esta siendo usado en pagos realizados y/o recibidos";});
                }
                return "Periodo no existe";
            }).then(mensaje =>{
                console.log(mensaje);
                rl.close();
            });
        }
    });
}

function renombrarPeriodos(){
   periodos()
   .then(datos =>{
       if(datos){
            isGuardadoPeriodo(datos.mes,datos.ano)
            .then(id =>{
                if(!id){
                    return "Periodo no existe";
                }
                return isGuardadoPagos("pagosrecibidos",id)
                .then(result =>{
                    if(result.length !== 0){
                        return "Periodo esta siendo usado en pagos recibidos";
                    }
                    return isGuardadoPagos("pagosrealizados",id)
                    .then(result => {
                        if(result.length !== 0){
                            return "Periodo esta siendo usado en pagos realizados";
                        }
                        return nuevoRenombrarPeriodos(datos.mes,datos.ano);
                    });
                });
            }).then(mensaje =>{
                console.log(mensaje);
                rl.close();
            });
        }
    });
}            
                    
function nuevoRenombrarPeriodos(mes,ano){
    return new Promise(resolve =>{
        periodos()
        .then(datos =>{
            if(datos){
                db.none(`update periodos set mes = ${datos.mes},ano = ${datos.ano} where mes = ${mes} and ano = ${ano}`)
                .then(()=> resolve ("Periodo renombrado"))
                .catch(()=> resolve ("Periodo ya existe"));
            }
        });
    });
}
       
function consultarPeriodos(){
    db.any("select mes,ano from periodos")
    .then(result => console.log(result));
}

function periodos(){
    return new Promise (resolve => {
        let datos = null;
        rl.question("Ingrese mes: ",mes =>{
            if (mes !== ""){
                rl.question("Ingrese ano: ",ano =>{
                    if(ano !== ""){
                        resolve (datos = {mes: mes,ano: ano});
                        return;
                    }
                    resolve (false);
                });
            }
        });
    });
}

function isGuardadoPeriodo(mes,ano){
     return db.one(`select id from periodos where mes=${mes} and ano=${ano}`)
    .then((id) => id)
    .catch(() => false);
}

function insertarPagos(tabla,tablaCompara,campo){
    periodos()
    .then(datos =>{
        if(datos){
            isGuardadoPeriodo(datos.mes,datos.ano)
            .then(periodoid =>{
                if (!periodoid){
                    return "Periodo no existe";
                }
                return pagos(tabla,tablaCompara,campo,periodoid,"insertar");
            }).then(mensaje =>{
                console.log(mensaje);
                rl.close();
            });
        }
    });
}

function pagos(tabla,tablaCompara,campo,periodoid,accion,idRenombrar){
    return new Promise(resolve =>{
        rl.question("Ingrese nombre: ",nombre =>{
            if (nombre !== ""){
                isGuardado(tablaCompara,nombre)
                .then(id =>{
                    if (!id){
                        resolve ("Nombre no existe");
                        return;
                    }
                    rl.question("Ingrese valor: ",valor =>{
                        if (valor !== ""){
                            if(accion === "insertar"){
                                db.none(`insert into ${tabla} (periodoid,${campo},valor) values (${periodoid.id},${id.id},${valor})`)
                                .then(()=> resolve ("Pago ingresado"))
                                .catch(()=> resolve ("Valor no es valido"));
                            }
                            else{
                                db.none(`update ${tabla} set periodoid = ${periodoid.id},${campo} = ${id.id},valor = ${valor} where id = ${idRenombrar}`)
                                .then(()=> resolve ("Pago renombrado"))
                                .catch(()=> resolve ("Valor no es valido"));
                            }
                        }
                     });
                });
            }
        });
    });
}

function borrarPagos(tabla){
    rl.question("Ingrese id: ",id =>{
        db.one(`select id from ${tabla} where id = ${id}`)
        .then(result => {
            db.none(`delete from ${tabla} where id = ${result.id}`)
            .then(()=> console.log ("Pago borrado"));
        })
        .catch(()=> console.log("id no existe"));
    });
}

function renombrarPagos(tabla,tablaCompara,campo){
    rl.question("Ingrese id: ",id =>{
        db.one(`select id from ${tabla} where id = ${id}`)
        .then(result => {
            periodos()
            .then(datos =>{
                if (datos){
                    isGuardadoPeriodo(datos.mes,datos.ano)
                    .then(periodoid =>{
                        if (!periodoid){
                            return "Periodo no existe";
                        }
                        return pagos(tabla,tablaCompara,campo,periodoid,"renombrar",id);
                    }).then(mensaje =>{
                        console.log(mensaje);
                        rl.close();
                    });
                }
            });
        })
        .catch(()=> console.log("id no existe"));
    });
}

function consultarPagosRecibidos(){
    db.any("select pr.id,pe.mes,pe.ano,i.nombre,pr.valor from pagosrecibidos pr join periodos pe on pr.periodoid= pe.id join ingresos i on pr.ingresoid=i.id")
    .then(result => console.log(result));
}

function consultarPagosRealizados(){
    db.any("select pr.id,pe.mes,pe.ano,ga.nombre,pr.valor from pagosrealizados pr join periodos pe on pr.periodoid= pe.id join gastos ga on pr.gastosid=ga.id")
    .then(result => console.log(result));
}

module.exports = controlGastos;