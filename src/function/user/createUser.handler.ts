import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBConnector } from '../../connector/dynamodb';
import { User } from '../../type/User';
import getLogger from '../../internal/logger';

const { REGION, TABLE_NAME } = process.env;

if (!REGION || !TABLE_NAME) {
  throw new Error('Required environment variables not found');
}

const logger: Logger = getLogger('create-user-handler');

const dynamoConnector = new DynamoDBConnector(REGION, TABLE_NAME);

export const handler = async (event: { arguments: { user: User } }) => {
  const user = event.arguments.user;

  logger.info({
    message: 'Create user request received',
    data: { user },
  });

  try {
    await dynamoConnector.createItem({
      pk: user.id,
      id: user.id,
      name: user.name,
    });

    logger.info({
      message: 'User created successfully',
    });

    return {
      success: true,
      data: {
        ...user,
      },
    };
  } catch (e) {
    logger.error({
      message: 'Internal server error',
      data: { error: e },
    });
    return {
      success: false,
      error: 'Internal server error',
    };
  }
};
