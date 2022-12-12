/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CursorResponse } from "../../src/interfaces/cursor-response.interface";
import { ExpectedData } from "../interfaces/expected-data.interface";
import { User, UserDocument, UserModel } from "./schema";

export class TestData {
  static async generateData(
    amountOrOrder: number | Array<number>
  ): Promise<Array<UserDocument>> {
    const data: Array<UserDocument> = [];

    let range: Array<number> = [];
    if (typeof amountOrOrder === "number") {
      for (let i = 1; i <= amountOrOrder; ++i) {
        range.push(i);
      }
    } else {
      range = amountOrOrder;
    }

    for (const value of range) {
      const user: User = {
        name: "name_" + value,
        email: "email_" + value + "@npmjs.com",
      };

      const document = await UserModel.create(user);

      data.push(document);
    }

    return data;
  }

  static expectCursor(
    cursorResponse: CursorResponse<UserDocument>,
    expectedData: ExpectedData<UserDocument>
  ) {
    expect(cursorResponse).toBeDefined();
    expect(cursorResponse).toBeInstanceOf(Object);
    expect(cursorResponse.data).toBeDefined();
    expect(cursorResponse.data).toBeInstanceOf(Array);
    expect(cursorResponse.data).toHaveLength(expectedData.data.length);
    expect(cursorResponse.paging).toBeInstanceOf(Object);
    expect(cursorResponse.paging.limit).toBeDefined();
    expect(cursorResponse.paging.limit).toBe(expectedData.limit);

    if (expectedData.cursors) {
      expect(cursorResponse.paging.cursors).toBeDefined();
      expect(cursorResponse.paging.cursors).toBeInstanceOf(Object);
    }
    if (expectedData.cursors?.next) {
      expect(cursorResponse.paging.cursors!.next).toBeDefined();
      expect(typeof cursorResponse.paging.cursors!.next).toBe("string");
      expect(cursorResponse.paging.cursors!.next).toMatch(
        expectedData.cursors.next
      );
    }
    if (expectedData.cursors?.previous) {
      expect(cursorResponse.paging.cursors!.previous).toBeDefined();
      expect(typeof cursorResponse.paging.cursors!.previous).toBe("string");
      expect(cursorResponse.paging.cursors!.previous).toMatch(
        expectedData.cursors!.previous
      );
    }

    for (let i = 0; i < cursorResponse.data.length; ++i) {
      const item = cursorResponse.data[i];
      expect(item).toBeDefined();

      const expectedItem = expectedData.data[i];
      expect(expectedItem).toBeDefined();

      expect(item).toBeDefined();
      expect(item).toBeInstanceOf(Object);
      expect(item!.name).toBeDefined();
      expect(typeof item!.name).toBe("string");
      expect(item!.name).toMatch(expectedItem!.name);
      expect(item!.email).toBeDefined();
      expect(typeof item!.email).toBe("string");
      expect(item!.email).toMatch(expectedItem!.email);
    }
  }
}
