import { Handler } from "aws-cdk-lib/aws-lambda";

export const handler: Handler = async () => {
  console.log("Working!");
  return {
    success: true,
    data: {
      id: "123",
      name: "John",
    },
  };
};
