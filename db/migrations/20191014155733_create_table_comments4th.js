exports.up = function(knex) {
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('author')
      .references('username')
      .inTable('users');
    commentsTable
      .integer('article_id')
      .references('article_id')
      .inTable('articles');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};
