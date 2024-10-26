import { handler } from "../../src/function/user/createUser.handler";

describe("create user tests", () => {
  it("should return the created user correctly", async () => {
    const response = await handler({
      arguments: { user: { id: "123", name: "John Doe" } },
    });
    expect(response).toStrictEqual({
      success: true,
      data: { id: "123", name: "John Doe" },
    });
  });
});
