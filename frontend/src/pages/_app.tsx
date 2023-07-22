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
		</>
	);
}

export default MyApp;
