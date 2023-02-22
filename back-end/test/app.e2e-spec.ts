import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { describe } from "node:test";

let token = "";

describe("AppController (e2e)", () => {
  let app: INestApplication;

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
      it("should registe a new user", async () => {
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
      });
    });
  });

  describe("User", () => {
    describe("Update user data", () => {
      it("should not update the user's password without athentification", async () => {
        return await request(app.getHttpServer())
          .patch("/api/v1/users")
          .send({
            username: "ccc@gmail.com",
            password: "123",
          })
          .expect(401);
      });

      it("should pass auth check update the user's password", async () => {
        const updateResponse = await request(app.getHttpServer())
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

  const mockProduct = {
    code: "123123",
  };

  it("should not return a product info", async () => {
    return await request(app.getHttpServer())
      .get("/api/v1/product/1=")
      .send(mockProduct)
      .expect(401);
  });

  // Delete test user
  // it("delete 'ccc@gmail.com' user", async () => {
  //   return await request(app.getHttpServer())
  //     .delete("/api/v1/users")
  //     .send({
  //       username: "ccc@gmail.com",
  //     })
  //     .expect(200);
  // });

  afterAll(async () => {
    await app.close();
  });
});
