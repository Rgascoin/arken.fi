/* eslint-disable @typescript-eslint/no-shadow */
import Web3Modal from 'web3modal';

import { useSignIn } from '@walletconnect/modal-auth-react';
import { useRouter } from 'next/router';
import * as process from 'process';
import React, {useEffect} from 'react';

import { useUserContext } from '../contexts/userContext';
import {ethers} from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			appName: 'akren.fi',
			infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
			darkMode: true,
		},
	},
};

let web3Modal: Web3Modal | null;
if (typeof window !== 'undefined') {
	web3Modal = new Web3Modal({
		network: 'mainnet', // optional
		cacheProvider: true,
		providerOptions, // required
	});
}

const LoginForm = () => {
	const router = useRouter();
	const userClient = useUserContext();
	const { signIn, data, error } = useSignIn({
		statement: 'Connect to my dapp',
		aud: process.env.NEXT_PUBLIC_DOMAIN,
	});

	const onSignIn = async () => {
		if (!web3Modal || !userClient.setProvider || !userClient.setAddress) {
			console.error('cant init login')
			return;
		}
		const provider = await web3Modal.connect();
		const web3Provider = new ethers.BrowserProvider(provider);
		const signer = await web3Provider.getSigner();
		const address = await signer.getAddress();

		await userClient.setProvider(web3Provider);
		await userClient.setAddress(address);

		await router.push('/app/userDashboard')
	};

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
						src="https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format"
						alt="Unsplay display"
					/>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
