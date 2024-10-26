import { handler } from '../../src/function/authorizer/authorizer.handler';

describe('authorizer tests', () => {
  it('should return authorized for valid token', async () => {
    const response = await handler({
      authorizationToken: 'valid-token',
    });
    expect(response).toStrictEqual({ isAuthorized: true });
  });

  it('should return not authorized for invalid token', async () => {
    const response = await handler({
      authorizationToken: 'invalid-token',
    });
    expect(response).toStrictEqual({ isAuthorized: false });
  });
});
