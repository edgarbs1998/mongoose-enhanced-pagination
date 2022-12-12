import { encode } from "../src/utils/urlEncoding";
import { ExpectedData } from "./interfaces/expected-data.interface";
import {
  openMongodConnection,
  closeMongodConnection,
} from "./utils/memory-server";
import { UserDocument, UserModel } from "./utils/schema";
import { TestData } from "./utils/test-data";

beforeAll(async () => {
  await openMongodConnection();
});

afterAll(async () => {
  await closeMongodConnection();
});

afterEach(async () => {
  await UserModel.deleteMany();
});

describe("cursor pagination", () => {
  it("no cursors", async () => {
    const data = await TestData.generateData(3);
    const limit = 3;

    const cursorResponse = await UserModel.cursorPaginate({
      limit: limit,
    })
      .lean()
      .exec();

    const expectedData: ExpectedData<UserDocument> = {
      data: data,
      limit: limit,
    };
    TestData.expectCursor(cursorResponse, expectedData);
  });

  it("has next cursor", async () => {
    const data = await TestData.generateData(3);
    const limit = 2;

    const expectedDocuments = data.slice(0, limit);

    const cursorResponse = await UserModel.cursorPaginate({
      limit: limit,
    })
      .lean()
      .exec();

    const expectedNextCursor = encode([
      expectedDocuments[expectedDocuments.length - 1]?._id,
    ]);
    const expectedData: ExpectedData<UserDocument> = {
      data: expectedDocuments,
      limit: limit,
      cursors: {
        next: expectedNextCursor,
      },
    };
    TestData.expectCursor(cursorResponse, expectedData);
  });

  // TODO Create a route with options next cursor

  it("has previous cursor", async () => {
    const data = await TestData.generateData(3);
    const limit = 2;

    const expectedDocuments = data.slice(2, 3);

    const nextCursor = encode([data[1]?._id]);

    const cursorResponse = await UserModel.cursorPaginate({
      limit: limit,
      next: nextCursor,
    })
      .lean()
      .exec();

    const expectedPreviousCursor = encode([expectedDocuments[0]?._id]);
    const expectedData: ExpectedData<UserDocument> = {
      data: expectedDocuments,
      limit: limit,
      cursors: {
        previous: expectedPreviousCursor,
      },
    };
    TestData.expectCursor(cursorResponse, expectedData);
  });

  it("default sorting ascending", async () => {
    const data = await TestData.generateData([2, 1, 3]);
    const limit = 3;

    const expectedDocuments = data;

    const cursorResponse = await UserModel.cursorPaginate({
      limit: limit,
      sort: {
        ascending: true,
      },
    })
      .lean()
      .exec();

    const expectedData: ExpectedData<UserDocument> = {
      data: expectedDocuments,
      limit: limit,
    };
    TestData.expectCursor(cursorResponse, expectedData);
  });

  it("default sorting descending", async () => {
    const data = await TestData.generateData([2, 1, 3]);
    const limit = 3;

    const expectedDocuments = data.reverse();

    const cursorResponse = await UserModel.cursorPaginate({
      limit: limit,
      sort: {
        ascending: false,
      },
    })
      .lean()
      .exec();

    const expectedData: ExpectedData<UserDocument> = {
      data: expectedDocuments,
      limit: limit,
    };
    TestData.expectCursor(cursorResponse, expectedData);
  });

  it("sorting by name ascending", async () => {
    const data = await TestData.generateData([2, 1, 3]);
    const limit = 3;

    const nameOrder = ["name_1", "name_2", "name_3"];
    const expectedDocuments = [...data];
    expectedDocuments.sort(function (a, b) {
      return nameOrder.indexOf(a.name) - nameOrder.indexOf(b.name);
    });

    const cursorResponse = await UserModel.cursorPaginate({
      limit: limit,
      sort: {
        field: "name",
        ascending: true,
      },
    })
      .lean()
      .exec();

    const expectedData: ExpectedData<UserDocument> = {
      data: expectedDocuments,
      limit: limit,
    };
    TestData.expectCursor(cursorResponse, expectedData);
  });
});
