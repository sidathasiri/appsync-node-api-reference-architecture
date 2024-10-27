import { DynamoDBConnector } from '../../connector/dynamodb';

const { REGION, TABLE_NAME } = process.env;

if (!REGION || !TABLE_NAME) {
  throw new Error('Required environment variables not found');
}

const dynamoConnector = new DynamoDBConnector(REGION, TABLE_NAME);

export const handler = async (event: { arguments: { id: string } }) => {
  console.log('Get user request received');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const response = await dynamoConnector.getItemByKey(event.arguments.id);

  if (!response) {
    return {
      success: false,
      error: 'User not found',
    };
  }

  const { pk, ...bodyWithoutKeys } = response;

  return {
    success: true,
    data: {
      ...bodyWithoutKeys,
    },
  };
};
