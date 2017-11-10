let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let controlGastos = require("./gastos.js");

let app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/insertarGastos", (req,res) =>{
    controlGastos.gastos.insertar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/borrarGastos", (req,res) =>{
    controlGastos.gastos.borrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/renombrarGastos", (req,res) =>{
    controlGastos.gastos.renombrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.get("/consultarGastos", (req,res) =>{
    controlGastos.gastos.consultar()
        .then(obj => obj.totalContenido === 0 ? res.json("Sin datos") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/insertarIngresos", (req,res) =>{
    controlGastos.ingresos.insertar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/borrarIngresos", (req,res) =>{
    controlGastos.ingresos.borrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/renombrarIngresos", (req,res) =>{
    controlGastos.ingresos.renombrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.get("/consultarIngresos", (req,res) =>{
    controlGastos.ingresos.consultar()
        .then(obj => obj.totalContenido === 0 ? res.json("Sin datos") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/insertarPeriodos", (req,res) =>{
    controlGastos.periodos.insertar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/borrarPeriodos", (req,res) =>{
    controlGastos.periodos.borrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/renombrarIngresos", (req,res) =>{
    controlGastos.periodos.renombrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.get("/consultarPeriodos", (req,res) =>{
    controlGastos.periodos.consultar()
        .then(obj => obj.totalContenido === 0 ? res.json("Sin datos") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/insertarPagosRecibidos", (req,res) =>{
    controlGastos.pagosrecibidos.insertar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/borrarPagosRecibidos", (req,res) =>{
    controlGastos.pagosrecibidos.borrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/renombrarPagosRecibidos", (req,res) =>{
    controlGastos.pagosrecibidos.renombrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.get("/consultarPagosRecibidos", (req,res) =>{
    controlGastos.pagosrecibidos.consultar()
        .then(obj => obj.totalContenido === 0 ? res.json("Sin datos") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/insertarPagosRealizados", (req,res) =>{
    controlGastos.pagosrealizados.insertar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/borrarPagosRealizados", (req,res) =>{
    controlGastos.pagosrealizados.borrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.post("/renombrarPagosRealizados", (req,res) =>{
    controlGastos.pagosrealizados.renombrar(req.body)
        .then(obj => obj.resolve ? res.json("Accion realizada") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.get("/consultarPagosRealizados", (req,res) =>{
    controlGastos.pagosrealizados.consultar()
        .then(obj => obj.totalContenido === 0 ? res.json("Sin datos") : res.json(obj))
        .catch(error => res.json("Error no esperado " + error));
});

app.listen(3000,() => console.log("conectando"));