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
  test("status 404: responds with a message telling user that that endpoint does not exist", () => {
    return request(app)
      .get("/api/NonExistant")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No such endpoint!");
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
          const topics = body;

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
});
