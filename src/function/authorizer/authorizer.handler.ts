import { AppSyncAuthorizerEvent } from '../../type/AppSyncAuthorizerEvent';

export const handler = async (event: AppSyncAuthorizerEvent) => {
  const token = event.authorizationToken;

  // Implement your token validation logic here
  const isAuthorized = token === 'valid-token';

  return {
    isAuthorized,
  };
};
