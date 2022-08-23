const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpointData = require("../endpoints.json");

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
  test("status 404: responds with an error message if trying to patch to an article id that does not exist", () => {
    const newObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/500")
      .send(newObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that id!");
      });
  });
  test("status 400: responds with an error message if trying to patch to an article with a value that isnt a number", () => {
    const newObj = { inc_votes: "NaN" };
    return request(app)
      .patch("/api/articles/500")
      .send(newObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid value being patched!");
      });
  });
  test("status 404: responds with an error message if trying to patch an empty object", () => {
    const newObj = {};
    return request(app)
      .patch("/api/articles/500")
      .send(newObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid value being patched!");
      });
  });
  test("status 404: responds with an error message if passed an article id that does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that id!");
      });
  });
  test("status 404: responds with an error message if trying to post to an article id that does not exist", () => {
    const postObj = { username: "rogersop", body: "i love this article!" };
    return request(app)
      .post("/api/articles/500/comments")
      .send(postObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that id!");
      });
  });
  test("status 404: responds with an error message if trying to delete a comment id that does not exist", () => {
    return request(app)
      .delete("/api/comments/500")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found with that id!");
      });
  });
  test("status 400: respnds with an error message when passing get articles an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=badquery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query!");
      });
  });
  // test("status 400: respnds with an error message when passing get articles an invalid topic query", () => {
  //   return request(app)
  //     .get("/api/articles?topic=badquery")
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Invalid topic query!");
  //     });
  // });
  test("status 400: respnds with an error message when passing get articles an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=badquery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query!");
      });
  });
  test("status 400: responds with an error message when passing get articles a query that is not accepted", () => {
    return request(app)
      .get("/api/articles?author=icellusedkars")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query key!");
      });
  });
  test("status 404: responds with an error message when passed a username that does not exist", () => {
    return request(app)
      .get("/api/users/YurekBogucki")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found with that username!");
      });
  });
  test("status 404: responds with an error message if trying to patch an empty object", () => {
    const newObj = {};
    return request(app)
      .patch("/api/comments/1")
      .send(newObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid value being patched!");
      });
  });
  test("status 404: responds with an error message if trying to patch to a comment id that does not exist", () => {
    const newObj = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/500")
      .send(newObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found with that id!");
      });
  });
  test("status 400: responds with an error message if trying to patch to a comment with a value that isnt a number", () => {
    const newObj = { inc_votes: "NaN" };
    return request(app)
      .patch("/api/comments/1")
      .send(newObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid value being patched!");
      });
  });
  test("status 404: responds with an error message if trying to post an article with an invalid topic", () => {
    const postObj = {
      author: "rogersop",
      title: "Yureks test post article",
      body: "i love this database!",
      topic: "NOT A TOPIC",
    };
    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This topic does not exist!");
      });
  });
  test("status 404: responds with an error message if trying to post an article with an invalid author", () => {
    const postObj = {
      author: "YurekB",
      title: "Yureks test post article",
      body: "i love this database!",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This author does not exist!");
      });
  });
  test("status 400: responds with an error message if trying to post an article with an invalid data type", () => {
    const postObj = {
      author: "rogersop",
      title: "Yureks test post article",
      body: "i love this database!",
      topic: 57,
    };
    return request(app)
      .post("/api/articles")
      .send(postObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data being posted!");
      });
  });
});

describe("GET Requests", () => {
  describe("/api", () => {
    test("status 200: responds with json file containing info about all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { json } = body;
          expect(json).toEqual(endpointData);
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    test("status 200: responds with an object of given comment id", () => {
      return request(app)
        .get("/api/comments/1")
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toBeInstanceOf(Object);
          expect(comment).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              comment_id: 1,
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
    });
  });
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
  describe("/api/articles", () => {
    test("status 200: responds with an array of article objects, all including comment_count. articles sorted by date in desc. order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
  });
  describe("/api/articles (queries)", () => {
    test("status 200: responds with articles array using 3 queries", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=asc&topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11);
          expect(articles).toBeSortedBy("created_at", { descending: false });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "mitch",
              })
            );
          });
        });
    });

    test("status 200: responds with articles array using 2 queries", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "mitch",
              })
            );
          });
        });
    });
    test("status 200: responds with articles array using 1 queries", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("status 200: if only given a topic, default sort by is the date descending", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "mitch",
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
    test("status 200: updated to also include a comment_count property", () => {
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
              comment_count: expect.any(Number),
            })
          );
        });
    });
    describe("/api/articles/:article_id/comments", () => {
      test("status 200: responds with an array of comments for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;

            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
    });
    describe("/api/users", () => {
      test("status 200: responds with an array of user objects, each with username, name and avatar_url properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;

            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(4);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          });
      });
      describe("/api/users/:username", () => {
        test("status 200: responds with a user object", () => {
          return request(app)
            .get("/api/users/rogersop")
            .expect(200)
            .then(({ body }) => {
              const { user } = body;
              expect(user).toBeInstanceOf(Object);
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  avatar_url: expect.any(String),
                  name: expect.any(String),
                })
              );
            });
        });
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
    test("status 200: updates given article and responds with the updated article (negative number)", () => {
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
  describe("/api/comments/:comment:id", () => {
    test("status 200: updates given comment and responds with the updated comment", () => {
      const newObj = { inc_votes: 100 };
      return request(app)
        .patch("/api/comments/1")
        .send(newObj)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 1,
              body: expect.any(String),
              votes: 116,
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
    });
    test("status 200: updates given comment and responds with the updated comment (negative number)", () => {
      const newObj = { inc_votes: -15 };
      return request(app)
        .patch("/api/comments/1")
        .send(newObj)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 1,
              body: expect.any(String),
              votes: 1,
              author: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
    });
  });
});

describe("POST Requests", () => {
  describe("/api/articles/:article_id/comments", () => {
    test("status 200: posts sent comment to database and responds with new comment object", () => {
      const postObj = { username: "randomNAme", body: "i love this article!" };
      return request(app)
        .post("/api/articles/3/comments")
        .send(postObj)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toEqual(
            expect.objectContaining({
              author: "randomNAme",
              body: "i love this article!",
              article_id: expect.any(Number),
              comment_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
  });
  describe("/api/articles", () => {
    test("status 200: posts sent article to database and responds with new article object", () => {
      const postObj = {
        author: "rogersop",
        title: "Yureks test post article",
        body: "i love this database!",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(postObj)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(
            expect.objectContaining({
              author: "rogersop",
              title: "Yureks test post article",
              body: "i love this database!",
              topic: "cats",
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
  });
});
describe("DELETE Requests", () => {
  describe("/api/comments/:comment_id", () => {
    test("status 204: responds with no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
  });
});
