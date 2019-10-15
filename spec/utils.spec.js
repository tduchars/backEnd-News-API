const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe.only('formatDates', () => {
  it('returns new array', () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input);
  });
  it('doesnt mutate old array', () => {
    const input = [];
    expect(formatDates(input)).to.not.equal(input);
  });
  it('doesnt mutate elements within array', () => {
    const input = [
      {
        title: 'The vegan carnivore?',
        topic: 'cooking',
        author: 'tickle122',
        body: 'The chef Richard McGeown...',
        created_at: 1492163783248
      }
    ];
    formatDates(input);
    expect(input[0]).to.eql({
      title: 'The vegan carnivore?',
      topic: 'cooking',
      author: 'tickle122',
      body: 'The chef Richard McGeown...',
      created_at: new Date(1492163783248)
    });
  });
  it('changes array of single obj element to correct date format', () => {
    const input = [
      {
        title: 'The vegan carnivore?',
        topic: 'cooking',
        author: 'tickle122',
        body: 'The chef Richard McGeown...',
        created_at: 1492163783248
      }
    ];
    expect(formatDates(input)).to.eql([
      {
        title: 'The vegan carnivore?',
        topic: 'cooking',
        author: 'tickle122',
        body: 'The chef Richard McGeown...',
        created_at: new Date(1492163783248)
      }
    ]);
  });
  it('changes array of many obj elements to correct date format', () => {
    const input = [
      {
        title: 'The vegan carnivore?',
        topic: 'cooking',
        author: 'tickle122',
        body: 'The chef Richard McGeown...',
        created_at: 1492163783248
      },
      {
        title: 'Stone Soup',
        topic: 'cooking',
        author: 'cooljmessy',
        body: 'The first day...',
        created_at: 1481662720516
      }
    ];
    expect(formatDates(input)[0].created_at).to.eql(new Date(1492163783248));
    expect(formatDates(input)[1].created_at).to.eql(new Date(1481662720516));
  });
});

describe('makeRefObj', () => {
  it('returns new object', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        created_at: '2016-08-18T12:07:52.389Z'
      }
    ];
    expect(makeRefObj(input)).to.not.equal(input);
    expect(makeRefObj(input)).to.be.a('object');
  });
  it('doesnt mutate old array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        created_at: '2016-08-18T12:07:52.389Z'
      }
    ];
    makeRefObj(input);
    expect(input).to.eql([
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        created_at: '2016-08-18T12:07:52.389Z'
      }
    ]);
  });
  it('creates refObj for single elem obj in array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        body: 'This is part two...',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: '2016-08-18T12:07:52.389Z'
      }
    ];
    expect(makeRefObj(input, 'title', 'article_id')).to.eql({
      'Running a Node App': 1
    });
  });
  it('creates refObj for many elems in obj in array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        created_at: '2016-08-18T12:07:52.389Z'
      },
      {
        article_id: 2,
        title: 'The Rise Of Thinking',
        body: 'Many...',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: '2017-07-20T20:57:53.256Z'
      }
    ];
    expect(makeRefObj(input, 'title', 'article_id')).to.eql({
      'Running a Node App': 1,
      'The Rise Of Thinking': 2
    });
  });
  it('orignal arrays not mutated', () => {
    const input = [
      {
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        created_at: '2016-08-18T12:07:52.389Z'
      },
      {
        article_id: 2,
        title: 'The Rise Of Thinking',
        body: 'Many...',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: '2017-07-20T20:57:53.256Z'
      }
    ];
    makeRefObj(input, 'title', 'article_id');
    expect(input).to.eql(input);
  });
});

describe('formatComments', () => {
  it('returns new array', () => {
    const input = [];
    expect(formatComments(input)).to.not.equal(input);
    expect(formatComments(input)).to.be.an('array');
  });
  it('doesnt mutate old array', () => {
    const comments = [
      {
        body: 'Itaque quisquam.',
        belongs_to: 'The People Tracking Every Touch.',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      }
    ];
    const article = [
      {
        article_id: 1,
        title: 'Running a Node App',
        body: 'This is part two...',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: '2016-08-18T12:07:52.389Z'
      }
    ];
    const articleRef = makeRefObj(article, 'title', 'article_id');
    formatComments(comments, articleRef);
    expect(comments).to.eql([
      {
        body: 'Itaque quisquam.',
        belongs_to: 'The People Tracking Every Touch.',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932
      }
    ]);
  });
  it('changes keys to article_id and author', () => {
    const comments = [
      {
        body: 'Sit sequi odio...',
        belongs_to: 'Running a Node App',
        created_by: 'weegembump',
        votes: 11,
        created_at: 1454293795551
      }
    ];
    const article = [
      {
        article_id: 1,
        title: 'Running a Node App',
        body: 'This is part two...',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: '2016-08-18T12:07:52.389Z'
      }
    ];
    const articleRef = makeRefObj(article, 'title', 'article_id');
    expect(formatComments(comments, articleRef)).to.eql([
      {
        body: 'Sit sequi odio...',
        article_id: 1,
        author: 'weegembump',
        votes: 11,
        created_at: new Date(1454293795551)
      }
    ]);
  });
  it('changes multiple elements in array', () => {
    const comments = [
      {
        body: 'Sit sequi odio...',
        belongs_to: 'Running a Node App',
        created_by: 'weegembump',
        votes: 11,
        created_at: 1454293795551
      },
      {
        body: 'Explicabo perspiciatis...',
        belongs_to: 'Running a Node App',
        created_by: 'cooljmessy',
        votes: 4,
        created_at: 1463121267403
      }
    ];
    const article = [
      {
        article_id: 1,
        title: 'Running a Node App',
        body: 'This is part two...',
        votes: 0,
        topic: 'coding',
        author: 'jessjelly',
        created_at: '2016-08-18T12:07:52.389Z'
      }
    ];
    const articleRef = makeRefObj(article, 'title', 'article_id');
    expect(formatComments(comments, articleRef)).to.eql([
      {
        body: 'Sit sequi odio...',
        article_id: 1,
        author: 'weegembump',
        votes: 11,
        created_at: new Date(1454293795551)
      },
      {
        body: 'Explicabo perspiciatis...',
        article_id: 1,
        author: 'cooljmessy',
        votes: 4,
        created_at: new Date(1463121267403)
      }
    ]);
  });
});

// describe('changedKey', () => {
//   it("doesn't mutate original array", () => {
//     const input = [];
//     expect(changedKey(input)).to.not.equal(input);
//     expect(changedKey(input)).to.eql(input);
//   });
//   it("doesn't mutate elements within original array", () => {
//     const input = [
//       { shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' },
//       { shop_name: 'shop-d', owner: 'firstname-c', slogan: 'slogan-d' }
//     ];
//     changedKey(input);
//     expect(input[0]).to.eql(input[0]);
//   });
//   it('changes name of owner key to owner_id for single object in array', () => {
//     const input = [
//       { shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' }
//     ];
//     expect(changedKey(input, 'owner', 'owner_id')).to.eql([
//       { shop_name: 'shop-b', owner_id: 'firstname-b', slogan: 'slogan-b' }
//     ]);
//   });
//   it('changes name of owner key to owner_id for mutiple objects in array', () => {
//     const input = [
//       { shop_name: 'shop-b', owner: 'firstname-b', slogan: 'slogan-b' },
//       { shop_name: 'shop-d', owner: 'firstname-c', slogan: 'slogan-d' },
//       { shop_name: 'shop-e', owner: 'firstname-d', slogan: 'slogan-e' },
//       { shop_name: 'shop-f', owner: 'firstname-e', slogan: 'slogan-f' },
//       { shop_name: 'shop-g', owner: 'firstname-f', slogan: 'slogan-g' },
//       { shop_name: 'shop-h', owner: 'firstname-a', slogan: 'slogan-h' },
//       { shop_name: 'shop-i', owner: 'firstname-g', slogan: 'slogan-i' }
//     ];
//     expect(changedKey(input, 'owner', 'owner_id')).to.eql([
//       { shop_name: 'shop-b', owner_id: 'firstname-b', slogan: 'slogan-b' },
//       { shop_name: 'shop-d', owner_id: 'firstname-c', slogan: 'slogan-d' },
//       { shop_name: 'shop-e', owner_id: 'firstname-d', slogan: 'slogan-e' },
//       { shop_name: 'shop-f', owner_id: 'firstname-e', slogan: 'slogan-f' },
//       { shop_name: 'shop-g', owner_id: 'firstname-f', slogan: 'slogan-g' },
//       { shop_name: 'shop-h', owner_id: 'firstname-a', slogan: 'slogan-h' },
//       { shop_name: 'shop-i', owner_id: 'firstname-g', slogan: 'slogan-i' }
//     ]);
//   });
// });
