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
  test("status 400: responds with an error message when trying to patch with a value that cant be used", () => {
    const update = { inc_votes: "bad request" };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid value being patched!");
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
              article_id: 1,
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

describe("PATCH Requests", () => {
  describe("/api/articles/:article_id", () => {
    test("status 200:updates given article and responds with the updated article (positive number)", () => {
      const newObj = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(newObj)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: 101,
            })
          );
        });
    });
    test("status 200:updates given article and responds with the updated article (negative number)", () => {
      const newObj = { inc_votes: -100 };
      return request(app)
        .patch("/api/articles/1")
        .send(newObj)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: 0,
            })
          );
        });
    });
  });
});
