process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sams-chai-sorted'));
const request = require('supertest');
const connection = require('../db/connection');

//add methods not allowed on routers when queries and all other methods completed

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
    });
    describe('/topics GET REJECTED', () => {
      it('catches any anomalous urls passed --> WILDCARD', () => {
        return request(app)
          .get('/api/banarama')
          .expect(404)
          .then(({ body }) => {
            expect(body.wildcard).to.equal('Page not found!');
          });
      });
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
    describe('api/users/:username GET REJECTED', () => {
      it('returns 404 if passed non-existent username', () => {
        return request(app)
          .get('/api/users/bridgeManSam')
          .expect(404);
      });
      it('returns 404 if passed non-existent username', () => {
        return request(app)
          .get('/api/users/bridgeDan')
          .expect(404)
          .then(({ text }) => {
            expect(text).to.equal('You searched for an invalid username.');
          });
      });
    });
  });
  describe('/api/articles', () => {
    describe('/api/articles GET RESOLVED (includes queries)', () => {
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
      it('allows sort_by any column and defaults query to date', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sorted('created_at', { descending: true });
          });
      });
      it('allows sort_by any column and sorts passed column votes', () => {
        return request(app)
          .get('/api/articles?sort_by=votes')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('votes', { descending: true });
          });
      });
      it('another column sort by test --> passed column as author', () => {
        return request(app)
          .get('/api/articles?sort_by=author')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('author', { descending: true });
          });
      });
      it('passing order e.g. asc or desc. On previous two tests defaulted to descending.', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('created_at', { ascending: true });
          });
      });
    });
    //needs more potential awkward errors adding especially for patch and post
    describe('/api/articles GET REJECTED (includes rejected queries)', () => {
      it('status of 400 when sort_by query is not a column e.g. brian is not a column', () => {
        return request(app)
          .get('/api/articles?sort_by=brian')
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({ msg: 'Bad Request' });
          });
      });
    });
    describe('/api/articles/:article_id GET RESOLVED', () => {
      it('get status 200', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200);
      });
      it('get status 200 and responds with full object including join and aggregate ', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body: { article } }) => {
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
            expect(article.comment_count).to.equal('13');
            expect(article).to.be.an('object');
          });
      });
    });
    describe('/api/articles/:article_id GET REJECTED', () => {
      it('get status 400', () => {
        return request(app)
          .get('/api/articles/banana')
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({ msg: 'Bad Request' });
          });
      });
      it('get status 404', () => {
        return request(app)
          .get('/api/articles/9999')
          .expect(404)
          .then(({ text }) => {
            expect(text).to.eql('You searched for an invalid username.');
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
    describe('/api/articles/:article_id PATCH REJECTED', () => {
      it('status of 400 if passed invalid article_id e.g. banana', () => {
        return request(app)
          .patch('/api/articles/banana')
          .send({ inc_votes: 6 })
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({ msg: 'Bad Request' });
          });
      });
      it('status of 404 if passed non-existent article_id e.g. 9999', () => {
        return request(app)
          .patch('/api/articles/9999')
          .send({ inc_votes: 3 })
          .expect(404)
          .then(({ text }) => {
            expect(text).to.eql('You searched for an invalid username.');
          });
      });
      it('status of 422 if passed valid url but tried to patch with missing data', () => {
        return request(app)
          .patch('/api/articles/3')
          .send({ banana: 100 })
          .expect(422)
          .then(({ body }) => {
            expect(body).to.eql({
              badPatch: '422 - passed element that did not conform'
            });
          });
      });
    });
    describe('/api/articles/:article_id/comments POST RESOLVED', () => {
      it('status of 201 - created with comment on that article added', () => {
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
    describe('/api/articles/:article_id/comments POST REJECTED', () => {
      it('status of 404 when requested with non existent user id in url', () => {
        return request(app)
          .post('/api/articles/9999/comments')
          .send({ username: 'rogersop', body: 'test comment added...' })
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({ msg: 'Page not Found' });
          });
      });
      it('status of 400 when requested with request body that is missing element(s)', () => {
        return request(app)
          .post('/api/articles/3/comments')
          .send({
            username: 'rogersop'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({ msg: 'Bad Request' });
          });
      });
    });
    describe.only('/api/articles/:article_id/comments GET RESOLVED', () => {
      it('status of 200', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200);
      });
      it('returned value should be an array', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an('array');
          });
      });
      it('returns all comments in array -> article_id of 1 has all the comments on test data', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).to.equal(13);
          });
      });
    });
    describe('/api/articles/:article_id/comments GET REJECTED', () => {
      it('', () => {});
    });
  });
});
