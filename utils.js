module.exports = {
     respuesta: (resolve,error,contenido,totalContenido)  => {
        let result = {
            resolve: resolve,
            error:error,
            contenido:contenido,
            totalContenido:totalContenido
        };
        return result;
    }
};