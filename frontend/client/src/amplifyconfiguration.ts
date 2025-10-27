import type { ResourcesConfig } from 'aws-amplify';

const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_zRhAEejDD',
      userPoolClientId: '1jfoo4tfqmgkma7n1o51scumkb',
      identityPoolId: 'us-east-1:8315e4fa-7dce-4183-b395-228a34c20375',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: 'https://lu4nniemo5bpbntgovjdqfsy64.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'userPool',
      apiKey: 'da2-2ph2eluoungwjjsj776zaqekum',
    },
  },
  Storage: {
    S3: {
      bucket: 'amplify-joblanderv4-chris-joblanderstoragebucket26-hzjb92i7sfbm',
      region: 'us-east-1',
    },
  },
};

export default amplifyConfig;