import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';

interface DynamoDBProps {
  tableName: string;
}

export class DynamoDBTable extends Construct {
  table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DynamoDBProps) {
    super(scope, id);

    const tableProps: dynamodb.TableProps = {
      tableName: props.tableName,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableClass: dynamodb.TableClass.STANDARD,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    };

    // Create DynamoDB Table
    this.table = new dynamodb.Table(this, props.tableName, tableProps);
  }
}
