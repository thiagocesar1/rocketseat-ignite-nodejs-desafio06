import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      email: "jest@supertest.com",
      name: "Test Supertest",
      password: "supertest"
    };

    await request(app).post("/api/v1/users").send({
      email: user.email,
      name: user.name,
      password: user.password
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate with an nonexistent user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "supertest@error.com",
      password: "supertesterror"
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const user = {
      email: "jest@supertest.com",
      name: "Test Supertest",
      password: "supertest"
    };

    await request(app).post("/api/v1/users").send({
      email: user.email,
      name: user.name,
      password: user.password
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: "supertesterror"
    });

    expect(response.status).toBe(401);
  });

});
