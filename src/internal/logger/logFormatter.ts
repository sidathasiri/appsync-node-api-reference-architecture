import { LogFormatter, LogItem } from '@aws-lambda-powertools/logger';
import type { UnformattedAttributes } from '@aws-lambda-powertools/logger/types';

class LambdaLogFormatter extends LogFormatter {
  public formatAttributes(attributes: UnformattedAttributes): LogItem {
    const baseAttributes = {
      message: attributes.message,
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

    return new LogItem({ attributes: baseAttributes });
  }
}

export { LambdaLogFormatter };
