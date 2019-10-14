exports.up = function(knex) {
  console.log('creating articles table...');
  return knex.schema.createTable('articles', articlesTable => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.string('topic').notNullable();
    articlesTable.string('author').notNullable();
    articlesTable.string('body').notNullable();
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

//rollbacks db
exports.down = function(knex) {
  console.log('removing previous table...');
  return knex.schema.dropTable('articles');
};
