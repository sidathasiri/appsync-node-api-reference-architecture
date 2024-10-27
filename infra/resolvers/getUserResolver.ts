import { Construct } from 'constructs';
import { IGraphqlApi, Resolver } from 'aws-cdk-lib/aws-appsync';
import { LambdaFuncDataSource } from '../lambdaDataSource';
import { IRole } from 'aws-cdk-lib/aws-iam';

interface GetUserResolverProps {
  appsyncAPI: IGraphqlApi;
  resolverName: string;
  role: IRole;
}

export class GetUserResolver extends Construct {
  constructor(scope: Construct, id: string, props: GetUserResolverProps) {
    super(scope, id);

    const dataSource = new LambdaFuncDataSource(this, 'get-user-datasource', {
      appsyncAPI: props.appsyncAPI,
      dataSourceName: `${props.resolverName}-ds`,
      functionName: `${props.resolverName}-function`,
      functionCodeFilePath: 'src/function/user/getUser.handler.ts',
      memory: 128,
      timeout: 5,
      role: props.role,
    });

    new Resolver(this, 'get-user-resolver', {
      api: props.appsyncAPI,
      dataSource: dataSource.lambdaDataSource,
      typeName: 'Query',
      fieldName: 'getUser',
    });
  }
}
