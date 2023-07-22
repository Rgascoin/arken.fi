deployMantle:
	source .env \
	forge script --rpc-url $MANTLE_RPC_URL

deployNeon:
	source .env \
	forge script --rpc-url $NEON_RPC_URL

deployGnosis:
	source .env \
	forge script --rpc-url $GNOSIS_RPC_URL

deployZetaChain:
	source .env \
	forge script --rpc-url $ZETACHAIN_RPC_URL

compile:
	forge compile

test:
	forge test

.PHONY: deployMantle deployNeon deployGnosis deployZetaChain test compile