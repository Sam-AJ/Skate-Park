const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const fileupload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const { insertarSkater, consultarSkaters, consultarSkater, actualizarSkater, actualizarEstadoSkater, eliminarSkater } = require('./consultas.js');
const llaveSecreta = "PruebaSkatePark";

app.listen(3000, () => console.log("Servidor activo http://localhost:3000"));

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist/`));
app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist/`));
app.use(fileupload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "EL archivo supera el límite permitido"
}));

app.set("view engine", "handlebars");

app.engine(
    "handlebars",
    hbs.engine({
        layoutsDir: `${__dirname}/views`,
        partialsDir: `${__dirname}/views/partials`
    })
);

app.get("/", async (req, res) => {
    try {
        const skaters = await consultarSkaters();
        res.render(
            "Index",
            { skaters }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            error: "Ha ocurrido un error en el servidor"
        });
    }
});

app.get("/login", (req, res) => {
    res.render("Login");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const skater = await consultarSkater(email, password);
        const token = jwt.sign(skater, llaveSecreta);
        res.status(200).send(token);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            error: "Ha ocurrido un error en el servidor"
        });
    };
});

app.get("/registro", (req, res) => {
    res.render("Registro");
});

app.post("/registro", (req, res) => {
    const skater = req.body;
    const { foto } = req.files;
    const { name } = foto;
    foto.mv(`${__dirname}/img/${name}`, async (error) => {
        try {
            await insertarSkater(skater);
            res.status(201).redirect("/login")
        } catch (error) {
            console.log(error);
            res.status(500).send({
                code: 500,
                error: "Ha ocurrido un error en el servidor"
            });
        }
    });
});

app.get("/perfil", (req, res) => {
    const token = req.query.token
    jwt.verify(token, llaveSecreta, (error, skater) => {
        if (error) {
            console.log(error);
            res.status(500).send({
                code: 500,
                error: "Ha ocurrido un error en el servidor",
            });
        } else {
            res.render("Perfil", { skater });
        }
    })
});

app.put("/perfil", async (req, res) => {
    const skater = req.body;
    try {
        await actualizarSkater(skater);
        res.status(200).send("Los datos han sido actualizados exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            error: "Ha ocurrido un error en el servidor"
        });
    }
});

app.delete("/perfil/:id", async (req, res) => {
    const id = req.params.id
    try {
        await eliminarSkater(id)
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            error: "Ha ocurrido un error en el servidor"
        });
    }
});

app.get("/admin", async (req, res) => {
    try {
        const skaters = await consultarSkaters();
        res.render(
            "Admin",
            { skaters }
        );
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            error: "Ha ocurrido un error en el servidor"
        });
    }
});

app.put("/admin/estado/:id", async (req, res) => {
    const id = req.params.id;
    const { estado } = req.body;
    try {
        await actualizarEstadoSkater(id, estado);
        res.status(200).send("El estado ha sido actualizado exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 500,
            error: "Ha ocurrido un error en el servidor"
        });
    }
});