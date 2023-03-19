const validator = require('validator');

const pg = require('pg');

const conString = "postgres://yazqojwm:Yx6u03ag7wPU3z0SHZEFdO5QlYhhNU2Q@isilo.db.elephantsql.com/yazqojwm"

const createTable = (req, res) => {

    const { tableName, attributes } = req.body;

    if (tableName === undefined || attributes === undefined ||
        typeof tableName !== "string" || !Array.isArray(attributes) || attributes.length === 0) {
        const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
        return res.status(400).send(response);
    }

    let converter = '';

    attributes.forEach((element, index) => {
        if (element.name === undefined || element.type === undefined || typeof element.name !== "string" || typeof element.type !== "string") {
            const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
            return res.status(400).send(response);
        }
        converter += (element.name + " ");
        converter += (element.type + " ");
        if (index === attributes.length - 1) {
            converter += "NOT NULL";
        } else {
            converter += "NOT NULL,";
        }
    });

    const client = new pg.Client(conString);

    client.connect(function (err) {
        if (err) {
            const response = JSON.stringify({ result: "Error", message: `could not connect to postgres : ${err}` });
            return res.status(500).send(response);
        }

        client.query(`CREATE TABLE ${tableName}(
            ID UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
            ${converter}
        );`, function (err, result) {
            if (err) {
                const response = JSON.stringify({ result: "Error", message: `error running query : ${err}` });
                return res.status(500).send(response);
            }
            client.end();
            const response = JSON.stringify({ result: "Ok", message: "Table created Successfully" });
            res.status(200).send(response);
        });

    });
};

const createData = (req, res) => {

    const { tableName } = req.params;
    const { attributes } = req.body;

    if (tableName === undefined || attributes === undefined ||
        typeof tableName !== "string" || !Array.isArray(attributes) || attributes.length === 0) {
        const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
        return res.status(400).send(response);
    }

    let colConverter = '';
    let valueConverter = '';

    attributes.forEach((element, index) => {
        if (element.name === undefined || element.value === undefined || typeof element.name !== "string" || typeof element.value !== "string") {
            const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
            return res.status(400).send(response);
        }
        if (index === attributes.length - 1) {
            colConverter += (element.name);
            valueConverter += ("'" + element.value + "'");
        } else {
            colConverter += (element.name + ", ");
            valueConverter += ("'" + element.value + "'" + ", ");
        }
    });
    const client = new pg.Client(conString);

    client.connect(function (err) {
        if (err) {
            const response = JSON.stringify({ result: "Error", message: `could not connect to postgres : ${err}` });
            return res.status(500).send(response);
        }

        client.query(`INSERT INTO ${tableName} (${colConverter}) VALUES (${valueConverter}) RETURNING *;`, function (err, result) {
            if (err) {
                const response = JSON.stringify({ result: "Error", message: `error running query : ${err}` });
                return res.status(500).send(response);
            }
            client.end();
            const response = JSON.stringify({ result: "Ok", id: result.rows[0].id, message: "Created Data Successfully" });
            res.status(200).send(response);
        });

    });

};

const getData = (req, res) => {

    const { tableName } = req.params;

    if (tableName === undefined || typeof tableName !== "string") {
        const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
        return res.status(400).send(response);
    }

    const client = new pg.Client(conString);

    client.connect(function (err) {
        if (err) {
            const response = JSON.stringify({ result: "Error", message: `could not connect to postgres : ${err}` });
            return res.status(500).send(response);
        }

        client.query(`SELECT * FROM ${tableName};`, function (err, result) {
            if (err) {
                const response = JSON.stringify({ result: "Error", message: `error running query : ${err}` });
                return res.status(500).send(response);
            }
            client.end();
            const response = JSON.stringify({ result: "Ok", response: result, message: "Successfully retrieved data" });
            res.status(200).send(response);
        });

    });

};

const updateData = (req, res) => {

    const { tableName, id } = req.params;
    const { attributes } = req.body;

    if (tableName === undefined || typeof tableName !== "string" ||
        id === undefined || !validator.isUUID(id) ||
        attributes === undefined || !Array.isArray(attributes) || attributes.length === 0) {
        const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
        return res.status(400).send(response);
    }

    let converter = "";

    attributes.forEach((element, index) => {
        if (element.name === undefined || element.value === undefined || typeof element.name !== "string" || typeof element.value !== "string") {
            const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
            return res.status(400).send(response);
        }
        if (index === attributes.length - 1) {
            converter += (element.name + " = ");
            converter += ("'" + element.value + "'");
        } else {
            converter += (element.name + " = ");
            converter += ("'" + element.value + "',");
        }
    });

    const client = new pg.Client(conString);

    client.connect(function (err) {
        if (err) {
            const response = JSON.stringify({ result: "Error", message: `could not connect to postgres : ${err}` });
            return res.status(500).send(response);
        }

        client.query(`UPDATE ${tableName} SET ${converter} where id='${id}';`, function (err, result) {
            if (err) {
                const response = JSON.stringify({ result: "Error", message: `error running query : ${err}` });
                return res.status(500).send(response);
            }
            client.end();
            const response = JSON.stringify({ result: "Ok", message: "Successfully updated data in the table" });
            res.status(200).send(response);
        });

    });

};

const deleteData = (req, res) => {

    const { tableName, id } = req.params;

    if (tableName === undefined || typeof tableName !== "string" ||
        id === undefined || !validator.isUUID(id)) {
        const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
        return res.status(400).send(response);
    }

    const client = new pg.Client(conString);

    client.connect(function (err) {
        if (err) {
            const response = JSON.stringify({ result: "Error", message: `could not connect to postgres : ${err}` });
            return res.status(500).send(response);
        }

        client.query(`DELETE FROM ${tableName} WHERE id='${id}';`, function (err, result) {
            if (err) {
                const response = JSON.stringify({ result: "Error", message: `error running query : ${err}` });
                return res.status(500).send(response);
            }
            client.end();
            const response = JSON.stringify({ result: "Ok", message: "Deleted Data Successfully" });
            res.status(200).send(response);
        });

    });

};

const deleteTable = (req, res) => {
    const { tableName } = req.params;

    if (tableName === undefined || typeof tableName !== "string") {
        const response = JSON.stringify({ result: "Error", message: "Incorrect Format" });
        return res.status(400).send(response);
    }

    const client = new pg.Client(conString);

    client.connect(function (err) {
        if (err) {
            const response = JSON.stringify({ result: "Error", message: `could not connect to postgres : ${err}` });
            return res.status(500).send(response);
        }

        client.query(`DROP TABLE ${tableName};`, function (err, result) {
            if (err) {
                const response = JSON.stringify({ result: "Error", message: `error running query : ${err}` });
                return res.status(500).send(response);
            }
            client.end();
            const response = JSON.stringify({ result: "Ok", message: "Table Deleted Successfully" });
            res.status(200).send(response);
        });

    });

};

module.exports = { createTable, createData, getData, updateData, deleteData, deleteTable };
