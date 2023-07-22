import MainPanel from './mainPanel';
import SidePanel from './sidePanel';

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

const Core = () => {
	return (
		<div>
			<main className="lg:pr-96">
				<header className="flex items-center justify-between border-b border-white/5 p-4 sm:p-6 lg:px-8">
					<div className={'text-gray-400'}>
						<h1 className="text-base font-semibold leading-7 text-white">Deposit List</h1>
						<h2>View all your deposit list</h2>
						<button
							className={
								'my-3 cursor-pointer rounded-xl border border-indigo-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600'
							}
						>
							+ New Stake
						</button>
					</div>
				</header>

				{/* Main list */}
				<MainPanel />
			</main>

			{/* Side feed */}
			<SidePanel />
		</div>
	);
};

export default Core;
