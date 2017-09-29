const readline = require("readline");
let controlGastos = require("./gastos.js");

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

let datos={};

function insertar_borrar_gastos_ingresos(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese nombre: ",nombre =>{
        datos.nombre = nombre;
        controlGastos.gastos.insertar(datos);
        rl.close();
    });
}

function renombrar_gastos_ingresos(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese nombre: ",nombre =>{
        rl.question("Ingrese nuevo nombre: ",nuevoNombre =>{
            datos.nombre = nombre;
            datos.nuevoNombre = nuevoNombre;
            controlGastos.gastos.renombrar(datos);
            rl.close();
        });
    });
}

function insertar_borrar_periodos(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese mes: ",mes =>{
        rl.question("Ingrese ano: ",ano =>{
            datos.mes = mes;
            datos.ano = ano;
            controlGastos.periodos.insertar(datos);
            rl.close();
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
                    controlGastos.periodos.renombrar(datos);
                    rl.close();
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
                    controlGastos.pagosrecibidos.insertar(datos);
                    rl.close();
                });
            });
        });
    });
}

function borrar_pagosrecibidos_realizados(){// eslint-disable-line no-unused-vars 
    rl.question("Ingrese id: ",id =>{
        datos.id = id;
        controlGastos.pagosrecibidos.borrar(datos);
        rl.close();
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
                        controlGastos.pagosrecibidos.borrar(datos);
                        rl.close();
                    });
                });      
            });
        });
    });
} 