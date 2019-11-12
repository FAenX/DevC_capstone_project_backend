import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

const { expect } = chai;
chai.use(chaiHttp);

const testArticle = {
  title: "test title",
  body: "a very long body",
};

let testArticleId = null;

describe("Article end point", () => {
  it("creates an article",
    async () => {
      const response = await chai.request(app)
        .post("/api/v1/articles")
        .send(testArticle);

      expect(response).to.have.status(202);
      expect(response.body.status).to.equals("success");
      expect(response.body.data).to.have.property("title");
      expect(response.body.data).to.have.property("body");
      testArticleId = response.body.data.id;
    });
});