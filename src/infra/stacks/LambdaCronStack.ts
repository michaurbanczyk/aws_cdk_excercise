import {aws_events, aws_events_targets, Duration, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {ITable} from "aws-cdk-lib/aws-dynamodb";
import {ILayerVersion} from "aws-cdk-lib/aws-lambda";


interface LambdaStackProps extends StackProps {
    exerciseTable: ITable,
    sharedLayer: ILayerVersion
}

export class LambdaCronStack extends Stack {

    public readonly pollingData: lambda.Function

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.pollingData = new lambda.Function(this, 'PollingData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services/lambdas'),
            handler: 'polling_handler.polling_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            },
            layers: [props.sharedLayer]
        });

        // new aws_events.Rule(this, "my-rule-identifier", {
        //     schedule: aws_events.Schedule.rate(Duration.minutes(1)),
        //     targets: [new aws_events_targets.LambdaFunction(this.pollingData)],
        // });

    }
}