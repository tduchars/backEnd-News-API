process.env.NODE_ENV = 'test';
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sams-chai-sorted'));
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
    describe('api/users/:author GET RESOLVED', () => {
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
    describe('api/users/:author GET REJECTED', () => {
      it('returns 404 if passed non-existent author', () => {
        return request(app)
          .get('/api/users/bridgeManSam')
          .expect(404);
      });
      it('returns 404 if passed non-existent author', () => {
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
      it('get status 200 and return all articles in array with correct keys inc. comment_count', () => {
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
              'created_at',
              'comment_count'
            );
            expect(articles[0].comment_count).to.equal('13');
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
      it('allows order query --> passed query as asc --> defaults to order as descending', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('created_at', {
              ascending: true
            });
          });
      });
      it('allows a filter query that filters the articles by author', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles.length).to.equal(3);
            expect(articles[0].author).to.equal('butter_bridge');
          });
      });
      it('allows a filter query that filters the articles by topic', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles.length).to.equal(11);
            expect(articles[0].topic && articles[4].topic).to.equal('mitch');
          });
      });
      it('returns empty array when filter query is an author that is on database but has written no articles', () => {
        return request(app)
          .get('/api/articles?author=lurker')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.eql([]);
          });
      });
      it('returns 200 when queried with multiple queries. Sort_by and order in single url request.', () => {
        return request(app)
          .get('/api/articles?sort_by=title&order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('title', { ascending: true });
          });
      });
      it('returns 200 when queried with multiple queries and a filter. Sort_by, order similar to last but also filter in single url request.', () => {
        return request(app)
          .get('/api/articles?sort_by=title&order=asc&author=butter_bridge')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('title', { ascending: true });
            expect(articles.length).to.equal(3);
            expect(articles[0].author).to.equal('butter_bridge');
            expect(articles[1].author).to.equal('butter_bridge');
            expect(articles[2].author).to.equal('butter_bridge');
          });
      });
      it('another test status 200 passing a new author filter with order ascending and sort_by set to default', () => {
        return request(app)
          .get('/api/articles?order=asc&author=rogersop')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('created_at');
            expect(articles).to.be.an('array');
            expect(articles.length).to.equal(3);
            expect(articles[0].author).to.equal('rogersop');
            expect(articles[1].author).to.equal('rogersop');
            expect(articles[2].author).to.equal('rogersop');
          });
      });
      it('another test status 200 passing a new author filter with order ascending and sort_by set to default', () => {
        return request(app)
          .get('/api/articles?order=asc&author=rogersop&topic=cats')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy('created_at');
            expect(articles).to.be.an('array');
            expect(articles.length).to.equal(1);
            expect(articles[0].author).to.equal('rogersop');
            expect(articles[0].topic).to.equal('cats');
          });
      });
      it('status of 200 when topic does exist but has no articles attached to it.', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.eql([]);
          });
      });
    });
    describe('/api/articles GET REJECTED (includes rejected queries)', () => {
      it('status of 400 when sort_by query is not a column e.g. brian is not a column', () => {
        return request(app)
          .get('/api/articles?sort_by=brian')
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({ msg: 'Bad Request' });
          });
      });
      it('status of 404 when filter query is a non-existent username e.g. brian is not a username', () => {
        return request(app)
          .get('/api/articles?author=brian')
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({
              msg: 'Could not filter by that author.',
              status: 404
            });
          });
      });
      it('status of 404 when topic query is a non-existent topic e.g. brian is not a topic', () => {
        return request(app)
          .get('/api/articles?topic=brian')
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({
              msg: 'Could not filter by that topic.',
              status: 404
            });
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
      it('ignores patch when no request body passed.', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(200);
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
      it('status of 400 when requested with object that is incomplete... missing body key value pair.', () => {
        return request(app)
          .post('/api/articles/9/comments')
          .send({
            username: 'rogersop'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({
              msg: 'Bad Request'
            });
          });
      });
      it('status of 400 when requested with object that is incomplete... missing username key value pair which results in author being null in object --> not allowed.', () => {
        return request(app)
          .post('/api/articles/9/comments')
          .send({ body: 'test comment added...' })
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({ incompleteRequest: 'Incomplete Request' });
          });
      });
      it('status of 400 when requested with array of object and not an object.', () => {
        return request(app)
          .post('/api/articles/9/comments')
          .send([{ body: 'test comment added...' }])
          .expect(400);
      });
    });
    describe('/api/articles/:article_id/comments GET RESOLVED', () => {
      it('status of 200', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200);
      });
      it('returned value should be an array and have correct keys on object', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.an('array');
            expect(comments[0]).to.contain.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'body',
              'created_at'
            );
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
      it('returns elements in array in ascending sorted order', () => {
        return request(app)
          .get('/api/articles/1/comments?order=asc')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy('created_at', {
              ascending: true
            });
          });
      });
      it('returns default behaviour of sort_by created_at column and in descending order.', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('another test for different column sort_by and order descending', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=votes')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.be.sortedBy('votes', { descending: true });
          });
      });
      it('status of 200 when article exists but no comments and serves an empty array', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).to.eql([]);
          });
      });
    });
    describe('/api/articles/:article_id/comments GET REJECTED', () => {
      it('status of 404 when passed article_id that doesnt exist', () => {
        return request(app)
          .get('/api/articles/999/comments')
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({
              status: 404,
              msg: 'Article Not Found'
            });
          });
      });
    });
    describe('/api/comments/:comment_id PATCH RESOLVED', () => {
      it('status of 200 for patch request by comment_id sent --> comment_id = 3', () => {
        return request(app)
          .patch('/api/comments/3')
          .send({ inc_votes: 1 })
          .expect(200);
      });
      it('status of 200 for patch request with comment_id sent --> comment_id = 2', () => {
        return request(app)
          .patch('/api/comments/2')
          .send({ inc_votes: 6 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(20);
            expect(comment).to.be.an('object');
          });
      });
      it('status of 200 for passing incorrecttly spelled object key for patch request --> defaults to incrementing of 0', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_vot: 100 })
          .expect(200);
      });
    });
    describe('/api/comments/:comment_id PATCH REJECTED', () => {
      it('status of 400 for passing object value for patch request to increase votes by not a number', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 'abc' })
          .expect(400)
          .then(({ body }) => {
            expect(body).to.eql({
              msg: 'Bad Request'
            });
          });
      });
      it('status of 404 when a valid comment_id that does not exist is requested for patch', () => {
        return request(app)
          .patch('/api/comments/1000')
          .send({ inc_votes: 5 })
          .expect(404);
      });
    });
    describe('/api/comments/:comment_id DELETE RESOLVED', () => {
      it('returns 204 status with no content', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
    });
    describe('/api/comments/:comment_id DELETE REJECTED', () => {
      it('returns 404 status when trying to delete comment that doesnt exist', () => {
        return request(app)
          .delete('/api/comments/999')
          .expect(404)
          .then(({ body }) => {
            expect(body).to.eql({
              noComment: '404 - no comment to delete'
            });
          });
      });
    });
  });
  describe('Methods not allowed on endpoints', () => {
    it('Catch all 405 errors on endpoints. Not allowed delete method on /api/articles', () => {
      return request(app)
        .delete('/api/articles')
        .expect(405);
    });
    it('Not allowed post method on /api/comments/:comment_id', () => {
      return request(app)
        .post('/api/comments/:comment_id')
        .expect(405);
    });
    it('Not allowed post method on /api/articles/:article_id', () => {
      return request(app)
        .post('/api/articles/:article_id')
        .expect(405);
    });
    it('Not allowed delete method on /api', () => {
      return request(app)
        .delete('/api')
        .expect(405);
    });
  });
  describe.only('Pagination for articles', () => {
    it('returns all articles when passed undefined p value (limit defaults to 10 per page)', () => {
      return request(app)
        .get('/api/articles/?page=1')
        .expect(200);
    });
    xit('returns all articles when passed undefined p value (limit defaults to 10 per page)', () => {
      return request(app)
        .get('/api/articles/?page=1')
        .expect(200);
    });
  });
});
