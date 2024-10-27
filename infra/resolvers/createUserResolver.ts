import { Construct } from 'constructs';
import { IGraphqlApi, Resolver } from 'aws-cdk-lib/aws-appsync';

import { IRole } from 'aws-cdk-lib/aws-iam';
import { LambdaFuncDataSource } from '../lambdaDataSource';

interface CreateUserResolverProps {
  appsyncAPI: IGraphqlApi;
  resolverName: string;
  role?: IRole;
  envVariables?: {
    [key: string]: string;
  };
}

export class CreateUserResolver extends Construct {
  constructor(scope: Construct, id: string, props: CreateUserResolverProps) {
    super(scope, id);

    const dataSource = new LambdaFuncDataSource(
      this,
      'create-user-datasource',
      {
        appsyncAPI: props.appsyncAPI,
        dataSourceName: `${props.resolverName}-ds`,
        functionName: `${props.resolverName}-function`,
        functionCodeFilePath: 'src/function/user/createUser.handler.ts',
        memory: 128,
        timeout: 5,
        role: props.role,
        envVariables: props.envVariables,
      }
    );

    new Resolver(this, 'create-user-resolver', {
      api: props.appsyncAPI,
      dataSource: dataSource.lambdaDataSource,
      typeName: 'Mutation',
      fieldName: 'createUser',
    });
  }
}
