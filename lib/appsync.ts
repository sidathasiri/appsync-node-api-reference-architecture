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
import { CreateUserResolver } from "./resolvers/createUser/resolver";

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

    // Resolver for create user mutation
    new CreateUserResolver(this, "create-user-resolver", {
      appsyncAPI: this.appsyncAPI,
      resolverName: "create-user",
    });
  }
}
