import { Logger } from '@aws-lambda-powertools/logger';
import { AppSyncAuthorizerEvent } from '../../type/AppSyncAuthorizerEvent';
import getLogger from '../../internal/logger';

const logger: Logger = getLogger('lambda-authorizer');

export const handler = async (event: AppSyncAuthorizerEvent) => {
  const token = event.authorizationToken;

  // Implement your token validation logic here
  const isAuthorized = token === 'valid-token';
  logger.info({
    message: 'Request authorization is complete',
    data: { isAuthorized },
  });

  return {
    isAuthorized,
  };
};
