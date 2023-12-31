import { ChartBarSquareIcon, Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Layout from '../../components/app/layout';
import Core from '../../components/app/userdashboard/core';

const navigation = [
	{ name: 'User - Dashboard', href: '/app/userDashboard', icon: ChartBarSquareIcon, current: true },
	{ name: 'Admin - Dashboard', href: '/app/adminDashboard', icon: PlusIcon, current: false },
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
