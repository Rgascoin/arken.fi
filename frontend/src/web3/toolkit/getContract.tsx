import { Contract, ethers } from 'ethers';
import React from 'react';

const getContract = (contractAddress: string, contractAbi: any, signer: any): Contract | undefined => {
	if (typeof window !== 'undefined') {
		try {
			return new ethers.Contract(contractAddress as string, contractAbi.abi, signer);
		} catch (e: any) {
			return undefined;
		}
	}
	return undefined;
};

export default getContract;
