import { User } from '../../type/User';

export const handler = async (event: { arguments: { user: User } }) => {
  console.log(
    'Create user request received with event:',
    JSON.stringify(event)
  );

  return {
    success: true,
    data: {
      ...event.arguments.user,
    },
  };
};
