const pgp = require("pg-promise")();

const db = pgp({
        host:"localhost",
        port:5432,
        database:"controlgastos",
        user:"postgres",
        password:"postgres"
});

let gastos ={
    tabla:"gastos",
    tablaConsultar: "pagosrealizados",
    campo:"gastosid"
};

let ingresos ={
    tabla: "ingresos",
    tablaConsultar: "pagosrecibidos",
    campo:"ingresoid"
};

let controlGastos = {
    gastos:{
        insertar: (datos) => insertar("gastos",datos),
        borrar: (datos) => borrar(gastos,datos),
        renombrar: (datos) => renombrar(gastos,datos),
        consultar: () => consultar("gastos")
    },
    ingresos:{
        insertar: (datos) => insertar("ingresos",datos),
        borrar: (datos) => borrar("ingresos",datos),
        renombrar: (datos) => renombrar(ingresos,datos),
        consultar: () => consultar("ingresos")
    },
    periodos:{
        insertar:(datos) => insertarPeriodos(datos),
        borrar: (datos) => borrarPeriodos(datos),
        renombrar: (datos) => renombrarPeriodos(datos),
        consultar: () => consultarPeriodos()
    },
    pagosrecibidos:{
        insertar: (datos) => insertarPagos(ingresos,datos),
        borrar: (datos) => borrarPagos("pagosrecibidos",datos),
        renombrar: (datos) => renombrarPagos(ingresos,datos),
        consultar: () => consultarPagosRecibidos()
    },
    pagosrealizados:{
        insertar: (datos) => insertarPagos(gastos,datos),
        borrar: (datos) => borrarPagos("pagosrealizados",datos),
        renombrar: (datos) => renombrarPagos(gastos,datos),
        consultar: () => consultarPagosRealizados()
    }
};

function insertar(tabla,datos){
    return new Promise(resolve =>{
        if (datos.nombre !== ""){
            db.oneOrNone(`select id from ${tabla} where nombre = $1`,datos.nombre)
                .then((id)=>{
                    return id !== null ? true :  db.none(`insert into ${tabla} (nombre) values ($1)`,datos.nombre);
                })
                .then(result => result ? resolve(respuesta(false,2)) : resolve(respuesta(true)));
        }
        else{
            resolve (respuesta(false,1));
        }
    });
}

function borrar(info,datos){
    return db.oneOrNone(`select id from ${info.tabla} where nombre = $1`, datos.nombre)
        .then((id) => {
            return id ===  null ? true : db.one(`select count(id) from ${info.tablaConsultar} where ${info.campo} = $1`,id.id, c => parseInt(c.count, 10));
        })
        .then(result => {
            if(result === true){
                return respuesta(false,3);
            } 
            if(result !== 0){
                return respuesta(false,4);
            }
            return db.none(`delete from ${info.tabla} where nombre = $1`, datos.nombre)
                    .then(()=> respuesta(true));
        });
}    

function renombrar(info,datos){
    return new Promise(resolve =>{
        if (datos.nombre && datos.nuevoNombre !== ""){
            let q1 = db.oneOrNone(`select id from ${info.tabla} where nombre = $[nombre]`, datos);      
            let q2 = db.oneOrNone(`select id from ${info.tabla} where nombre = $[nuevoNombre]`, datos);
            return Promise.all([q1,q2])
                .then(id =>{
                    if(id[0] === null){
                        return true;
                    }
                    if(id[1] !== null){
                        return false;
                    }
                    return db.one(`select count(id) from ${info.tablaConsultar} where ${info.campo} = $1`,id[0].id, c => parseInt(c.count, 10));
                })
                .then(result =>{
                    if (result === true){
                        resolve (respuesta(false,3));
                        return;
                    }
                    if (result === false){
                        resolve (respuesta(false,2));
                        return;
                    }
                    if(result !== 0){
                        resolve (respuesta(false,4));
                        return;
                    }
                    db.none(`update ${info.tabla} set nombre = $[nuevoNombre] where nombre = $[nombre]`, datos)
                            .then(()=> resolve (respuesta(true)));
                });
        }
        else{
            resolve(respuesta(false,1));
        }
    });
}

function consultar(tabla){
    return db.any(`select nombre from ${tabla}`)
        .then(result => respuesta(true,"",result,result.length));
}

function insertarPeriodos(datos){
    return new Promise(resolve =>{
        if (validarDatos(datos.mes) && validarDatos(datos.ano)){
            db.oneOrNone("select id from periodos where mes = $[mes] and ano = $[ano]",datos)
                .then(id=>{
                    return id !== null ? true : db.none("insert into periodos (mes,ano) values ($[mes],$[ano])",datos);
                })
                .then(result => result ? resolve(respuesta(false,7)) : resolve(respuesta(true)));
        }
        else{
            resolve(respuesta(false,1));
        }
    });
}

function borrarPeriodos(datos){
    return validarDatosUsados(datos)
        .then(result =>{
            if(result !== "ok"){
                return result;
            }
            return db.none("delete from periodos where mes = $[mes] and ano = $[ano]",datos)
                .then(()=> respuesta(true));
        });
}

function renombrarPeriodos(datos){
    return new Promise(resolve => {
        if(validarDatos(datos.nuevoMes) && validarDatos(datos.nuevoAno)){
            validarDatosUsados(datos)
                .then(result =>{
                    if(result !== "ok"){
                        resolve (result);
                        return;
                    }
                    db.oneOrNone("select id from periodos where mes=$[nuevoMes] and ano=$[nuevoAno]",datos)
                        .then(id =>{
                            return id !== null ? true : db.none("update periodos set mes = $[nuevoMes],ano = $[nuevoAno] where mes = $[mes] and ano = $[ano]",datos);
                        })
                        .then(mensaje => mensaje ? resolve(respuesta(false,7)) : resolve(respuesta(true)));
                });
        }
        else{
            resolve (respuesta(false,1));
        }
    });
}
                    
function consultarPeriodos(){
    return db.any("select mes,ano from periodos")
        .then(result => respuesta(true,"",result,result.length));
}

function insertarPagos(info,datos){
    return pagos(info,datos)
        .then(result =>{
            if(result.resolve === false){
                return result;
            }
            return db.none(`insert into ${info.tablaConsultar} (periodoid,${info.campo},valor) values ($1,$2,$3)`,[result[0].id,result[1].id,datos.valor])
                .then(()=> respuesta(true));
        });
}

function borrarPagos(tabla,datos){
    return new Promise(resolve =>{
        if(validarDatos(datos.id)){
            db.oneOrNone(`select id from ${tabla} where id = $1`,datos.id)
                .then(id =>{
                    if(id === null){
                        resolve (respuesta(false,9));
                        return; 
                    }
                    db.none(`delete from ${tabla} where id = $1`,id.id)
                        .then(()=> resolve (respuesta(true)));
                });  
        }
        else{
            resolve(respuesta(false,1));
        }
    });
}

function renombrarPagos(info,datos){
    return new Promise(resolve =>{
        if(validarDatos(datos.id)){
            db.oneOrNone(`select id from ${info.tablaConsultar} where id = $1`,datos.id)
                .then(id =>{
                    if(id === null){
                        return true;
                    }
                    return pagos(info,datos);
                })
                .then(result =>{
                    if(result === true){
                        resolve (respuesta(false,9));
                        return;
                    }
                    if(result.resolve === false){
                        resolve (result);
                        return;
                    }
                    db.none(`update ${info.tablaConsultar} set periodoid = $1,${info.campo} = $2,valor = $3 where id = $4`,[result[0].id,result[1].id,datos.valor,datos.id])
                        .then(()=> resolve (respuesta(true)));
                });
        }
        else{
            resolve(respuesta(false,1));
        }
    });
}

function consultarPagosRecibidos(){
    return db.any("select pr.id,pe.mes,pe.ano,i.nombre,pr.valor from pagosrecibidos pr join periodos pe on pr.periodoid= pe.id join ingresos i on pr.ingresoid=i.id")
        .then(result => respuesta(true,"",result,result.length));
}

function consultarPagosRealizados(){
    return db.any("select pr.id,pe.mes,pe.ano,ga.nombre,pr.valor from pagosrealizados pr join periodos pe on pr.periodoid= pe.id join gastos ga on pr.gastosid=ga.id")
        .then(result => respuesta(true,"",result,result.length));
}

function validarDatos(campo){
    return campo !== "" && /^([0-9])*$/.test(campo);
}

function validarDatosUsados(datos){
    return new Promise (resolve => {
        if (validarDatos(datos.mes) && validarDatos(datos.ano)){
            db.oneOrNone("select id from periodos where mes=$[mes] and ano=$[ano]",datos)
                .then((id) =>{
                    if(id === null){
                        return true;
                    }
                    let q1 = db.one("select count(id) from pagosrecibidos where periodoid = $1", id.id, c => parseInt(c.count,10));
                    let q2 = db.one("select count(id) from pagosrealizados where periodoid = $1",id.id, c => parseInt(c.count,10));
                    return Promise.all([q1, q2]);
                })
                .then(result => {
                    if(result === true){
                        resolve (respuesta(false,8));
                        return;
                    }
                    if(result[0] !== 0){
                        resolve (respuesta(false,5));
                        return;
                    }
                    if(result[1] !== 0){
                        resolve (respuesta(false,6));
                        return;
                    }
                    resolve ("ok");
                });
        }
        else{
            resolve (respuesta(false,1));
        }
    });
}

function pagos(info,datos){
    return new Promise(resolve =>{
        if (validarDatos(datos.mes) && validarDatos(datos.ano) && datos.nombre !== "" && validarDatos(datos.valor)){
            let q1 = db.oneOrNone("select id from periodos where mes=$[mes] and ano=$[ano]",datos);
            let q2 = db.oneOrNone(`select id from ${info.tabla} where nombre = $1`, datos.nombre);
            return Promise.all([q1,q2])
                .then(result =>{
                    if(result[0] === null){
                        resolve (respuesta(false,8));
                        return;
                    }
                    if(result[1] === null){
                        resolve(respuesta(false,3));
                        return;
                    }
                    resolve (result);
                });
        }
        else{
            resolve(respuesta(false,1));
        }
    });
}

module.exports = controlGastos;