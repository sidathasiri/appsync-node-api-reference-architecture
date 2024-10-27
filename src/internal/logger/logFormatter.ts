import { LogFormatter, LogItem } from '@aws-lambda-powertools/logger';
import type {
  LogAttributes,
  UnformattedAttributes,
} from '@aws-lambda-powertools/logger/types';

class LambdaLogFormatter extends LogFormatter {
  public formatAttributes(
    attributes: UnformattedAttributes,
    additionalLogAttributes: LogAttributes
  ): LogItem {
    const baseAttributes = {
      message: attributes.message,
      data: attributes.data,
      service: attributes.serviceName,
      environment: attributes.environment,
      awsRegion: attributes.awsRegion,
      correlationId: attributes.lambdaContext?.awsRequestId,
      lambdaFunction: {
        name: attributes.lambdaContext?.functionName,
        arn: attributes.lambdaContext?.invokedFunctionArn,
        memoryLimitInMB: attributes.lambdaContext?.memoryLimitInMB,
        version: attributes.lambdaContext?.functionVersion,
        coldStart: attributes.lambdaContext?.coldStart,
      },
      logLevel: attributes.logLevel,
      timestamp: attributes.timestamp,
    };

    const logItem = new LogItem({ attributes: baseAttributes });
    logItem.addAttributes(additionalLogAttributes);
    return logItem;
  }
}

export { LambdaLogFormatter };
