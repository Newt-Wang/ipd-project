import request from "supertest";
import app from "../server.js";
import pool from "../db.js";

describe("Auth API Integration", () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: "testpass123",
  };

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE username = ?", [testUser.username]);
    await pool.end();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User registered");
    });

    it("should reject duplicate username", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });

    it("should reject missing password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "someuser" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing fields");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login and return a token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send(testUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should reject wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: testUser.username, password: "wrongpass" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Wrong password");
    });

    it("should reject non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "nobody", password: "pass" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User not found");
    });
  });
});
