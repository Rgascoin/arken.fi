# Operator

This part is a server which will call harvest and compound on every deployed vault by an instance.

It also provides a REST API to get a operator address for each vault.

## How to use

You first need to set the .env file with the following variables:

```
JSON_RPC_URL=
MNEMONICS=
FACTORY_ADDRESS=
PORT=3000
```

Then, you can run the following command:

```
yarn dev
```

## API

### Get an operator address

```
GET /
```