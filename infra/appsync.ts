import { Construct } from 'constructs';
import {
  AuthorizationType,
  Definition,
  GraphqlApi,
} from 'aws-cdk-lib/aws-appsync';
import path = require('path');
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { CreateUserResolver } from './resolvers/createUserResolver';
import { GetUserResolver } from './resolvers/getUserResolver';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

interface AppSyncProps {
  apiNameName: string;
  table: Table;
  region: string;
}

export class AppSyncAPI extends Construct {
  appsyncAPI: GraphqlApi;

  constructor(scope: Construct, id: string, props: AppSyncProps) {
    super(scope, id);

    const authorizer = new NodejsFunction(this, 'lambda-authorizer', {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(
        __dirname,
        `../src/function/authorizer/authorizer.handler.ts`
      ),
      handler: 'handler',
      functionName: 'lambda-authorizer',
    });

    this.appsyncAPI = new GraphqlApi(this, 'Api', {
      name: props.apiNameName,
      definition: Definition.fromFile(
        path.join(__dirname, '../src/schema.graphql')
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: authorizer,
            resultsCacheTtl: Duration.seconds(30),
          },
        },
      },
    });

    // Create service role to AppSync to invoke lambda data sources
    new Role(this, 'appsync-lambda-invocation-role', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
      inlinePolicies: {
        lambdaInvoke: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['lambda:invokeFunction'],
              resources: ['*'],
            }),
          ],
        }),
      },
    });

    // IAM role for lambda data source
    const lambdaDataSourceRole = new Role(this, 'DynamoDbFullAccessRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        {
          managedPolicyArn:
            'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
        },
      ],
    });

    lambdaDataSourceRole.addToPolicy(
      new PolicyStatement({
        actions: ['dynamodb:*'],
        resources: [props.table.tableArn],
      })
    );

    // Resolver for create user mutation
    new CreateUserResolver(this, 'create-user-resolver', {
      appsyncAPI: this.appsyncAPI,
      resolverName: 'create-user',
      role: lambdaDataSourceRole,
      envVariables: {
        TABLE_NAME: props.table.tableName,
        REGION: props.region,
      },
    });

    // Resolver for get user query
    new GetUserResolver(this, 'get-user-resolver', {
      appsyncAPI: this.appsyncAPI,
      resolverName: 'get-user',
      role: lambdaDataSourceRole,
      envVariables: {
        TABLE_NAME: props.table.tableName,
        REGION: props.region,
      },
    });
  }
}
