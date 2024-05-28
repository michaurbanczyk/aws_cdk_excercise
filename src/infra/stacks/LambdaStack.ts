import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {ITable} from "aws-cdk-lib/aws-dynamodb";


interface LambdaStackProps extends StackProps {
    exerciseTable: ITable
}

export class LambdaStack extends Stack {

    public readonly getData: lambda.Function
    public readonly postData: lambda.Function

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.getData = new lambda.Function(this, 'GetData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services'),
            handler: 'get_handler.get_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            }
        });

        this.postData = new lambda.Function(this, 'PostData', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset('src/services'),
            handler: 'post_handler.post_data',
            environment: {
                TABLE_NAME: props.exerciseTable.tableName
            }
        });

        this.exportValue(this.postData.functionArn)
    }
}