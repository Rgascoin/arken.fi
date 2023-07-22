SHELL:=/bin/bash

deployMantle:
	source .env; \
	forge script script/Deploy.s.sol:DeployScript --rpc-url $${MANTLE_RPC_URL} --broadcast --legacy

# TODO the deployment doesn't works yet
deployNeon:
	source .env; \
	forge script script/Deploy.s.sol:DeployScript --gas-limit 100000000000 --rpc-url $${NEON_RPC_URL} --broadcast --legacy

deployGnosis:
	source .env; \
	forge script script/Deploy.s.sol:DeployScript --rpc-url $${GNOSIS_RPC_URL} --broadcast 

createApeVault:
	source .env; \
	forge script script/ApeVault.s.sol:ApeVaultScript --broadcast --rpc-url http://localhost:8545

createMockVault:
	source .env; \
	forge script script/MockVault.s.sol:MockVaultScript --broadcast --rpc-url http://localhost:8545

deployLocal:
	source .env; \
	forge script script/Deploy.s.sol:DeployScript --broadcast --rpc-url http://localhost:8545

local:
	source .env; \
	anvil --fork-url $${MAINNET_RPC_URL}

compile:
	forge compile

test:
	forge test

.PHONY: deployMantle deployNeon deployGnosis test compile