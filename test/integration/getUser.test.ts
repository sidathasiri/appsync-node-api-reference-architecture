// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { ConfigurationsType, getConfigurations } from './helper/configs';
import { DynamoDBConnector } from '../../src/connector/dynamodb';

let configs: ConfigurationsType;
let dynamoDBConnector: DynamoDBConnector;

beforeAll(async () => {
  configs = getConfigurations();
  dynamoDBConnector = new DynamoDBConnector(configs.region, configs.tableName);
  dynamoDBConnector.createItem({
    pk: '2',
    id: '2',
    name: 'Jane Doe',
  });
});

describe('get user integration tests', () => {
  it('should throw error for invalid token', async () => {
    await request(configs.graphqlEndpoint)
      .post('/')
      .send({
        query: `
          query {
            getUser(id: "2") {
              data {
                id
                name
              }
              success
              error
            }
          }
        `,
      })
      .set({ Authorization: 'invalid-token' })
      .expect(401)
      .then((res) => {
        const responseBody = res.body;
        expect(responseBody).toStrictEqual({
          errors: [
            {
              errorType: 'UnauthorizedException',
              message: 'You are not authorized to make this call.',
            },
          ],
        });
      });
  });
  it('should return the user correctly', async () => {
    await request(configs.graphqlEndpoint)
      .post('/')
      .send({
        query: `
          query {
            getUser(id: "2") {
              data {
                id
                name
              }
              success
              error
            }
          }
        `,
      })
      .set({ Authorization: 'valid-token' })
      .expect(200)
      .then((res) => {
        const responseBody = res.body.data.getUser;
        expect(responseBody.error).toBeNull();
        expect(responseBody.success).toBeTruthy();
        expect(responseBody.data).toStrictEqual({
          id: '2',
          name: 'Jane Doe',
        });
      });
  });
});

afterAll(async () => {
  await dynamoDBConnector.deleteItemByKey('2');
});
