/* eslint-disable @typescript-eslint/no-shadow */
import AuthClient, { generateNonce } from '@walletconnect/auth-client';
import { Web3Modal } from '@web3modal/standalone';
import React, { useCallback, useEffect, useState } from 'react';

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
	throw new Error('You need to provide NEXT_PUBLIC_PROJECT_ID env variable');
}

// 2. Configure web3Modal
const web3Modal = new Web3Modal({
	projectId,
	walletConnectVersion: 2,
});

const LoginForm = () => {
	const [client, setClient] = useState<AuthClient | null>();
	const [hasInitialized, setHasInitialized] = useState(false);
	const [uri, setUri] = useState<string>('');
	const [address, setAddress] = useState<string>('');

	const onSignIn = useCallback(() => {
		if (!client) return;
		client
			.request({
				aud: window.location.href,
				domain: window.location.hostname.split('.').slice(-2).join('.'),
				chainId: 'eip155:1',
				type: 'eip4361',
				nonce: generateNonce(),
				statement: 'Sign in with wallet.',
			})
			.then(({ uri }) => {
				if (uri) {
					setUri(uri);
				}
			});
	}, [client, setUri]);

	useEffect(() => {
		AuthClient.init({
			projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
			metadata: {
				name: 'react-dapp-auth',
				description: 'React Example Dapp for Auth',
				url: window.location.host,
				icons: [],
			},
		})
			.then((authClient) => {
				setClient(authClient);
				setHasInitialized(true);
				console.log('inited');
			})
			.catch(console.error);
	}, []);

	useEffect(() => {
		if (!client) return;
		client.on('auth_response', ({ params }) => {
			if ('code' in params) {
				console.error(params);
				return web3Modal.closeModal();
			}
			if ('error' in params) {
				console.error(params.error);
				if ('message' in params.error) {
					console.error('custom:', params.error.message);
				}
				return web3Modal.closeModal();
			}
			console.log('custom:', 'auth successfull');
			console.log('welcome:', params.result.p.iss.split(':')[4]);
			setAddress(params.result.p.iss.split(':')[4]);
		});
	}, [client]);

	useEffect(() => {
		async function handleOpenModal() {
			if (uri) {
				await web3Modal.openModal({
					uri,
					standaloneChains: ['eip155:1'],
				});
			}
		}
		handleOpenModal();
	}, [uri]);

	// TODO: Trigger page redirection to main
	useEffect(() => {
		if (address) {
			web3Modal.closeModal();
		}
	}, [address]);

	return (
		<>
			<div className="flex h-screen flex-1">
				<div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div>
							<img
								className="h-10 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt="Your Company"
							/>
							<h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-100">
								Sign in to your account
							</h2>
							<p className="mt-2 text-sm leading-6 text-gray-400">
								Don&apos;t have a wallet?{' '}
								<a
									href="https://zerion.io/"
									className="font-semibold text-indigo-600 hover:text-indigo-500"
								>
									Start now with Zerion
								</a>
							</p>
						</div>

						<div className="mt-10">
							<div className="mt-10">
								<div className="relative">
									<div className="absolute inset-0 flex items-center" aria-hidden="true">
										<div className="w-full border-t border-gray-200" />
									</div>
									<div className="relative flex justify-center text-sm font-medium leading-6">
										<span className="bg-gray-900 px-6 text-gray-100">continue with you wallet</span>
									</div>
								</div>

								<div className="mt-6 grid grid-cols-1 gap-4">
									<button
										disabled={!hasInitialized}
										onClick={onSignIn}
										className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-blue-600 px-3 py-1.5 text-white transition-all duration-150 ease-in-out hover:scale-105 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
									>
										<span className="text-sm font-semibold leading-6">Wallet Connect</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="relative hidden w-0 flex-1 lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
						alt="img"
					/>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
