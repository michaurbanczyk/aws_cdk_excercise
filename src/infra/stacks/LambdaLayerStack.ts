import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {LayerVersion} from "aws-cdk-lib/aws-lambda";


export class LambdaLayerStack extends Stack {

    public readonly sharedLayer: LayerVersion

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.sharedLayer = new lambda.LayerVersion(this, 'shared-layer', {
            code: lambda.Code.fromAsset('dist'),
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
            layerVersionName: 'shared-layer',
        })

        this.exportValue(this.sharedLayer.layerVersionArn)
    }
}