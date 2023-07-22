import { ChartBarSquareIcon, Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Core from '../../components/app/admindashboard/core';
import Layout from '../../components/app/layout';

const navigation = [
	{ name: 'User - Dashboard', href: '/app/userDashboard', icon: ChartBarSquareIcon, current: false },
	{ name: 'Admin - Dashboard', href: '/app/adminDashboard', icon: PlusIcon, current: true },
];

const Dashboard = () => {
	return (
		<div className={'bg-gray-800'}>
			<Layout navigation={navigation}>
				<Core />
			</Layout>
		</div>
	);
};

export default Dashboard;
