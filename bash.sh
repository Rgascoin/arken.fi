USER=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
APE_HOLDER=0xF977814e90dA44bFA03b6295A0616a897441aceC
APE=0x4d224452801ACEd8B2F0aebE155379bb5D594381

cast rpc anvil_impersonateAccount $APE_HOLDER
cast send $APE --unlocked --from $APE_HOLDER "transfer(address,uint256)(bool)" $USER "1004471081871801446777"

cast rpc anvil_stopImpersonatingAccount $APE_HOLDER