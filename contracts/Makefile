SHELL:=/bin/bash

deployMantle:
	source .env; \
	forge script script/Deploy.s.sol:DeployScript --rpc-url $${MANTLE_RPC_URL} --broadcast --legacy

# TODO the deployment doesn't works yet
deployNeon:
	source .env; \
	forge script script/Deploy.s.sol:DeployScript --rpc-url $${NEON_RPC_URL} --broadcast --legacy

deployGnosis:
	source .env; \
	forge script script/Deploy.s.sol:DeployScript --rpc-url $${GNOSIS_RPC_URL} --broadcast 

compile:
	forge compile

test:
	forge test

.PHONY: deployMantle deployNeon deployGnosis test compile