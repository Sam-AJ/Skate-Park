const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgresql",
  database: "skatepark",
  port: 5432,
});

const insertarSkater = async (skater) => {
    const { email, nombre, password, anos_experiencia, especialidad, foto } = skater;

    try {
        const config = {
            text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) values ($1, $2, $3, $4, $5, $6, 'f') RETURNING *",
            values: [email, nombre, password, anos_experiencia, especialidad, foto]
        };
        const resp = await pool.query(config);
        return resp;    
    } catch (error) {
        return error;
    }
};

const consultarSkaters = async () => {
    try {
        const query = "SELECT * FROM skaters";
        const resp = await pool.query(query);
        return resp;
    } catch (error) {
        return error;
    }
};

const consultarSkater = async (email, password) => {
    try {
        const query = `SELECT * FROM skaters WHERE email = "${email}" AND password = "${password}"`;
        const resp = await pool.query(query);
        return resp;
    } catch (error) {
        return error;
    }
};

const actualizarSkater = async (skater) => {
    const { nombre, password, anos_experiencia, especialidad } = skater;

    const config = {
        text: "UPDATE skaters SET nombre = $1, password = $2, anos_experiencia = $3, especialidad = $4 RETURNING *",
        values: [nombre, password, anos_experiencia, especialidad]
    }

    try {
        const resp = await pool.query(config);
        return resp;
    } catch (error) {
        return error;
    }
};

const actualizarEstadoSkater = async (id, estado) => {
    const config = {
        text: "UPDATE skaters SET estado = $1 WHERE id = $2 RETURNING *",
        values: [estado, id]
    }

    try {
        const resp = await pool.query(config);
        return resp;
    } catch (error) {
        return error;
    }
};

const eliminarSkater = async (id) => {
    const config = {
        text: "DELETE FROM skaters WHERE id = $1 RETURNING *",
        values: [id]
    }

    try {
        const resp = await pool.query(config);
        return resp;
    } catch (error) {
        return error;
    }
};

module.exports = { insertarSkater, consultarSkaters, consultarSkater, actualizarSkater, actualizarEstadoSkater, eliminarSkater }