import { DynamoDBConnector } from '../../connector/dynamodb';
import { User } from '../../type/User';

const { REGION, TABLE_NAME } = process.env;

if (!REGION || !TABLE_NAME) {
  throw new Error('Required environment variables not found');
}

const dynamoConnector = new DynamoDBConnector(REGION, TABLE_NAME);

export const handler = async (event: { arguments: { user: User } }) => {
  const user = event.arguments.user;
  console.log(
    'Create user request received with event:',
    JSON.stringify(event)
  );

  await dynamoConnector.createItem({
    pk: user.id,
    id: user.id,
    name: user.name,
  });

  return {
    success: true,
    data: {
      ...user,
    },
  };
};
