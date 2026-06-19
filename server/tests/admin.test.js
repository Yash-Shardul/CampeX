process.env.NODE_ENV = "test";
const request = require("supertest");
const mongoose = require("mongoose");

// Mock mongoose BEFORE requiring app
jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue(true),
  Schema: jest.fn().mockImplementation(() => ({
    pre: jest.fn(),
    methods: {},
    post: jest.fn(),
    index: jest.fn(),
    virtual: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  })),
  model: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
  }),
}));

const app = require("../server");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

jest.mock("../models/Admin");

describe("Admin API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/admin/login", () => {
    it("should login successfully with correct credentials", async () => {
      const mockAdmin = {
        _id: "admin123",
        name: "Main Admin",
        email: "admin@campex.com",
        password: "hashedpassword",
        role: "main",
        permissions: ["all"],
      };

      Admin.findOne.mockResolvedValue(mockAdmin);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "admin@campex.com", password: "password123" });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.name).toBe("Main Admin");
    });

    it("should return 400 with incorrect credentials", async () => {
      Admin.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "wrong@campex.com", password: "password123" });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Admin not found");
    });
  });
});
