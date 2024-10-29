import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBConnector } from '../../connector/dynamodb';
import getLogger from '../../internal/logger';

const { REGION, TABLE_NAME } = process.env;

if (!REGION || !TABLE_NAME) {
  throw new Error('Required environment variables not found');
}

const logger: Logger = getLogger('get-user-handler');
const dynamoConnector = new DynamoDBConnector(REGION, TABLE_NAME);

export const handler = async (event: { arguments: { id: string } }) => {
  logger.info({
    message: 'Get user request received',
    data: { id: event.arguments.id },
  });

  try {
    const response = await dynamoConnector.getItemByKey(event.arguments.id);

    if (!response) {
      logger.warn({
        message: 'User not found',
        data: { id: event.arguments.id },
      });
      return {
        success: false,
        error: 'User not found',
      };
    }

    const { pk, ...bodyWithoutKeys } = response;
    logger.info({
      message: 'User found',
      data: { user: response },
    });

    return {
      success: true,
      data: {
        ...bodyWithoutKeys,
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
