const assert = require('assert');
const sinon = require('sinon');
const pg = require('pg');
const chai = require('chai');
const expect = chai.expect;
const chance = require('chance').Chance();

const { createTable, createData, getData, updateData, deleteData, deleteTable } = require('../service');

describe('Testcases for each function', () => {

    describe('test for createTable function', () => {

        let client;

        beforeEach(function () {
            const conString = 'postgres://user:password@localhost/test_db';
            client = new pg.Client(conString);
            sinon.stub(client, 'connect').callsFake(function (callback) {
                callback();
            });
        });

        afterEach(function () {
            client.connect.restore();
            client.end();
        });

        it('should able to create table', (done) => {
            const tableName = chance.string({ alpha: true, length: 10 });
            const converter = 'DEP VARCHAR(20) NOT NULL';
            sinon.stub(client, 'query').callsFake(function (query, callback) {
                expect(query).to.equal(`CREATE TABLE ${tableName}(
                    ID UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
                    ${converter}
                );`);
                callback(null, { rows: [] });
            });
            const res = {
                status: function (status) {
                    expect(status).to.deep.equal(200);
                    return {
                        send: function (result) {
                            const ans = JSON.parse(result);
                            expect(ans.result).to.deep.equal('Ok');
                            done();
                        }
                    }
                }
            };
            const req = {
                body: { tableName: tableName, attributes: [{ type: 'VARCHAR(20)', name: 'DEP' }] },
                params: { tableName: tableName }
            };
            createTable(req, res);

        });

    });

    describe('test for createData function', () => {

        let client;

        beforeEach(function () {
            const conString = 'postgres://user:password@localhost/test_db';
            client = new pg.Client(conString);
            sinon.stub(client, 'connect').callsFake(function (callback) {
                callback();
            });
        });

        afterEach(function () {
            client.connect.restore();
            client.end();
        });

        it('should able to create data in test table', (done) => {
            const tableName = 'TEST';
            const colConverter = 'TEST1, TEST2';
            const valueConverter = "'d1', 'e1'";
            sinon.stub(client, 'query').callsFake(function (query, callback) {
                expect(query).to.equal(`INSERT INTO ${tableName} (${colConverter}) VALUES (${valueConverter});`);
                callback(null, { rows: [] });
            });
            const res = {
                status: function (status) {
                    expect(status).to.deep.equal(200);
                    return {
                        send: function (result) {
                            const ans = JSON.parse(result);
                            expect(ans.result).to.deep.equal('Ok');
                            done();
                        }
                    }
                }
            };
            const req = {
                params: { tableName: tableName },
                body: {
                    attributes: [
                        {
                            name: "TEST1",
                            value: "d1"
                        },
                        {
                            name: "TEST2",
                            value: "e1"
                        }
                    ]
                }
            };
            createData(req, res);
        });

    });

    describe('test for getData function', () => {

        let client;

        beforeEach(function () {
            const conString = 'postgres://user:password@localhost/test_db';
            client = new pg.Client(conString);
            sinon.stub(client, 'connect').callsFake(function (callback) {
                callback();
            });
        });

        afterEach(function () {
            client.connect.restore();
            client.end();
        });

        it('should able to get data in test table', (done) => {
            const tableName = 'TEST';
            sinon.stub(client, 'query').callsFake(function (query, callback) {
                expect(query).to.equal(`SELECT * FROM ${tableName};`);
                callback(null, { rows: [] });
            });
            const res = {
                status: function (status) {
                    expect(status).to.deep.equal(200);
                    return {
                        send: function (result) {
                            const ans = JSON.parse(result);
                            expect(ans.result).to.deep.equal('Ok');
                            done();
                        }
                    }
                }
            };
            const req = {
                params: { tableName: tableName }
            };
            getData(req, res);
        });

    });

});
