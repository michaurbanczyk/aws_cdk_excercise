import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface ApiStackProps extends StackProps {
    getData: lambda.Function
    postData: lambda.Function
    deleteData: lambda.Function
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const {getData, postData, deleteData} = props

        const getDataIntegration = new LambdaIntegration(getData)
        const postDataIntegration = new LambdaIntegration(postData)
        const deleteDataIntegration = new LambdaIntegration(deleteData)
        const api = new RestApi(this, 'ExerciseApi')
        const exerciseResource = api.root.addResource('exercise')
        exerciseResource.addMethod('GET', getDataIntegration)
        exerciseResource.addMethod('POST', postDataIntegration)
        exerciseResource.addMethod('DELETE', deleteDataIntegration)
    }
}