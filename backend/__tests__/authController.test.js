import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config.js";

describe("authController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("login", () => {
    it("should return 400 if user not found", async () => {
      const mockPool = { query: jest.fn().mockResolvedValueOnce([[]]) };
      const { login } = await import("../controllers/authController.js");
      
      // 直接替换模块中的 pool
      jest.doMock("../db.js", () => ({ default: mockPool }));
      const { login: mockedLogin } = await import("../controllers/authController.js");
      
      req.body = { username: "test", password: "password" };
      await mockedLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("validates missing fields for register", async () => {
      const { register } = await import("../controllers/authController.js");
      
      req.body = { username: "test" };
      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing fields" });
    });
  });

  describe("register", () => {
    it("should return 400 if missing fields", async () => {
      const { register } = await import("../controllers/authController.js");
      
      req.body = { username: "test" };
      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing fields" });
    });
  });
});
