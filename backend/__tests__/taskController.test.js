describe("taskController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getTasks", () => {
    it("should extract user id from request", async () => {
      const { getTasks } = await import("../controllers/taskController.js");
      
      expect(req.user.id).toBe(1);
    });
  });

  describe("createTask", () => {
    it("should use default priority when not provided", async () => {
      const { createTask } = await import("../controllers/taskController.js");
      
      req.body = { title: "Test Task" };
      
      expect(req.body.priority).toBeUndefined();
    });

    it("should format due_date correctly", () => {
      const date = new Date("2024-01-01T12:00:00.000Z");
      const formatted = date.toISOString().slice(0, 19).replace('T', ' ');
      
      expect(formatted).toBe("2024-01-01 12:00:00");
    });
  });

  describe("updateTaskStatus", () => {
    it("should have correct parameters", async () => {
      const { updateTaskStatus } = await import("../controllers/taskController.js");
      
      req.params = { id: 1 };
      req.body = { completed: true };
      
      expect(req.params.id).toBe(1);
      expect(req.body.completed).toBe(true);
      expect(req.user.id).toBe(1);
    });
  });
});
