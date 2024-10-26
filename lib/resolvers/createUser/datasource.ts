import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  BaseDataSource,
  IGraphqlApi,
  LambdaDataSource,
} from "aws-cdk-lib/aws-appsync";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

interface CreateUserDataSourceProps {
  functionName: string;
  appsyncAPI: IGraphqlApi;
  dataSourceName: string;
}

export class CreateUserDataSource extends Construct {
  lambdaFunction: NodejsFunction;

  lambdaDataSource: BaseDataSource;

  constructor(scope: Construct, id: string, props: CreateUserDataSourceProps) {
    super(scope, id);

    this.lambdaFunction = new NodejsFunction(this, props.functionName, {
      functionName: props.functionName,
      entry: join(
        __dirname,
        "../../../src/function/user/createUser.handler.ts"
      ),
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
    });

    this.lambdaFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ["dynamodb:*"],
        resources: ["*"],
      })
    );

    this.lambdaDataSource = new LambdaDataSource(this, props.dataSourceName, {
      api: props.appsyncAPI,
      lambdaFunction: this.lambdaFunction,
      name: props.dataSourceName,
    });
  }
}
