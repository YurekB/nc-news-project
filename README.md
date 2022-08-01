To successfully setup a connection to the local databases, make 2 files:

File 1 - .env.test

inside the file add:

PGDATABASE=nc_news_test

File 2 - .env.development

inside the file add:

PGDATABASE=nc_news

////////////////////////////////////////

functions:

getTopics - returns an array of all topics
