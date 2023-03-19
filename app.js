const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createTable, createData, getData, updateData, deleteData, deleteTable } = require('./service');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/createTable', (req, res) => createTable(req, res));
app.post('/createData/:tableName', (req, res) => createData(req, res));
app.get('/getData/:tableName', (req, res) => getData(req, res));
app.patch('/updateData/:tableName/:id', (req, res) => updateData(req, res));
app.delete('/deleteData/:tableName/:id', (req, res) => deleteData(req, res));
app.delete('/deleteTable/:tableName', (req, res) => deleteTable(req, res));

const port = 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
