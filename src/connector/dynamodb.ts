import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBItem } from '../type/DynamoDBItem';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export class DynamoDBConnector {
  client: DynamoDBClient;

  tableName: string;

  constructor(region: string, tableName: string) {
    this.client = new DynamoDBClient({ region });
    this.tableName = tableName;
  }

  createItem(item: DynamoDBItem): Promise<PutItemCommandOutput> {
    const params = {
      TableName: this.tableName,
      Item: marshall({
        ...item,
      }),
    };
    return this.client.send(new PutItemCommand(params));
  }

  async getItemByKey(
    pk: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Record<string, any> | null> {
    const param = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pkValue',
      ExpressionAttributeValues: {
        ':pkValue': { S: pk },
      },
    };

    const { Items } = await this.client.send(new QueryCommand(param));
    if (Items && Items.length > 0) {
      return unmarshall(Items[0]);
    } else {
      return null;
    }
  }

  deleteItemByKey(pk: string) {
    const params = {
      TableName: this.tableName,
      Key: marshall({ pk }),
    };

    const command = new DeleteItemCommand(params);
    return this.client.send(command);
  }
}
