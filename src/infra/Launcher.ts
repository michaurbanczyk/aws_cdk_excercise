import {App} from "aws-cdk-lib";
import {LambdaStack} from "./stacks/LambdaStack";
import {ApiStack} from "./stacks/ApiStack";
import {DataStack} from "./stacks/DataStack";
import {LambdaLayerStack} from "./stacks/LambdaLayerStack";
import {LambdaCronStack} from "./stacks/LambdaCronStack";


const app = new App()
const dataStack = new DataStack(app, 'DataStack')
const lambdaLayerStack = new LambdaLayerStack(app, 'LambdaLayerStack', {})
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    exerciseTable: dataStack.exerciseTable
})
new LambdaCronStack(app, 'LambdaCronStack', {
    exerciseTable: dataStack.exerciseTable,
    sharedLayer: lambdaLayerStack.sharedLayer
})
new ApiStack(app, 'ApiStack', {
    getData: lambdaStack.getData,
    postData: lambdaStack.postData,
    deleteData: lambdaStack.deleteData,
})