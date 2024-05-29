import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {ITable} from "aws-cdk-lib/aws-dynamodb";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";


interface LambdaStackProps extends StackProps {
    exerciseTable: ITable,
}

export class LambdaStack extends Stack {

    public readonly getData: lambda.Function
    public readonly postData: lambda.Function
    public readonly deleteData: lambda.Function

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.getData = new lambda.Function(this, 'GetData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'get_handler.get_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            }
        });

        this.postData = new lambda.Function(this, 'PostData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'post_handler.post_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            }
        });

        this.deleteData = new lambda.Function(this, 'DeleteData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'delete_handler.delete_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            }
        });

        this.postData.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.exerciseTable.tableArn],
            actions: [
                'dynamodb:PutItem',
            ]
        }))

        this.getData.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.exerciseTable.tableArn],
            actions: [
                'dynamodb:Scan',
                'dynamodb:GetItem',
            ]
        }))

        this.deleteData.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [props.exerciseTable.tableArn],
            actions: [
                'dynamodb:DeleteItem',
            ]
        }))

        this.exportValue(this.postData.functionArn)
        this.exportValue(this.getData.functionArn)
        this.exportValue(this.deleteData.functionArn)
    }
}