import { Construct } from "constructs";
import { IGraphqlApi, Resolver } from "aws-cdk-lib/aws-appsync";
import { CreateUserDataSource } from "./datasource";

interface CreateUserResolverProps {
  appsyncAPI: IGraphqlApi;
  resolverName: string;
}

export class CreateUserResolver extends Construct {
  constructor(scope: Construct, id: string, props: CreateUserResolverProps) {
    super(scope, id);

    const dataSource = new CreateUserDataSource(this, "create-user-resolver", {
      appsyncAPI: props.appsyncAPI,
      dataSourceName: `${props.resolverName}-ds`,
      functionName: `${props.resolverName}-function`,
    });

    new Resolver(this, "pipeline", {
      api: props.appsyncAPI,
      dataSource: dataSource.lambdaDataSource,
      typeName: "Mutation",
      fieldName: "createUser",
    });
  }
}
