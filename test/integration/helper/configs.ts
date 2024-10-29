import * as configs from '../../../cdk-outputs.json';

export type ConfigurationsType = {
  graphqlEndpoint: string;
  region: string;
  tableName: string;
};

export const getConfigurations = (): ConfigurationsType => {
  if (Object.keys(configs).length === 0) {
    throw new Error('No CDK configs found from the cdk-outputs.json file');
  }

  return Object.values(configs)[0];
};
