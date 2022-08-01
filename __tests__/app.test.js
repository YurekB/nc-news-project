const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Error Handling", () => {
  test("status 404:responds with an error message if passed an endpoint that does not exist", () => {
    return request(app)
      .get("/api/NonExistant")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No such endpoint!");
      });
  });
  test("status 404: responds with an error message if passed an article id that does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that id!");
      });
  });
});

describe("GET Requests", () => {
  describe("/api/topics", () => {
    test("status 200: responds with an array of topic objects, each with 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;

          expect(topics).toBeInstanceOf(Array);
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    test("status 200: responds with an article object with given id and all properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article).toBeInstanceOf(Object);

          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
  });
});
