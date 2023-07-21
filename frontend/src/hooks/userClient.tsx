import { useEffect, useState } from 'react';

export interface UserClientInterface {
	address: string | undefined;
	login: ((a: string) => Promise<boolean>) | undefined;
	logout: (() => Promise<void>) | undefined;
}

const userInitialState: UserClientInterface = {
	address: undefined,
	login: undefined,
	logout: undefined,
};

const UseUserClient = () => {
	const [address, setAddress] = useState<string | undefined>(undefined);

	// TODO: Fetch the user automatically at loading if possible
	useEffect(() => {
		const pkh = localStorage.getItem('accountPkh');
		if (pkh) setAddress(pkh);
	}, []);

	const login = async (addressParam: string) => {
		try {
			localStorage.setItem('accountPkh', addressParam);
			setAddress(addressParam);
		} catch (e: any) {
			console.error(e);
			return false;
		}

		return true;
	};

	const logout = async () => {
		await setAddress(undefined);
	};

	return {
		address,
		login,
		logout,
	} as UserClientInterface;
};

export { userInitialState, UseUserClient };
