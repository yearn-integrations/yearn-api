# Yearn API

Yearn API is a collection of Serverless API endpoints focused on Yearn integrations.

Yearn API intentions are as follows:

- Provide free API endpoints to simplify 3rd party integration with Yearn
- Provide an "API playground" (Swagger UI) anyone can use to quickly browse and test available APIs
- Document all existing APIs
- Allow the entire API stack to be forked to enable community involvement in API development

## Interact

[https://test.daoventures.co/api/api-docs/]

## Setup Instructions

### Quick start

- Install docker
- Execute terminal commands

```cmd
git clone [https://github.com/daoventures/yearn-api.git]
cd yearn-api
cp .env.example .env
docker-compose up
```

- The API should now be running locally on your dev machine

### Optional - Configure environment variables

- .env.example contains sample API keys for various services (Infura/Etherscan). This is done to enable developers to get up to speed quickly. If you are planning on developing APIs that extensively utilize these keys please consider generating new API keys :)
- Update your .env file to use your own custom web3, archive node, and graph endpoints
- Update your .env file to use your own custom AWS Credentials

## Usage Instructions

### Use "Offline Mode" for local development and testing

- Run the command `docker-compose up` to test API endpoints locally
- You can reach the API under localhost:3000
  - If you want to change the local port, change the "ports" entry under "serverless" in the docker-compose.yml
- The dirs config, services and utils are mounted into the running container, so you code changes will become available instantly on the running instance
  - If you want to change that, remove the "volumes" entries under "serverless" in the docker-compose.yml

## Stages

- Currently three stages are available
- `beta` is used for beta deployments. Beta endpoint is [https://beta.daoventures.co/api/]
- `test` is used for development purposes. Development endpoint is [https://test.daoventures.co/api/]

## Testing Locally

Comment out the following line in docker-compose.yml

```yml
command: [--auth]
```
