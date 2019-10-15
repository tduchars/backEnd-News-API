process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-sorted'));
const request = require('supertest');
const connection = require('../db/connection');

describe('/api', () => {
  after(() => {
    connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe('api/topics GET RESOLVED', () => {
    it('status of 200', () => {
      return request(app)
        .get('/api/topics')
        .expect(200);
    });
    it('status of 200 and array of all topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics[0]).to.contain.keys('slug', 'description');
          expect(topics).to.be.an('array');
        });
    });
  });
  xdescribe('/topics GET REJECTED', () => {
    it('', () => {});
  });
  describe.only('api/users GET RESOLVED', () => {
    it('status of 200', () => {
      return request(app)
        .get('/api/users')
        .expect(200);
    });
    it('status of 200 and array of all users', () => {
      return request(app)
        .get('/api/users/')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).to.be.an('array');
          expect(users[0]).to.contain.keys('username', 'avatar_url', 'name');
        });
    });
  });
});
