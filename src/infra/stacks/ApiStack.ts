import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import { Fn } from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";

interface ApiStackProps extends StackProps {
    helloWorldLambda: lambda.Function
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const {helloWorldLambda} = props

        const lambdaIntegration = new LambdaIntegration(helloWorldLambda)
        const api = new RestApi(this, 'ExerciseApi')
        const exerciseResource = api.root.addResource('exercise')
        exerciseResource.addMethod('GET', lambdaIntegration)
    }
}