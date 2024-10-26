import { Handler } from "aws-cdk-lib/aws-lambda";

export const handler: Handler = async (event: any) => {
  console.log("Received event:", JSON.stringify(event));
  return {
    success: true,
    data: {
      id: "123",
      name: "John",
    },
  };
};
