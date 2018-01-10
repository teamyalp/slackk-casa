const { expect } = require('chai');
const { Client } = require('pg');
const db = require('../database');

describe('Database', () => {
  describe('client.connect', () => {
    it('should connect to the database', (done) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      client.connect((err) => {
        expect(err).to.not.be.an('error');
        client.end();
        done();
      });
    }).timeout(1000);
  });
  describe('initializeDB', () => {
    it('should create a messages table', (done) => {
      db.initializeDB().then(db.client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
        (err, data) => {
          let tables = [];
          data.rows.forEach(table => tables.push(table.table_name));
          expect(tables).to.include.members(['messages']);
          done();
        },
      ));
    }).timeout(1000);
  });
  describe('postMessage', () => {
    it('should post a message to the table', (done) => {
      db.postMessage('test message').then((data) => {
        expect(data.rows[0].id).to.be.a('number');
        expect(data.rows[0].text).to.equal('test message');
        done();
      });
    }).timeout(1000);
  });
  describe('getMessages', () => {
    it('should get messages from the table', (done) => {
      db.getMessages().then((data) => {
        expect(data).to.be.an('array');
        expect(data[0].id).to.be.a('number');
        expect(data[0].text).to.be.a('string');
        expect(data[0].createdAt).to.be.a('date');
        done();
      });
    }).timeout(1000);
  });
});
