import { type PropsWithChildren } from 'react'
import Navigation from './Navigation'

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className='min-h-screen px-6 pb-16 pt-10'>
			<div className='mx-auto flex w-full max-w-6xl flex-col gap-12'>
				<header className='flex flex-wrap items-center justify-between gap-6 border-b border-black/10 pb-6'>
					<div className='space-y-2'>
						<p className='text-xs uppercase tracking-[0.4em] text-black/50'>
							Studio Console
						</p>
						<h1 className='text-3xl font-semibold leading-tight text-black'>
							Spatial Design Dashboard
						</h1>
					</div>
					<Navigation />
				</header>
				<main className='flex min-h-[60vh] flex-col gap-10'>
					{children}
				</main>
			</div>
		</div>
	)
}

export default Layout
