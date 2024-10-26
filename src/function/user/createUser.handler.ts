export const handler = async (event: any) => {
  console.log("Create user request received with event:", JSON.stringify(event));

  return {
    success: true,
    data: {
      ...event.arguments.user,
    },
  };
};
