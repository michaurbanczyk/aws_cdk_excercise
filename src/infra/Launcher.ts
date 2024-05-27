import {App} from "aws-cdk-lib";
import {LambdaStack} from "./stacks/LambdaStack";


const app = new App()
const lambdaStack = new LambdaStack(app, 'LambdaStack', {})