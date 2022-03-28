const express = require('express');

const fs = require('fs');

class Contenedor {
    constructor(path) {
        this.contenedor = [];
        this.path = path;
    }


    save(obj) {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }
        obj.ID = this.contenedor.length + 1;
        this.contenedor.push(obj);

        const data = JSON.stringify(this.contenedor);

        try {
            fs.writeFileSync(this.path, data);
        }
        catch (err) {
            console.log('Error de escritura', err.message);
        }
        return obj.ID;
    }

    getById(num) {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }


        const valor = this.contenedor.findIndex(element => {
            return element.ID == num
        })
        if (valor < 0)
            return null
        else
            return this.contenedor[valor];
    }

    getAll() {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }
        return this.contenedor;
    }

    deleteById(num) {
        try {
            this.contenedor = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        }
        catch (err) {
            console.log('Error leyendo el archivo', err.message);
        }

        const valor = this.contenedor.findIndex(element => {
            return element.ID == num
        })

        if (valor >= 0) {
            this.contenedor.splice(valor, 1);
        }
    }

    deleteAll() {
        try {
            fs.unlinkSync(this.path);
            this.contenedor.splice(0, this.contenedor.length);
        }
        catch (err) {
            console.log('Error borrando el archivo', err.message);
        }
    }
}

function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

const app = express();

const port = 8080;

const server = app.listen(port, () => {
    console.log("Server ready, listening on port:", port);
});

server.on('error', (err) => {
    console.log('There was a mistake', err.message);
});


app.get('/productos', (req, res) => {
    const newContenedor = new Contenedor('./contenedor.txt');

    res.json({
        productos: newContenedor.getAll()
    });
});

app.get('/productoRandom', (req, res) => {
    const newContenedor = new Contenedor('./contenedor.txt').getAll();

    if (newContenedor.length == 0) {
        return res.status(400).json({
            msg: 'El archivo en el que buscas no contiene productos'
        })
    }

    let indiceProducto = random(0, newContenedor.length - 1);

    res.json({
        productoRandom: newContenedor[indiceProducto]
    });


});



