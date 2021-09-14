import request from "supertest";
import { app } from "../../../../app";
describe("Create User Controller", () => {
  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      email: "jest@supertest.com",
      name: "Test Supertest",
      password: "supertest"
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with an existent e-mail", async () => {
    const response = await request(app).post("/users").send({
      email: "jest@supertest.com",
      name: "Test Supertest",
      password: "supertest"
    });

    expect(response.status).toBe(400);
  });
});
