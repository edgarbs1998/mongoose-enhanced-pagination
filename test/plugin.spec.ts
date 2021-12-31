import {
  openMongodConnection,
  closeMongodConnection,
} from "./utils/memory-server";
import { UserModel } from "./utils/schema";

beforeAll(async () => {
  await openMongodConnection();

  await UserModel.create({ name: "edgar", email: "edgarbs1998@gmail.com" });
});

afterAll(async () => {
  await closeMongodConnection();
});

describe("mongoose plugin", () => {
  describe("cursor pagination", () => {
    it("initializes the pagination static function", () => {
      const query = UserModel.cursorPaginate();
      expect(query).toBeDefined();
    });

    it("initializes the pagination query helper", () => {
      const query = UserModel.find().cursorPaginate();
      expect(query).toBeDefined();
    });
  });

  // TODO Uncomment these tests when offset pagination is implemented
  // describe("offset pagination", () => {
  //   it("initializes the pagination static function", () => {
  //     const query = UserModel.offsetPaginate();
  //     expect(query).toBeDefined();
  //   });

  //   it("initializes the pagination query helper", () => {
  //     const query = UserModel.find().offsetPaginate();
  //     expect(query).toBeDefined();
  //   });
  // });
});
