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
    public readonly pollingData: lambda.Function

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const sharedLayer = new lambda.LayerVersion(this, 'shared-layer', {
            code: lambda.Code.fromAsset('dist'),
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
            layerVersionName: 'shared-layer',
        })

        this.getData = new lambda.Function(this, 'GetData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'get_handler.get_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            },
            layers: [sharedLayer]
        });

        this.postData = new lambda.Function(this, 'PostData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'post_handler.post_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            },
            layers: [sharedLayer]
        });

        this.deleteData = new lambda.Function(this, 'DeleteData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'delete_handler.delete_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            },
            layers: [sharedLayer]
        });

        this.pollingData = new lambda.Function(this, 'PollingData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'polling_handler.polling_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            },
            layers: [sharedLayer]
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

        // new aws_events.Rule(this, "my-rule-identifier", {
        //     schedule: aws_events.Schedule.rate(Duration.minutes(1)),
        //     targets: [new aws_events_targets.LambdaFunction(this.pollingData)],
        // });

        this.exportValue(this.postData.functionArn)
        this.exportValue(this.getData.functionArn)
        this.exportValue(this.deleteData.functionArn)
        this.exportValue(this.pollingData.functionArn)
    }
}