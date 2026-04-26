import jwt from "jsonwebtoken";
import config from "../config.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jwt.verify.mockReset();
  });

  it("should return 401 if no authorization header", () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    req.headers.authorization = "Bearer invalidtoken";
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should set user and call next if token is valid", () => {
    const decoded = { id: 1 };
    req.headers.authorization = "Bearer validtoken";
    jwt.verify.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("validtoken", config.jwtSecret);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });
});
