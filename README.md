### Serverless TODO APP on AWS

**A simple serverless TODO APP built on the AWS stack**

--

## Tech Stack
-- AWS Lambda
-- AWS Dynamodb
-- AWS XRay
-- AWS APIGateway
-- AWS S3
-- Auth0
-- React Framewaork
-- Typescript
-- Node.js

## Prerequisites

### Node.js and Node Package Manager (NPM)
Make sure you have [Node.js](http://nodejs.org/) installed locally

### Serverless Framework
Serverless Framework is an open source tool that ease the development and deployment of cloud applications it supports cloud providers like, AWS, Azure, Google Cloud, Knative & more. you can read about installation as regards AWS and servverless framework [here](https://www.serverless.com/framework/docs/providers/aws/guide/installation/) or if you alreadyh have NPM installed as stated above you can simply install and configure serverless framework globally by running these commands:

```sh
npm install -g serverless
serverless
```

### Amazon Web Services (AWS) Account
An AWS account is required to deploy the account since this application is built to be run on AWS, you can read about creating an AWS account [here](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)

### Auth0 Account
Auth0 is an authentication and authorization cloud provider, an Auth0 application should be created with the single web application option [here](https://auth0.com/docs/quickstart/spa) with RS256 encryption algorithm. ensure you update the serverless.yml environment configuration section with your jwksurl and the client config.ts file with your Auth0 application `clientId` and `domain`

## Getting started

### Backend

Configure the serverless configuration file in `backend/serverless.yml` to set the appropriate AWS and Auth0 parameters, then run the following commands:

```sh
cd backend
npm install
serverless deploy -v
```

### Frontend
Configure the config file in `client/src/config.ts` to set the AWS and Auth0 parameters, the APPID and apiEndpoint are the value returned from serverless after the deployment is complete. to start the frontend application run the following commands

```sh
cd client
npm install
npm run start
```

The frontend react app should now be running on [localhost:3000](http://localhost:3000/).

## Acknowledgements

This project was bootstrapped from this repository [https://github.com/udacity/cloud-developer/tree/master/course-04/project/c4-final-project-starter-code](https://github.com/udacity/cloud-developer/tree/master/course-04/project/c4-final-project-starter-code).
