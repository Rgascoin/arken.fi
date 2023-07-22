import '../styles/globals.css';

import { WalletConnectModalAuth } from '@walletconnect/modal-auth-react';
import type { AppProps } from 'next/app';
import process from 'process';

import { UserContextProvider } from '../contexts/userContext';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<UserContextProvider>
				<Component {...pageProps} />
			</UserContextProvider>
			<WalletConnectModalAuth
				projectId={'5ddf79a8137abafd0b4ccdf917e34fbb'}
				metadata={{
					name: 'Ethglobal2',
					description: 'Defi APP Eth global',
					url: process.env.NEXT_PUBLIC_DOMAIN as string,
					icons: [],
				}}
			/>
		</>
	);
}

export default MyApp;
