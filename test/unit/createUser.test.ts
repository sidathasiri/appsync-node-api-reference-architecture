import { DynamoDBConnector } from '../../src/connector/dynamodb';
import { handler } from '../../src/function/user/createUser.handler';

jest.mock('../../src/connector/dynamodb');

const mockCreateItem = jest.fn();

describe('create user tests', () => {
  it('should return the created user correctly', async () => {
    jest
      .spyOn(DynamoDBConnector.prototype, 'createItem')
      .mockImplementation(mockCreateItem);
    const response = await handler({
      arguments: { user: { id: '123', name: 'John Doe' } },
    });
    expect(response).toStrictEqual({
      success: true,
      data: { id: '123', name: 'John Doe' },
    });
    expect(mockCreateItem).toHaveBeenCalledTimes(1);
  });
});
