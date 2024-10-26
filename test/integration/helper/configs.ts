import * as configs from '../../../cdk-outputs.json';

export type ConfigurationsType = {
  graphqlEndpoint: string;
};

export const getConfigurations = (): ConfigurationsType => {
  if (Object.keys(configs).length === 0) {
    throw new Error('No CDK configs found from the cdk-outputs.json file');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.values(configs)[0];
};
