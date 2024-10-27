import { Logger } from '@aws-lambda-powertools/logger';
import { LambdaLogFormatter } from './logFormatter';
import { LogLevel } from '@aws-lambda-powertools/logger/lib/cjs/types/Logger';

const getLogger = (loggedBy: string, logLevel: LogLevel = 'INFO'): Logger => {
  return new Logger({
    logLevel,
    serviceName: 'ref-architecture',
    logFormatter: new LambdaLogFormatter(),
    persistentLogAttributes: {
      env: process.env.ENV,
      loggedBy,
    },
  });
};

export default getLogger;
