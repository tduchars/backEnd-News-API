exports.up = function(knex) {
  console.log('creating users table...');
  return knex.schema.createTable('users', usersTable => {
    usersTable
      .string('username')
      .unique()
      .primary();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  });
};

exports.down = function(knex) {
  console.log('removing previous table...');
  return knex.schema.dropTable('users');
};
