import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  BaseDataSource,
  IGraphqlApi,
  LambdaDataSource,
} from 'aws-cdk-lib/aws-appsync';
import { IRole } from 'aws-cdk-lib/aws-iam';

interface LambdaFuncDataSourceProps {
  functionName: string;
  appsyncAPI: IGraphqlApi;
  dataSourceName: string;
  functionCodeFilePath: string;
  timeout: number;
  memory: number;
  role: IRole;
}

export class LambdaFuncDataSource extends Construct {
  lambdaFunction: NodejsFunction;

  lambdaDataSource: BaseDataSource;

  constructor(scope: Construct, id: string, props: LambdaFuncDataSourceProps) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, props.functionName, {
      functionName: props.functionName,
      entry: join(__dirname, `../${props.functionCodeFilePath}`),
      runtime: Runtime.NODEJS_20_X,
      handler: 'handler',
      timeout: cdk.Duration.seconds(props.timeout),
      memorySize: props.memory,
      role: props.role,
    });

    this.lambdaDataSource = new LambdaDataSource(this, props.dataSourceName, {
      api: props.appsyncAPI,
      lambdaFunction: this.lambdaFunction,
      name: props.dataSourceName,
    });
  }
}
