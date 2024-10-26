// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { ConfigurationsType, getConfigurations } from './helper/configs';

let configs: ConfigurationsType;

beforeAll(async () => {
  configs = getConfigurations();
});

describe('create user integration tests', () => {
  it('should create the user correctly', async () => {
    await request(configs.graphqlEndpoint)
      .post('/')
      .send({
        query: `
          mutation {
            createUser(user: {id: "123", name: "123"}) {
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
      .set({ 'x-api-key': 'da2-2psjswgo6vhnfeswh54pwg53wi' })
      .expect(200)
      .then((res) => {
        const responseBody = res.body.data.createUser;
        expect(responseBody.error).toBeNull();
        expect(responseBody.success).toBeTruthy();
        expect(responseBody.data).toStrictEqual({ id: '123', name: '123' });
      });
  });
});
