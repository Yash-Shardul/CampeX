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
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  }),
}));

const app = require("../server");
const Event = require("../models/Event");

jest.mock("../models/Event");

describe("Event API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/events", () => {
    it("should fetch all events", async () => {
      const mockEvents = [
        { title: "Hackathon", venue: "Hall A", startTime: new Date() },
        { title: "Music Fest", venue: "Field", startTime: new Date() },
      ];

      Event.find.mockResolvedValue(mockEvents);

      const res = await request(app).get("/api/events");

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].title).toBe("Hackathon");
    });
  });
});
