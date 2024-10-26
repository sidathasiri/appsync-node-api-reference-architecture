import { handler } from "../../src/function/user/getUser.handler";

describe("get user tests", () => {
  it("should return the user correctly", async () => {
    const response = await handler();
    expect(response).toStrictEqual({
      success: true,
      data: { id: "123", name: "John Doe" },
    });
  });
});
