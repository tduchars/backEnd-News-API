This api is designed so that you can intuitively find any article you are looking for from NorthCoders. For example you can find articles by it's respective article_id or author or look for all the users on the api who have an account and even see what articles they have written and if they have received any comments on that article.

The link to the api hosted on Heroku is: <link>https://nc-tabloid.herokuapp.com/api<link>

In order to run the api locally you will need to install the dependencies which can be found in the package.json file.

Run the command below to install all necessary dependencies:

```bash
npm install
```

If you encounter any issues ensure your dependencies look like this... (especially the versions)

```js
"dependencies": {
    "express": "^4.17.1",
    "knex": "^0.19.5",
    "lodash": "^4.17.15",
    "pg": "^7.12.1"
  }
```

A test, development and production environment has been constructed so you can have access to multiple different data sets depending on what you are looking to do.

To seed the database the command is...

```bash
npm run setup-dbs
npm run migrate-latest
npm run seed
```

(All scripts can of course also be found on the package.json)

Inside the database folder there is also a migrations folder in which you can take a look at the schema for each of the tables as well as which table columns are in reference to others.

Navigating to /spec/app.spec.js we can take a look at the testing for the api.

```js
process.env.NODE_ENV = 'test';
```

There is single line of code at the top which sets the environment to utilise the 'testing database setup' previously mentioned.

To run the existing tests use:

```bash
npm test
```

To change the environment between either test, development or production navigate to ./knexfile.js where the configuration can be found.
