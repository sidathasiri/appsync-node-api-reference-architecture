import { DynamoDBConnector } from '../../src/connector/dynamodb';
import { handler } from '../../src/function/user/getUser.handler';

jest.mock('../../src/connector/dynamodb');

describe('get user tests', () => {
  it('should return the user correctly', async () => {
    const mockGetItem = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        pk: 'pk',
        id: '123',
        name: 'John Doe',
      });
    });
    jest
      .spyOn(DynamoDBConnector.prototype, 'getItemByKey')
      .mockImplementation(mockGetItem);
    const response = await handler({
      arguments: {
        id: '123',
      },
    });
    expect(response).toStrictEqual({
      success: true,
      data: { id: '123', name: 'John Doe' },
    });
    expect(mockGetItem).toHaveBeenCalledTimes(1);
  });
});
