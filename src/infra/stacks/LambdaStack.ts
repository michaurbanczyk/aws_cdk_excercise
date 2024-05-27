import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class LambdaStack extends Stack {

    public readonly helloWorldLambda: lambda.Function

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.helloWorldLambda = new lambda.Function(this, 'HelloWorldFunction', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services'),
            handler: 'handler.handler',
        });

    }
}