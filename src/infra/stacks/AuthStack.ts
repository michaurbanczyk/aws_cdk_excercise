import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import {CfnUserPoolGroup, UserPool, UserPoolClient} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import {CfnUserGroup} from "aws-cdk-lib/aws-elasticache";


export class AuthStack extends Stack {

    public userPool: UserPool;
    private userPoolClient: UserPoolClient;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.createUserPool();
        this.createUserPoolClient();
        this.createAdminGroup();
    }

    private createUserPool(){
        this.userPool = new UserPool(this, 'ExerciseUserPool', {
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });

        new CfnOutput(this, 'ExerciseUserPoolId', {
            value: this.userPool.userPoolId
        })
    }
    private createUserPoolClient(){
        this.userPoolClient = this.userPool.addClient('ExerciseUserPoolClient', {
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            }
        });
        new CfnOutput(this, 'ExerciseUserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        })
    }

    private createAdminGroup(){
        new CfnUserPoolGroup(this, 'ExerciseAdmins', {
            userPoolId: this.userPool.userPoolId,
            groupName: 'admins'
        })

    }
}