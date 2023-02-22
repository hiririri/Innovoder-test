import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, UnauthorizedException } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { describe } from "node:test";

describe("App (e2e)", () => {
  let app: INestApplication;
  let token = "";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("Authentication", () => {
    describe("Resiter", () => {
      // Test with an empty username
      it("should not registe the user with an empty username", async () => {
        return await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            username: "",
            password: "123",
          })
          .expect(400);
      });

      // Test with a false password
      it("should not registe the user with an empty password", async () => {
        return await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            username: "aaa@gmail.com",
            password: "",
          })
          .expect(400);
      });

      // Test with an user already exsited
      it("should not registe if the user already exists", async () => {
        return await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            username: "aaa@gmail.com",
            password: "qwe",
          })
          .expect(400);
      });

      // Test with the correct user register information
      it("should registe a 'ccc@gmail.com' user", async () => {
        return await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            username: "ccc@gmail.com",
            password: "123",
          })
          .expect(201);
      });
    });

    describe("Login", () => {
      // Test with an empty username
      it("should not authenticate the user with an empty username", async () => {
        return await request(app.getHttpServer())
          .post("/api/v1/auth/login")
          .send({
            username: "",
            password: "123",
          })
          .expect(401);
      });

      // Test with a false password
      it("should not authenticate the user with a false password", async () => {
        return await request(app.getHttpServer())
          .post("/api/v1/auth/login")
          .send({
            username: "ccc@gmail.com",
            password: "qwe",
          })
          .expect(401);
      });

      // Test with the correct user login information
      it("should authenticate the user with the correct login information", async () => {
        const res = await request(app.getHttpServer())
          .post("/api/v1/auth/login")
          .send({
            username: "ccc@gmail.com",
            password: "123",
          })
          .expect(200);
        token = res.body.access_token;
        return token;
      });
    });
  });

  describe("User", () => {
    describe("Update user data", () => {
      // Test the update of the user's password in an unauthorized route
      it("should not update the user's password without athentification", async () => {
        return await request(app.getHttpServer())
          .patch("/api/v1/users")
          .send({
            username: "ccc@gmail.com",
            password: "123",
          })
          .expect(401);
      });

      // Test the update of the user's password in an authorized route
      it("should pass the authentication check and update the user's password", async () => {
        return await request(app.getHttpServer())
          .patch("/api/v1/users")
          .set("Authorization", "Bearer " + token)
          .send({
            username: "ccc@gmail.com",
            password: "111",
          })
          .expect(200);
      });
    });
  });

  describe("Food product", () => {
    // Test the research of a food product in an unauthorized route
    it("should not return a food product without authentication", async () => {
      return await request(app.getHttpServer())
        .get("/api/v1/product/1=")
        .send({
          code: "123123",
        })
        .expect(401);
    });

    // Test the research of a food product dosen't exist
    it("should throw a NotFoundException", async () => {
      return await request(app.getHttpServer())
        .get("/api/v1/product/1=")
        .set("Authorization", "Bearer " + token)
        .send({
          code: "0",
        })
        .expect(404);
    });

    // Test the research of a food product by its barcode in an authorized route
    it("should return a food product with a token authenticated", async () => {
      const productResponse = await request(app.getHttpServer())
        .get("/api/v1/product/1=")
        .set("Authorization", "Bearer " + token)
        .send({
          code: "40896243",
        })
        .expect(200);

        // Chocolat noir bio 70%
        expect(productResponse.body).toHaveProperty("product");
        return productResponse.body.product.product_name_fr;
    });
  });

  // Delete test user
  it("delete 'ccc@gmail.com' user", async () => {
    return await request(app.getHttpServer())
      .delete("/api/v1/users")
      .send({
        username: "ccc@gmail.com",
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
