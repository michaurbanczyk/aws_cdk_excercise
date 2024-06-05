import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {
    AuthorizationType,
    CognitoUserPoolsAuthorizer,
    LambdaIntegration,
    MethodOptions,
    RestApi
} from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {IUserPool} from "aws-cdk-lib/aws-cognito";

interface ApiStackProps extends StackProps {
    getData: lambda.Function
    postData: lambda.Function
    deleteData: lambda.Function
    userPool: IUserPool
}

export class ApiStack extends Stack {

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const {getData, postData, deleteData} = props

        const getDataIntegration = new LambdaIntegration(getData)
        const postDataIntegration = new LambdaIntegration(postData)
        const deleteDataIntegration = new LambdaIntegration(deleteData)
        const api = new RestApi(this, 'ExerciseApi')

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'ExerciseAuthorizer', {
            cognitoUserPools: [props.userPool],
            identitySource: 'method.request.header.Authorization'
        })

        authorizer._attachToApi(api)

        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }

        const exerciseResource = api.root.addResource('exercise')
        exerciseResource.addMethod('GET', getDataIntegration, optionsWithAuth)
        exerciseResource.addMethod('POST', postDataIntegration, optionsWithAuth)
        exerciseResource.addMethod('DELETE', deleteDataIntegration, optionsWithAuth)
    }
}