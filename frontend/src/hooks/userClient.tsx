import {ethers, Provider} from 'ethers'
import Web3Modal from 'web3modal';
import {useCallback, useEffect, useState} from 'react';
import WalletConnectProvider from "@walletconnect/web3-provider";

export interface UserClientInterface {
	address: string | undefined;
	provider: Provider | undefined;
	pickedDeposit: any;
	setPickedDeposit: ((a: any) => Promise<void>) | undefined;
	setProvider: ((a: Provider) => Promise<void>) | undefined;
	setAddress: ((a: string) => Promise<void>) | undefined;
}

const userInitialState: UserClientInterface = {
	address: undefined,
	provider: undefined,
	pickedDeposit: undefined,
	setPickedDeposit: undefined,
	setProvider: undefined,
	setAddress: undefined,
};

const UseUserClient = () => {
	const [address, setAddress] = useState<string | undefined>(undefined);
	const [provider, setProvider] = useState<Provider | undefined>(undefined);
	const [pickedDeposit, setPickedDeposit] = useState<any>(undefined);

	// TODO: Fetch the user automatically at loading if possible
	useEffect(() => {
		const pkh = localStorage.getItem('accountPkh');
		if (pkh) setAddress(pkh);
	}, []);


	return {
		address,
		provider,
		pickedDeposit,
		setPickedDeposit,
		setAddress,
		setProvider,
	} as UserClientInterface;
};

export { userInitialState, UseUserClient };
