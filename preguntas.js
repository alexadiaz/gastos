const readline = require("readline");
let controlGastos = require("./gastos.js");

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

let datos={};

let errores ={// eslint-disable-line no-unused-vars
    1: "Datos en blanco o no validos",
    2: "Nombre ya existe",
    3: "Nombre no existe",
    4: "Nombre usado en pagos recibidos y/o realizados",
    5: "Nombre usado en pagos recibidos",
    6: "Nombre usado en pagos realizados",
    7: "Periodo ya existe",
    8: "Periodo no existe",
    9: "Id no existe"
};

function insertar_borrar_gastos_ingresos(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese nombre: ",nombre =>{
        datos.nombre = nombre;
        controlGastos.gastos.insertar(datos)
            .then(obj => {
                obj.resolve ? console.log("Accion realizada") : console.log("Error " + errores[obj.error.toString()]);
                rl.close();
            })
            .catch(error => console.log("Error no esperado " + error));
    });
}

function renombrar_gastos_ingresos(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese nombre: ",nombre =>{
        rl.question("Ingrese nuevo nombre: ",nuevoNombre =>{
            datos.nombre = nombre;
            datos.nuevoNombre = nuevoNombre;
            controlGastos.gastos.renombrar(datos)
                .then(obj => {
                    obj.resolve ? console.log("Accion realizada") : console.log("Error " + errores[obj.error.toString()]);  
                    rl.close();
                })
                .catch(error => console.log("Error no esperado " + error));
        });
    });
}

function insertar_borrar_periodos(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese mes: ",mes =>{
        rl.question("Ingrese ano: ",ano =>{
            datos.mes = mes;
            datos.ano = ano;
            controlGastos.periodos.insertar(datos)
                .then(obj => {
                    obj.resolve ? console.log("Accion realizada") : console.log("Error " + errores[obj.error.toString()]);  
                    rl.close();
                })
                .catch(error => console.log("Error no esperado " + error));
        });
    });
}

function renombrar_periodos(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese mes: ",mes =>{
        rl.question("Ingrese ano: ",ano =>{
            rl.question("Ingrese nuevo mes: ",nuevoMes =>{
                rl.question("Ingrese nuevo ano: ",nuevoAno =>{
                    datos.mes = mes;
                    datos.ano = ano;
                    datos.nuevoMes = nuevoMes;
                    datos.nuevoAno = nuevoAno;
                    controlGastos.periodos.renombrar(datos)
                        .then(obj => {
                            obj.resolve ? console.log("Accion realizada") : console.log("Error " + errores[obj.error.toString()]);  
                            rl.close();
                        })
                        .catch(error => console.log("Error no esperado " + error));
                });
            });
        });
    });
}

function insertar_pagosrecibidos_realizados(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese mes: ",mes =>{
        rl.question("Ingrese ano: ",ano =>{
            rl.question("Ingrese nombre: ",nombre =>{
                rl.question("Ingrese valor: ",valor =>{
                    datos.mes = mes;
                    datos.ano = ano;
                    datos.nombre = nombre;
                    datos.valor = valor;
                    controlGastos.pagosrecibidos.insertar(datos)
                        .then(obj => {
                            obj.resolve ? console.log("Accion realizada") : console.log("Error " + errores[obj.error.toString()]);
                            rl.close();
                        })
                        .catch(error => console.log("Error no esperado " + error));
                });
            });
        });
    });
}

function borrar_pagosrecibidos_realizados(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese id: ",id =>{
        datos.id = id;
        controlGastos.pagosrecibidos.borrar(datos)
            .then(obj => {
                obj.resolve ? console.log("Accion realizada") : console.log("Error " + errores[obj.error.toString()]);
                rl.close();
            })
            .catch(error => console.log("Error no esperado " + error));
    });
} 

function renombrar_pagosrecibidos_realizados(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese id: ",id =>{
        rl.question("Ingrese mes: ",mes =>{
            rl.question("Ingrese ano: ",ano =>{
                rl.question("Ingrese nombre: ",nombre =>{
                    rl.question("Ingrese valor: ",valor =>{
                        datos.id = id;
                        datos.mes = mes;
                        datos.ano = ano;
                        datos.nombre = nombre;
                        datos.valor = valor;
                        controlGastos.pagosrecibidos.renombrar(datos)
                            .then(obj => {
                                obj.resolve ? console.log("Accion realizada") : console.log("Error " + errores[obj.error.toString()]);
                                rl.close();
                            })
                            .catch(error => console.log("Error no esperado " + error));
                    });
                });      
            });
        });
    });
} 

function consultar(){// eslint-disable-line no-unused-vars
    controlGastos.gastos.consultar()
        .then(obj => {
            obj.totalContenido === 0 ? console.log("Sin datos") : console.log(obj.contenido,obj.totalContenido);
            rl.close();
        })
        .catch(error => console.log("Error no esperado " + error));
}