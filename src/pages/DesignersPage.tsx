import DesignersList from '../components/designers/DesignerList'

const DesignersPage = () => {
	return (
		<section className='space-y-6'>
			<div className='space-y-2'>
				<p className='text-xs uppercase tracking-[0.3em] text-black/50'>
					Designer Directory
				</p>
				<h2 className='text-2xl font-semibold text-black'>Designers</h2>
				<p className='max-w-2xl text-sm text-black/60'>
					Track availability, workload, and assignments before moving
					into the 3D scene.
				</p>
			</div>
			<DesignersList />
		</section>
	)
}

export default DesignersPage
