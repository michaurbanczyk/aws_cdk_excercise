import {App} from "aws-cdk-lib";
import {LambdaStack} from "./stacks/LambdaStack";
import {ApiStack} from "./stacks/ApiStack";
import {DataStack} from "./stacks/DataStack";


const app = new App()
const dataStack = new DataStack(app, 'DataStack')
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    exerciseTable: dataStack.exerciseTable
})
new ApiStack(app, 'ApiStack', {
    getData: lambdaStack.getData,
    postData: lambdaStack.postData,
})