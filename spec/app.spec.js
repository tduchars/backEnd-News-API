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
  describe('/api/topics', () => {
    describe('/api/topics GET RESOLVED', () => {
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
      it('catches any anomalous urls passed --> WILDCARD', () => {
        return request(app)
          .get('/api/banarama')
          .expect(404)
          .then(({ body }) => {
            expect(body.wildcard).to.equal('Page not found!');
          });
      });
    });
    xdescribe('/topics GET REJECTED', () => {
      it('', () => {});
    });
  });
  describe('/api/users', () => {
    describe('api/users GET RESOLVED', () => {
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
    describe('api/users/:username GET RESOLVED', () => {
      it('status of 200', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200);
      });
      it('status of 200 and gets requested user back in correct format', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.contain.keys('username', 'avatar_url', 'name');
            expect(user).to.be.an('object');
          });
      });
    });
  });
  describe('/api/articles', () => {
    describe('/api/articles GET RESOLVED', () => {
      it('get status 200', () => {
        return request(app)
          .get('/api/articles')
          .expect(200);
      });
      it('get status 200 and return all articles in array', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles[0]).to.contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at'
            );
          });
      });
    });
    xdescribe('/api/articles/:article_id GET REJECTED', () => {
      it('get status 200', () => {
        return request(app)
          .get('/api/articles/10')
          .expect(200);
      });
      it('get status 200', () => {
        return request(app)
          .get('/api/articles/10')
          .expect(200)
          .then(({ body: { article } }) => {
            console.log(article);
            expect(article).to.contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at',
              'comment_count'
            );
            expect(article).to.be.an('object');
            expect(article.comment_count).to.be.a('number');
          });
      });
    });
    describe('/api/articles/:article_id PATCH RESOLVED', () => {
      it('patch status 200', () => {
        return request(app)
          .patch('/api/articles/5')
          .send({ inc_votes: 6 })
          .expect(200);
      });
      it('patch status 200 and increment votes by given value in object', () => {
        return request(app)
          .patch('/api/articles/5')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.be.a('object');
            expect(article.votes).to.equal(1);
          });
      });
    });
    xdescribe('/api/articles/:article_id PATCH REJECTED', () => {
      it('', () => {});
    });
    //what if posted with non existing username?
    //posted with no content on body
    //how many layers to go?
    describe.only('/api/articles/:article_id/comments POST RESOLVED', () => {
      it('status of 201 - created', () => {
        return request(app)
          .post('/api/articles/7/comments')
          .send({ username: 'rogersop', body: 'test comment added...' })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.an('object');
            expect(comment).to.contain.keys('author', 'votes', 'body');
            expect(comment.article_id).equal(7);
            expect(comment.body).equal('test comment added...');
          });
      });
    });
  });
});
