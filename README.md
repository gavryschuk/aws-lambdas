<!-- # BRANCH gamelift-get-active-player-session

This script generates and deploys lambda function to work with GameLift server fleet.

Lambda has a functionality to search for active game sessions, create new game sessions and create players sessions. [UE4GameLiftClientSDK](https://github.com/gavryschuk/UE4GameLiftClientSDK/tree/lambda) is used to communicate with Lambda without API Gateway!!!!

All the IAMPermissions to manage fleet instances also provided in this script and will be deployed to the AWS as a permisions policy for current Lambda.

Requirements for Lambda to work successfully:
- please change **FleetId** param according to your GameLift fleet Arn in index.ts
- when calling this function from UE4 client don't forget to provide **maxPlayers**:number and **playerID**:string as input params.


How to build and deploy the function please read further..... -->


# AWS Lambda in TypeScript

This sample uses the [Serverless Application Framework](https://serverless.com/) to implement an AWS Lambda function in TypeScript, deploy it via CloudFormation, and publish it through API Gateway.

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Linux Build Status](https://travis-ci.org/balassy/aws-lambda-typescript.svg?branch=master)](https://travis-ci.org/balassy/aws-lambda-typescript)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/cuo6yvampkiids7i/branch/master?svg=true)](https://ci.appveyor.com/project/balassy/aws-lambda-typescript/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/balassy/aws-lambda-typescript/badge.svg)](https://coveralls.io/github/balassy/aws-lambda-typescript)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/balassy/aws-lambda-typescript/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/balassy/aws-lambda-typescript.svg)](https://github.com/balassy/aws-lambda-typescript/issues)

[![Known Vulnerabilities](https://snyk.io/test/github/balassy/aws-lambda-typescript/badge.svg?targetFile=package.json)](https://snyk.io/test/github/balassy/aws-lambda-typescript?targetFile=package.json)
[![Dependencies](https://david-dm.org/balassy/aws-lambda-typescript/status.svg)](https://david-dm.org/balassy/aws-lambda-typescript)
[![DevDependencies](https://david-dm.org/balassy/aws-lambda-typescript/dev-status.svg)](https://david-dm.org/balassy/aws-lambda-typescript#type=dev)
[![codebeat badge](https://codebeat.co/badges/cd3e0118-3d7f-4c0d-8d27-14d05df5a356)](https://codebeat.co/projects/github-com-balassy-aws-lambda-typescript-master)
[![Greenkeeper badge](https://badges.greenkeeper.io/balassy/aws-lambda-typescript.svg)](https://greenkeeper.io/)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/2154/badge)](https://bestpractices.coreinfrastructure.org/projects/2154)

## SETUP

- Full **[TypeScript](https://www.typescriptlang.org/)** codebase with **strict** type annotation - _get as many compile time errors as possible._
- **Deployment to AWS** from the command line with [Serverless](https://serverless.com/) - _just run an npm script._
- Publishing to your **custom [Route53](https://aws.amazon.com/route53/) domain name** - _for API URLs that live forever._
- **Automated builds and CI** with [Travis CI](https://travis-ci.org/balassy/aws-lambda-typescript) on Linux and [AppVeyor](https://ci.appveyor.com/project/balassy/aws-lambda-typescript) on Windows - _get early feedback for every change_.
- **Offline** execution - _call your endpoints without deploying them to AWS._
- Minimal IAM policy to follow the **principle of least privilege** - _because with great power comes great responsibility_.
- **Code analysis** with [TSLint](https://palantir.github.io/tslint/) and [Codebeat](https://codebeat.co/projects/github-com-balassy-aws-lambda-typescript-master) - _avoid dumb coding mistakes._
- **Unit testing** with [Mocha](https://mochajs.org/), mocking with [ts-mockito](https://github.com/NagRock/ts-mockito) - _be free to change your implementation._
- Test **coverage report** with [Istanbul](https://istanbul.js.org/) and [Coveralls](https://coveralls.io) - _so you know your weak spots._
- **Dependency checks** and continuous update with [David](https://david-dm.org/), [Greenkeeper](https://greenkeeper.io/) and [Snyk](https://snyk.io)- _because the majority of your app is not your code._
- **[EditorConfig](http://editorconfig.org/)** settings - _for consistent coding styles between different editors._
- Sample CRUD implementation (in progress) - _to see it all in action_.
- Follows Linux Foundation Core Infrastructure Initiative **[Best Practices](https://bestpractices.coreinfrastructure.org/en)** - _for the open source community._

For updates, please check the [CHANGELOG](https://github.com/balassy/aws-lambda-typescript/blob/master/CHANGELOG.md).

## Setup

1. **Install [Node.js](https://nodejs.org).**

2. **Install the [Serverless Application Framework](https://serverless.com/) as a globally available package:**

```bash
npm install serverless -g
```

Verify that Serverless was installed correctly:

```
serverless -v
```

3. **Setup AWS credentials:**

  * Create a new IAM Policy in AWS using the `aws-setup/aws-policy.json` file. Note that the file contains placeholders for your `<account_no>`, `<region>`, `<service_name>`, and `<your_deployment_bucket>`.
  You can replace all those `Resource` ARNs with `*`, if you intentionally don't want to follow the Principle of Least Privilege, but want to avoid permission issues.
  (If you prefer minimal permissions, just like me, you may want to follow [Issue 1439: Narrowing the Serverless IAM Deployment Policy](https://github.com/serverless/serverless/issues/1439). )

  * Create a new IAM User for Programmatic Access only, assign the previously created policy to it, and get the Access Key ID and the Secret Access Key of the user.

  * Save the credentials to the `~/.aws/credentials` file:

  ```bash
  serverless config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY
  ```

  _Unfortunately on Windows you will need an Administrator user to run the Serverless CLI._

  You can read more about setting up AWS Credentials on the [AWS - Credentials page](https://serverless.com/framework/docs/providers/aws/guide/credentials/) of the Serverless Guide.

4. **Clone this repository.**

5. **Install the dependencies:**

```bash
npm install
```

6. **Customize the name of your service** by changing the following line in the `serverless.yml` file:

```
service: serverless-sample
```

7. **Customize the name of your domain** by changing the following lines in the `serverless.yml` file:

```
custom:
  customDomain:
    domainName: serverless-sample.balassy.me
    certificateName: serverless-sample.balassy.me
```

**NOTE:** You must have the certificate created in [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) before executing this command. According to AWS to use an ACM certificate with API Gateway, you must [request or import the certificate](https://serverless.com/blog/serverless-api-gateway-domain/) in the US East (N. Virginia) region.

If you don't want to publish your API to a custom domain, remove the `serverless-domain-manager` from the `plugins` section, and the `customDomains` entry from the `custom` section of the `serverless.yml` file.

## Read more

* [Serverless.yml Reference](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/)

## Acknowledments

Thanks to Shovon Hasan for his article on [Deploying a TypeScript + Node AWS Lambda Function with Serverless](https://blog.shovonhasan.com/deploying-a-typescript-node-aws-lambda-function-with-serverless/).


