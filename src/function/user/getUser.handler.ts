export const handler = async () => {
  console.log('Get user request received');

  return {
    success: true,
    data: {
      id: '123',
      name: 'John Doe',
    },
  };
};
