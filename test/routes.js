const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server');

chai.use(chaiHttp);

describe('Static Files', () => {
  describe('GET /', () => {
    it('should return the content of index.html', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    }).timeout(1000);
    it('should return the content of styles.css', (done) => {
      chai
        .request(server)
        .get('/styles.css')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', /css/);
          done();
        });
    }).timeout(1000);
    it('should return the content of bundle.js', (done) => {
      chai
        .request(server)
        .get('/bundle.js')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', /javascript/);
          done();
        });
    }).timeout(1000);
  });
});

after(() => process.exit(0));
