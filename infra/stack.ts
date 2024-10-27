import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppSyncAPI } from './appsync';
import { DynamoDBTable } from './dynamodb';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const appName = props?.stackName ?? 'appsync-node-api';

    const dynamodbTable = new DynamoDBTable(this, `${appName}-table`, {
      tableName: appName,
    });

    const api = new AppSyncAPI(this, `${appName}-appsync-api`, {
      apiNameName: appName,
      table: dynamodbTable.table,
      region: props?.env?.region ?? 'us-east-1',
    });

    new cdk.CfnOutput(this, 'graphqlEndpoint', {
      value: api.appsyncAPI.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'dynamoDBTableName', {
      value: dynamodbTable.table.tableName,
    });
  }
}
