export const handler = async (event: any) => {
  return {
    success: true,
    data: {
      ...event.arguments.user,
    },
  };
};
