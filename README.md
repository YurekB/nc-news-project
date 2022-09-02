To successfully setup a connection to the local databases, make 2 files:

File 1 - .env.test

inside the file add:

PGDATABASE=nc_news_test

File 2 - .env.development

inside the file add:

PGDATABASE=nc_news

Hosted Website: https://yureks-nc-news.netlify.app/

This is the backend to my NC news project, this is the API used by my front end website. Endpoints.json has a list of all the possible endpoints and example responses.

To run this on your local machine, first clone this repo down onto your machine. Then CD into the repo and in the command line run "npm install". After that run "heroku config:get DATABASE_URL" to seed the database. running "npm t" will go through all the tests and see if they are all passing.

minimum required node version: 18.7.0

minimum required node version: 14.4
