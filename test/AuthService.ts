import {Amplify, Auth} from 'aws-amplify'


const awsRegion = 'eu-central-1'

Amplify.configure({
    Auth: {
        region: awsRegion,
        userPoolId: 'eu-central-1_ykfLAPphY',
        userPoolWebClientId: '3eqha6rj1ba38jrcegdoeip0tt',
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})

export class AuthService{
    public async login(userName: string, password: string){
        const result = await Auth.signIn(userName, password)
        return result
    }
}