import { Construct } from "constructs";
import {
  AuthorizationType,
  Definition,
  GraphqlApi,
} from "aws-cdk-lib/aws-appsync";
import path = require("path");
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { CreateUserResolver } from "./resolvers/createUserResolver";
import { GetUserResolver } from "./resolvers/getUserResolver";

interface AppSyncProps {
  apiNameName: string;
}

export class AppSyncAPI extends Construct {
  appsyncAPI: GraphqlApi;

  constructor(scope: Construct, id: string, props: AppSyncProps) {
    super(scope, id);

    this.appsyncAPI = new GraphqlApi(this, "Api", {
      name: props.apiNameName,
      definition: Definition.fromFile(
        path.join(__dirname, "../src/schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
    });

    // Create service role to AppSync to invoke lambda data sources
    new Role(this, "appsync-lambda-invocation-role", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
      inlinePolicies: {
        lambdaInvoke: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["lambda:invokeFunction"],
              resources: ["*"],
            }),
          ],
        }),
      },
    });

    // IAM role for lambda datasource
    const lambdaDataSourceRole = new Role(this, "DynamoDbFullAccessRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        {
          managedPolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    });

    lambdaDataSourceRole.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:*"],
        resources: ["*"],
      })
    );

    // Resolver for create user mutation
    new CreateUserResolver(this, "create-user-resolver", {
      appsyncAPI: this.appsyncAPI,
      resolverName: "create-user",
      role: lambdaDataSourceRole,
    });

    // Resolver for get user query
    new GetUserResolver(this, "get-user-resolver", {
      appsyncAPI: this.appsyncAPI,
      resolverName: "get-user",
      role: lambdaDataSourceRole,
    });
  }
}
