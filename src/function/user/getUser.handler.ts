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
  const { pk, ...bodyWithoutPk } = await dynamoConnector.getItemByKey(
    event.arguments.id
  );

  return {
    success: true,
    data: {
      ...bodyWithoutPk,
    },
  };
};
