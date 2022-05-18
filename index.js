const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const fileupload = require('express-fileupload');
const jwt = require('jsonwebtoken');

app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/public`));

app.use(fileupload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "EL archivo supera el límite permitido"
}));

app.engine(
    "handlebars",
    hbs.engine({
        layoutsDir: `${__dirname}/views`,
        partialsDir: `${__dirname}/views/partials`
    })
);

app.listen(3000, () => console.log("Servidor activo http://localhost:3000"));

