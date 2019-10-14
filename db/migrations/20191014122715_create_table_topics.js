exports.up = function(knex) {
  console.log('creating topics table...');
  return knex.schema.createTable('topics', articlesTable => {
    articlesTable.increments('topic_id').primary();
    articlesTable.string('description').notNullable();
    articlesTable.string('slug').notNullable();
  });
};

exports.down = function(knex) {};
