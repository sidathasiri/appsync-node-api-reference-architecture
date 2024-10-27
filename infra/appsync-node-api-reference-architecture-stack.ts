import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppSyncAPI } from './appsync';
import { DynamoDBTable } from './dynamodb';

const apiName = 'my-api';
const tableName = 'my-table';

export class AppsyncNodeApiReferenceArchitectureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new AppSyncAPI(this, 'appsync-api', {
      apiNameName: apiName,
    });

    const dynamodbTable = new DynamoDBTable(this, 'dynamodb-table', {
      tableName: tableName,
    });

    new cdk.CfnOutput(this, 'graphqlEndpoint', {
      value: api.appsyncAPI.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'dynamoDBTableName', {
      value: dynamodbTable.table.tableName,
    });
  }
}
