import * as cdk from "aws-cdk-lib";
import {
  AuthorizationType,
  Definition,
  GraphqlApi,
} from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";
import path = require("path");
import { AppSyncAPI } from "./appsync";
import { DynamoDBTable } from "./dynamodb";

const apiName = "my-api";
const tableName = "my-table";

export class AppsyncNodeApiReferenceArchitectureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new AppSyncAPI(this, "appsync-api", {
      apiNameName: apiName,
    });

    const dynamodbTable = new DynamoDBTable(this, "dynamodb-table", {
      tableName: tableName,
    });
  }
}
