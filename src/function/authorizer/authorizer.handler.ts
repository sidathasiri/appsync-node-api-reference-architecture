import { AppSyncAuthorizerEvent } from '../../type/AppSyncAuthorizerEvent';

export const handler = async (event: AppSyncAuthorizerEvent) => {
  const token = event.authorizationToken;

  const isAuthorized = token === 'valid-token';

  return {
    isAuthorized,
  };
};
