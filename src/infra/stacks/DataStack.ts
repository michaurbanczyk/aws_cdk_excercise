import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {AttributeType, ITable, Table} from "aws-cdk-lib/aws-dynamodb";


export class DataStack extends Stack {

    public readonly exerciseTable: ITable

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.exerciseTable = new Table(this, 'Exercise', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: `ExerciseDynamoTable`
        })
    }
}