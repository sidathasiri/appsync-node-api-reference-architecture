// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { ConfigurationsType, getConfigurations } from './helper/configs';

let configs: ConfigurationsType;

beforeAll(async () => {
  configs = getConfigurations();
});

describe('get user integration tests', () => {
  it('should return the user correctly', async () => {
    await request(configs.graphqlEndpoint)
      .post('/')
      .send({
        query: `
          query {
            getUser(id: "123") {
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
        const responseBody = res.body.data.getUser;
        expect(responseBody.error).toBeNull();
        expect(responseBody.success).toBeTruthy();
        expect(responseBody.data).toStrictEqual({
          id: '123',
          name: 'John Doe',
        });
      });
  });
});